namespace FlightPalApi.Models
{
    // Represents the relationship between a user and an aircraft, 
    // including user-specific information like role and required hours.
    public class UserAircraft
    {
        public long UserId { get; set; }  // Foreign Key to User

        public long AircraftId { get; set; }  // Foreign Key to Aircraft


        // The role of the user with this aircraft (e.g., PC, PI, CE).
        public string Role { get; set; }

        public float CurrentHours { get; set; }

        // The number of flight hours required for this role with the aircraft.
        public float RequiredHours { get; set; }

        // Navigation properties to enable EF Core to understand relationships.
        public User User { get; set; }  
        public Aircraft Aircraft { get; set; }  
    }
}