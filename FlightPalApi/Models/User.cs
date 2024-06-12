namespace FlightPalApi.Models;

public class User
{
    public long id { get; set; }
    public string fName { get; set; }
    public string lName { get; set; }
    public string? password { get; set; }
    public ICollection<Flight>? Flights { get; set; }
}