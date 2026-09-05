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

        //FIND
        private Journal? Find( int id )
        {
            Journal? resultJournal = _context.Journals.FirstOrDefault(x => x.id ==  id);
            return resultJournal;
        }

        //SORT journals by day
        [HttpGet("sort/{order}")]
        public IActionResult Sort( string order )
        {
            if (order == "asc")
                return Ok(_context.Journals.OrderBy(x => x.posted_day).ToList() );
            return Ok(_context.Journals.OrderByDescending(x => x.posted_day).ToList());

        }

        //READ all journals
        [HttpGet]
        public IActionResult GetAll()
        {
            var journals = _context.Journals.ToList();
            return Ok(journals);
        }

        //READ a journal
        [HttpGet("{id}")]
        public IActionResult GetById( int id )
        {
            Journal? journal = Find(id);
            
            if( journal == null ) return NotFound("Not found");
            
            return Ok( journal );
        }

        //CREATE journal
        [HttpPost]
        public IActionResult Create(Journal journal )
        {
            _context.Journals.Add(journal);
            _context.SaveChanges();

            return Ok(journal); 
        }


        //UPDATE journal (if is Draft)
        [HttpPut("{id}")]
        public IActionResult Update(int id, Journal newJournal )
        {
            Journal? journal = Find(id);
            if( journal == null ) return NotFound("Not found");

            if (journal.is_draft == false) return BadRequest("This journal is not draft");

            journal.title = newJournal.title;
            journal.content = newJournal.content;
            journal.img_url = newJournal.img_url;
            journal.is_draft = newJournal.is_draft;

            _context.SaveChanges();
            return Ok(journal);

        }

        //DELETE journal
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Journal? journal = Find(id);
            
            if(  journal == null ) return NotFound("Not found");

            //Delete conect with lists
            List<Lists_Journals> connects = _context.L_J.Where(x => x.journals_id == id).ToList();
            _context.L_J.RemoveRange(connects);

            //Delete this journal
            _context.Journals.Remove(journal);
            _context.SaveChanges();
            return Ok("Deleted");
        }
   }
}
