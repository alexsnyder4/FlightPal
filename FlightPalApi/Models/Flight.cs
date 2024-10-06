using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
namespace FlightPalApi.Models;

public class Flight
{
    public long FlightId { get; set; }
    public long UserId { get; set; }
    public float Duration { get; set; }
    public string StartLocation { get; set; }
    public string StopLocation { get; set; }
    public DateTime Date { get; set; }
    public long AircraftId { get; set; }

    public string? CrewMembersJson { get; set; } // Store as JSON

    [NotMapped]
    public List<CrewMember>? CrewMembers 
    { 
        get => string.IsNullOrEmpty(CrewMembersJson) 
            ? new List<CrewMember>() 
            : JsonConvert.DeserializeObject<List<CrewMember>>(CrewMembersJson); 
        set => CrewMembersJson = JsonConvert.SerializeObject(value);
    }
}

public class CrewMember
    {
        public string Name { get; set; }
        public string Role { get; set; }
    }