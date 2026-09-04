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


    }
}
