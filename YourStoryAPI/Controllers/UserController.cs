using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Data;
using YourStoryAPI.Models;

namespace YourStoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly YourStoryDbContext _context;

        public UserController(YourStoryDbContext context)
        {
            _context = context;
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

            return Ok(
                new
                {
                    user.avatar_url,
                    user.users_name,
                    user.email,
                    user.created_day
                });
        }

        //VIEW PROFILE
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
