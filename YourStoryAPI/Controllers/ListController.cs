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
            var lists = _context.Lists.ToList();
            return Ok(lists);
        }

        //READ a list
        [HttpGet("{id}")]
        public IActionResult GetById( int id )
        {
            List? resultList = Find(id);
            if (resultList == null)
                return NotFound("Not found");
            return Ok(resultList);
        }

        //

        //READ journals in list
        [HttpGet("{id}/journals")]
        public IActionResult GetJournals(int id)
        {
            List? resultList = Find(id);
            if (resultList == null)
                return NotFound("Not found");

            var journals = ChooseJournalsOfList(id);
            return Ok(journals);
        }

        //SORT list by day
        [HttpGet("sort/{order}")]
        public IActionResult Sort(string order)
        {
            if (order == "asc")
                return Ok(_context.Lists.OrderBy(x => x.created_day).ToList());
            return Ok(_context.Lists.OrderByDescending(x => x.created_day).ToList());

        }

        //SORT journals in list by day
        [HttpGet("sort/{id}/journals/{order}")]
        public IActionResult SortJournals ( int id , string order )
        {
            if( Find(id) == null ) 
                    return NotFound ("Not found list");

            var journals = ChooseJournalsOfList(id);
            if (order == "asc")
                return Ok(journals.OrderBy(x => x.posted_day));
            return Ok( journals.OrderByDescending(x => x.posted_day));
        }

        //Create empty List
        [HttpPost]
        public IActionResult Create( List list )
        {
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
