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

        //READ
        [HttpGet]
        public IActionResult GetAll()
        {
            var journals = _context.Journals.ToList();
            return Ok(journals);
        }

        [HttpGet("{id}")]
        public IActionResult GetById( int id )
        {
            Journal journal = _context.Journals.FirstOrDefault(x => x.id == id );
            
            if( journal == null ) return NotFound();
            
            return Ok( journal );
        }

        //CREATE
        [HttpPost]
        public IActionResult Create(Journal journal )
        {
            _context.Journals.Add(journal);
            _context.SaveChanges();

            return Ok(journal); 
        }


        //UPDATE (if is Draft)
        [HttpPut("{id}")]
        public IActionResult Update(int id, Journal New )
        {
            Journal journal = (_context.Journals.FirstOrDefault( x => x.id == id));
            if( journal == null ) return NotFound();

            if (journal.is_draft == false) return BadRequest("This journal is not draft");

            journal.title = New.title;
            journal.content = New.content;
            journal.img_url = New.img_url;
            journal.is_draft = New.is_draft;

            _context.SaveChanges();
            return Ok(journal);

        }

        //DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Journal journal = _context.Journals.FirstOrDefault(x => x.id == id);
            
            if(  journal == null ) return NotFound();
            _context.Journals.Remove(journal);

            _context.SaveChanges();
            return Ok("Deleted");
        }
   }
}
