namespace FlightPalApi.Models
{
    // Represents the relationship between a user and an aircraft, 
    // including user-specific information like role and required hours.
    public class UserAircraftDTO
    {
        public long UserId { get; set; }  // Foreign Key to User
        // The role of the user with this aircraft (e.g., PC, PI, CE).
        public long AircraftId { get; set; }
        public string Model { get; set;}
        public string Manufacturer { get; set;}
        public string Role { get; set; }
        public float CurrentHours { get; set; }

        // The number of flight hours required for this role with the aircraft.
        public float RequiredHours { get; set; }
    }
}