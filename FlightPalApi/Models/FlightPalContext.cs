using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;

namespace FlightPalApi.Models;

// Manages the connection to the database.
public class FlightPalContext : DbContext
{
    public FlightPalContext(DbContextOptions<FlightPalContext> options)
        : base(options)
    {
    }

    public DbSet<Aircraft> Aircraft { get; set; }

    public DbSet<UserAircraft> UserAircraft { get; set; }

    public DbSet<User> Users { get; set; } = null!;

    public DbSet<Flight> Flight { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CrewMember>().HasNoKey();
        
        // Configure the composite key for the UserAircraft join table.
        modelBuilder.Entity<UserAircraft>().HasKey(ua => new { ua.UserId, ua.AircraftId });

        // Configure the relationships between User, Aircraft, and UserAircraft.
        modelBuilder.Entity<UserAircraft>()
            .HasOne(ua => ua.User)
            .WithMany(u => u.UserAircrafts)
            .HasForeignKey(ua => ua.UserId);

        modelBuilder.Entity<UserAircraft>()
            .HasOne(ua => ua.Aircraft)
            .WithMany()
            .HasForeignKey(ua => ua.AircraftId);
    }
/*
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
        */
}