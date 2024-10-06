namespace FlightPalApi.Models;

public class Aircraft
{
    public long AircraftId { get; set; }  // Primary Key

    // The model of the aircraft, e.g., UH-60.
    public string Model { get; set; }

    public string Manufacturer { get; set; }
}