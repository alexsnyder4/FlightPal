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

    // Override method to configure FK relations between Flight and User tables
    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the relationship between Flight and User entities
            modelBuilder.Entity<Flight>()
                .HasOne(f => f.User)                   // Each flight has one associated user
                .WithMany(u => u.Flights)             // Each user can have multiple flights
                .HasForeignKey(f => f.UserId)         // Define foreign key property
                .IsRequired();                         // Make the relationship required
        }
}