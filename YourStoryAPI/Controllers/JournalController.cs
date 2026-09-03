using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Models;
using YourStoryAPI.Data;


namespace YourStoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JournalController : ControllerBase
    {
        private readonly YourStoryDbContext _context;

        public JournalController(YourStoryDbContext context)
        {  
            _context = context; 
        }

        [HttpGet]
        public IActionResult Get()
        {
            var journals = _context.Journals.ToList();
            return Ok(journals);
        }

        
    }
}
