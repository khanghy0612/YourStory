namespace YourStoryAPI.Models
{
    public class User
    {
        public int id { get; set; }
        public string users_name { get; set; } = "";
        public string email { get; set; } = "";
        public string pass_word { get; set; } = "";
        public DateTime created_day { get; set; }
        public string? avatar_url { get; set; }

    }
}
