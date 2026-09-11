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

        public UserController(YourStoryDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
        [HttpGet("{id}")]
        public IActionResult ViewProfile( int id )
        {
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

        //UPDATE profile
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult UpdateProfile( int id, User newUser )
        {
            User? user = FindById(id);
            if (user == null)
                return NotFound();

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
        [HttpPut("password/{id}")]
        public IActionResult ChangePassword( int id, string oldpass, string newpass )
        {
            User? user = FindById(id);
            if( user == null )
                return NotFound();

            if (user.pass_word != oldpass)
                return Unauthorized("Old password wrong");

            user.pass_word = newpass;
            _context.SaveChanges();

            return Ok("Completed");
        }
        
    }
}
