using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Data;
using YourStoryAPI.Models;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;


namespace YourStoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly YourStoryDbContext _context;
        private readonly IConfiguration _configuration;

        private readonly IWebHostEnvironment _environment;

        public UserController(YourStoryDbContext context, IConfiguration configuration, IWebHostEnvironment environment)
        {
            _context = context;
            _configuration = configuration;
            _environment = environment;
        }

        // CREATE JWT TOKEN
        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim("UserId", user.id.ToString()),
                new Claim("UserName", user.users_name)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        //FIND
        private User? FindByMail(string mail)
        {
            User? user = _context.Users.FirstOrDefault(x => x.email == mail);
            return user;
        }

        private User? FindById(int id)
        {
            User? user = _context.Users.FirstOrDefault(x => x.id == id);
            return user;
        }

        //SIGN UP
        [HttpPost("signup")]
        public IActionResult SignUp(User user)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            if (FindByMail(user.email) != null)
                return BadRequest("User exist");

            user.created_day = DateTime.Now;

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(
                new
                {
                    user.avatar_url,
                    user.users_name,
                    user.email,
                    user.created_day
                });
        }


        //LOGIN
        [HttpPost("login")]
        public IActionResult Login(string username, string pass)
        {
            User? user = _context.Users.FirstOrDefault(x => x.users_name == username && x.pass_word == pass);
            if (user == null)
                return Unauthorized("Invalid username or password");

            string token = GenerateToken(user);
            return Ok(
                new
                {
                    token,
                    user.avatar_url,
                    user.users_name,
                    user.email,
                    user.created_day
                });
        }

        //VIEW Profile
        [Authorize]
        [HttpGet("profile")]
        public IActionResult ViewProfile()
        {

            int id = int.Parse(User.FindFirst("UserId")!.Value);

            User? user = FindById(id);
            if (user == null)
                return NotFound();

           
            return Ok(
                new
                {
                    user.avatar_url,
                    user.users_name,
                    user.email,
                    user.created_day
                });
        }

        //RENAME
        [Authorize]
        [HttpPut("rename")]
        public IActionResult RenameUser( string newName )
        {
            int id = int.Parse(User.FindFirst("UserId")!.Value);

            User? user = FindById(id);
            if (user == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(newName))
                return BadRequest();
            
            user.users_name = newName;
            _context.SaveChanges();

            return Ok(new { users_name = user.users_name });
        }


        //UPDATE profile
        [Authorize]
        [HttpPut("profile")]
        public IActionResult UpdateProfile( User newUser )
        {
            int id = int.Parse(User.FindFirst("UserId")!.Value);

            User? user = FindById(id);
            if (user == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(newUser.users_name))
                return BadRequest("Username cannot be empty");

            user.users_name = newUser.users_name;
            user.avatar_url = newUser.avatar_url;

            _context.SaveChanges();
            return Ok(
                new
                {
                    user.avatar_url,
                    user.users_name,
                    user.email,
                    user.created_day
                });
        }

        //CHANGE password
        [Authorize]
        [HttpPut("password")]
        public IActionResult ChangePassword( string oldpass, string newpass )
        {
            int id = int.Parse(User.FindFirst("UserId")!.Value);

            User? user = FindById(id);
            if( user == null )
                return NotFound();

            if (user.pass_word != oldpass)
                return Unauthorized("Old password wrong");

            user.pass_word = newpass;
            _context.SaveChanges();

            return Ok("Completed");
        }

        //Add Image
        [Authorize]
        [HttpPut("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            // Get user ID
            int id = int.Parse(User.FindFirst("UserId")!.Value);

            User? user = FindById(id);

            if (user == null)
                return NotFound();

            // Check file
            if (file == null || file.Length == 0)
                return BadRequest("No file selected");

            // Limit file size: 5MB
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest("File is too large");

            // Check extension
            string[] allowedExtensions =
            {
                ".jpg", ".jpeg", ".png", ".webp"
            };

            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid image format");

            // Create folder
            string folder = Path.Combine(
                _environment.WebRootPath,
                "images",
                "avatars"
            );

            Directory.CreateDirectory(folder);

            // Generate filename
            string fileName = Guid.NewGuid().ToString() + extension;

            string filePath = Path.Combine(folder, fileName);

            // Save image
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update database
            user.avatar_url = "/images/avatars/" + fileName;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.avatar_url
            });
        }

    }
}
