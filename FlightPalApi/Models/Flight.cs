namespace FlightPalApi.Models;

public class Flight
{
    public long FlightId { get; set; }
    public required string Pilot { get; set; }
    public DateTime start { get; set; }
    public DateTime end { get; set; } 
}