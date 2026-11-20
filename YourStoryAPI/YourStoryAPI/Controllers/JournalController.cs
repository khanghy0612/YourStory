using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Models;
using YourStoryAPI.Data;
using Microsoft.AspNetCore.Authorization;


namespace YourStoryAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class JournalController : ControllerBase
    {
        private readonly YourStoryDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public JournalController(YourStoryDbContext context, IWebHostEnvironment environment)
        {  
            _context = context; 
            _environment = environment;
        }

        //FIND
        private Journal? Find( int id )
        {
            Journal? resultJournal = _context.Journals.FirstOrDefault(x => x.id ==  id);
            return resultJournal;
        }

        // Get this User id
        private int GetUserId()
        {
            return int.Parse( User.FindFirst("UserId")!.Value );
        }

        //SORT journals by day
        [HttpGet("sort/{order}")]
        public IActionResult Sort( string order )
        {
            int userId = GetUserId();

            if (order != "asc" && order != "desc")
                return BadRequest("Order must be asc or desc");

            if (order == "asc")
                return Ok(_context.Journals.Where(x => x.users_id == userId ).OrderBy(x => x.posted_day).ToList() );

            return Ok(_context.Journals.Where(x => x.users_id == userId).OrderByDescending(x => x.posted_day).ToList());

        }

        //READ all journals
        [HttpGet]
        public IActionResult GetAll()
        {
            int userId = GetUserId();
            var journals = _context.Journals.Where( x => x.users_id == userId).ToList();
            return Ok(journals);
        }

        //READ a journal
        [HttpGet("{id}")]
        public IActionResult GetById( int id )
        {
            Journal? journal = Find(id);
            
            if( journal == null ) return NotFound("Not found");

            if (journal.users_id != GetUserId()) return Forbid();
            
            return Ok( journal );
        }

        //CREATE journal
        [HttpPost]
        public IActionResult Create(Journal journal )
        {
            journal.users_id = GetUserId();
            journal.posted_day = DateTime.Now;

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

            if( journal.users_id != GetUserId() ) return Forbid();

            if (journal.is_draft == false) return BadRequest("This journal is not draft");

            journal.title = newJournal.title;
            journal.content = newJournal.content;
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

            if (journal.users_id != GetUserId())
                return Forbid();

            //Delete conect with lists
            List<Lists_Journals> connects = _context.L_J.Where(x => x.journals_id == id).ToList();
            _context.L_J.RemoveRange(connects);

            //Delete this journal
            _context.Journals.Remove(journal);
            _context.SaveChanges();
            return Ok("Deleted");
        }

        //Add Image
        [Authorize]
        [HttpPut("{id}/image")]
        public async Task<IActionResult> UploadImage(IFormFile file, int id)
        {
            Journal? journal = Find(id);

            if (journal == null)
                return NotFound();

            if (journal.users_id != GetUserId())
                return Forbid();

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
                "journals"
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
            journal.img_url = "/images/journals/" + fileName;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                journal.img_url
            });
        }
    }
}
