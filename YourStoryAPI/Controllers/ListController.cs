using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Data;
using YourStoryAPI.Models;

namespace YourStoryAPI.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ControllerBase
    {
        private readonly YourStoryDbContext _context;
        public ListController(YourStoryDbContext context) 
        {
            _context = context;
        }
    }
}
