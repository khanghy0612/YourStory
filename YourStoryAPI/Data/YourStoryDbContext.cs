using Microsoft.EntityFrameworkCore;
using YourStoryAPI.Models;

namespace YourStoryAPI.Data
{
    public class YourStoryDbContext : DbContext
    {
        public YourStoryDbContext( DbContextOptions<YourStoryDbContext> options ) : base(options)
        {

        }

        public DbSet<Journal> Journals { get ; set; }
         
    }
}
