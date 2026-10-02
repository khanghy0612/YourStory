using Microsoft.AspNetCore.Mvc;
using YourStoryAPI.Data;
using YourStoryAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace YourStoryAPI.Controllers 
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ControllerBase
    {
        private readonly YourStoryDbContext _context;
        public ListController(YourStoryDbContext context) 
        {
            _context = context;
        }

        // Get this User id
        private int GetUserId()
        {
            return int.Parse(User.FindFirst("UserId")!.Value);
        }


        //choose journals of list
        private List<Journal> ChooseJournalsOfList( int id )
        {
            var connects = _context.L_J.Where(x => x.lists_id == id).ToList();
            List<Journal> journals = new List<Journal>();
            foreach (var x in connects)
            {
                Journal? temp = _context.Journals.FirstOrDefault(j => j.id == x.journals_id);
                if (temp != null) journals.Add(temp);
            }
            return journals;
        }


        //FIND
        private List? Find(int id )
        {
            var resultList = _context.Lists.FirstOrDefault(x => x.id == id);
            return resultList;
        }

        //READ all lists
        [HttpGet]
        public IActionResult GetAll()
        {
            int userId = GetUserId();
            var lists = _context.Lists.Where(x => x.users_id == userId ).ToList();
            return Ok(lists);
        }

        //READ a list
        [HttpGet("{id}")]
        public IActionResult GetById( int id )
        {
            List? resultList = Find(id);
            if (resultList == null)
                return NotFound("Not found");

            if( resultList.users_id != GetUserId() ) 
                return Forbid();

            return Ok(resultList);
        }


        //READ journals in list
        [HttpGet("{id}/journals")]
        public IActionResult GetJournals(int id)
        {
            List? resultList = Find(id);
            if (resultList == null)
                return NotFound("Not found");

            if( resultList.users_id != GetUserId() ) 
                return Forbid();

            var journals = ChooseJournalsOfList(id);
            return Ok(journals);
        }

        //SORT list by day
        [HttpGet("sort/{order}")]
        public IActionResult Sort(string order)
        {
            int userId = GetUserId() ;

            if (order != "asc" && order != "desc")
                return BadRequest("Order must be asc or desc");

            if (order == "asc")
                return Ok(_context.Lists.Where(x => x.users_id == userId).OrderBy(x => x.created_day).ToList());
            return Ok(_context.Lists.Where(x => x.users_id == userId).OrderByDescending(x => x.created_day).ToList());
        }

        //SORT journals in list by day
        [HttpGet("sort/{id}/journals/{order}")]
        public IActionResult SortJournals ( int id , string order )
        {
            List? resultList = Find(id);
            if ( resultList == null ) 
                    return NotFound ("Not found list");

            if (resultList.users_id != GetUserId())
                return Forbid();

            if (order != "asc" && order != "desc")
                return BadRequest("Order must be asc or desc");

            var journals = ChooseJournalsOfList(id);

            if (order == "asc")
                return Ok(journals.OrderBy(x => x.posted_day));
            return Ok( journals.OrderByDescending(x => x.posted_day));
        }

        //CREATE empty List
        [HttpPost]
        public IActionResult Create( List list )
        {
            list.users_id = GetUserId();
            list.created_day = DateTime.Now;

            _context.Lists.Add(list);
            _context.SaveChanges();
            return Ok(list);
        }

        //NAME a list
        [HttpPut("{id}")]
        public IActionResult Rename( int id, string newName )
        {
            List? resultList = Find(id);

            if (resultList == null)
                return NotFound("Not found");

            if (resultList.users_id != GetUserId())
                return Forbid();

            resultList.lists_name = newName;
            _context.SaveChanges();
            return Ok(resultList);
        }

        //DELETE a list
        [HttpDelete("{id}")]
        public IActionResult Delete( int id )
        {
            List? resultList = Find(id);
            if (resultList == null)
                return NotFound("Not found");

            if (resultList.users_id != GetUserId())
                return Forbid();

            //Delete conect with journals
            var connects = _context.L_J.Where(x => x.lists_id == id).ToList();
            _context.L_J.RemoveRange(connects);

            //Delete this list
            _context.Lists.Remove(resultList);
            _context.SaveChanges();

            return Ok("Deleted");
        }
    }
}
