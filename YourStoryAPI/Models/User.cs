using System.ComponentModel.DataAnnotations;

namespace YourStoryAPI.Models
{
    public class User
    {
        public int id { get; set; }

        [Required]
        public string users_name { get; set; } = "";

        [Required]
        [EmailAddress]
        public string email { get; set; } = "";

        [Required]
        [MinLength(8)]
        public string pass_word { get; set; } = "";

        public DateTime created_day { get; set; }

        public string? avatar_url { get; set; }

    }
}
