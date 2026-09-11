namespace YourStoryAPI.Models
{
    public class List
    {
        public int id {  get; set; }
        public int users_id { get; set; }
        public string lists_name { get; set; } = "";
        
        public DateTime created_day { get; set; }
    }
}
