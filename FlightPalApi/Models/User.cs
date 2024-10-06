namespace FlightPalApi.Models;

// Represents a user in the FlightPal system who can log flights and manage aircraft information.
// This class holds personal details like name and email, and tracks the user's flights and associated aircraft.
public class User
{
    public long UserId { get; set; }  // PK
    public string FName { get; set; }
    public string LName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }

    // Collection of flights that the user has logged.
    public ICollection<Flight>? Flights { get; set; }

    // Collection of aircraft that the user has associated with their account.
    public ICollection<UserAircraft>? UserAircrafts { get; set; }
}