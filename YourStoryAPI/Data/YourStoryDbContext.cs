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
        public DbSet<User> Users { get ; set; }
        public DbSet<List> Lists { get; set; }
        public DbSet<Lists_Journals> L_J {  get; set; }
         
    }
}
