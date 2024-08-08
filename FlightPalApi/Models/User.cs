namespace FlightPalApi.Models;

public class User
{
    public long Id { get; set; }
    public string FName { get; set; }
    public string LName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public ICollection<Flight>? Flights { get; set; }
}