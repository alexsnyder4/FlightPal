using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;

namespace FlightPalApi.Models;

public class FlightPalContext : DbContext
{
    public FlightPalContext(DbContextOptions<FlightPalContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;

    public DbSet<Flight> Flight { get; set; } = null!;
}