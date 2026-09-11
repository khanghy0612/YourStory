namespace YourStoryAPI.Models
{
    public class Journal
    {
        public int id { get; set; }
        public int users_id { get; set; }
        public DateTime posted_day { get; set; }
        public bool is_draft { get; set; }
        public bool for_you { get; set; }
        public string title { get; set; } = "";
        public string content { get; set; } = "";
        public string? img_url { get; set; }
    }
}
