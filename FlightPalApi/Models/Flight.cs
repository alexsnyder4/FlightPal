namespace FlightPalApi.Models;

public class Flight
{
    public long FlightId { get; set; }
    public long UserId { get; set; }
    public string Aircraft { get; set; }
    public decimal Duration { get; set; }
    public string StartLocation { get; set; }
    public string StopLocation { get; set; }
    public DateTime Date { get; set; }

    public User User { get; set; }
}