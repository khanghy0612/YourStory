using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Data;
using YourStoryAPI.Models;

namespace YourStoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Lists_JournalsController : ControllerBase
    {
        private readonly YourStoryDbContext _context;
        public Lists_JournalsController(YourStoryDbContext context)
        {
            _context = context;
        }

        //CHECK
        private bool CheckExist(Lists_Journals connect)
        {
            List? resultList = _context.Lists.FirstOrDefault(x => x.id == connect.lists_id);
            Journal? resultJournal = _context.Journals.FirstOrDefault(x => x.id == connect.journals_id);
            return (resultList != null) && (resultJournal != null);
        }

        //FIND
        private Lists_Journals? FindAConnect(int listID, int journalID)
        {
            Lists_Journals? temp = _context.L_J.FirstOrDefault(x => x.lists_id == listID && x.journals_id == journalID);
            return temp;
        }

        
        //CONNECT a journal to a list
        [HttpPost]
        public IActionResult Connect(Lists_Journals newConnect)
        {
            if (CheckExist(newConnect) == false)
                return BadRequest("No list or no journal");

            Lists_Journals? temp = FindAConnect(newConnect.lists_id, newConnect.journals_id);
            if (temp != null)
                return BadRequest("Connection already exists");

            _context.L_J.Add(newConnect);
            _context.SaveChanges();

            return Ok(newConnect);
        }

        //DISCONNECT a journal with a list 
        [HttpDelete("{listID}/{journalID}")]
        public IActionResult Disconnect( int listID, int journalID  )
        {
            var temp = FindAConnect(listID, journalID);
            if (temp == null)
                return NotFound("Not found a connect");

            _context.L_J.Remove(temp);
            _context.SaveChanges();

            return Ok("Deleted");
        }
    }
}
