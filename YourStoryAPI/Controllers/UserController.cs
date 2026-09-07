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
        private User? Find(string mail)
        {
            User? user = _context.Users.FirstOrDefault(x => x.email == mail);
            return user;
        }

        //SIGN UP
        [HttpPost("signup")]
        public IActionResult SignUp(User user)
        {
            if (Find(user.email) != null)
                return BadRequest("User exist");

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }

        //LOGIN
        [HttpPost("login")]
        public IActionResult Login( string username, string pass )
        {
            User? user = _context.Users.FirstOrDefault( x => x.users_name == username && x.pass_word == pass);
            if (user == null)
                return Unauthorized("Invalid username or password");

            return Ok(user);
        }

    }
}
