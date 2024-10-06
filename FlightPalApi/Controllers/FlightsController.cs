using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;
using System.Numerics;

namespace FlightPalApi.Controllers
{
    [Route("api/Flights")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly FlightPalContext _context;

        public FlightsController(FlightPalContext context)
        {
            _context = context;
        }

        // GET: api/Flights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlight()
        {
            return await _context.Flight.ToListAsync();
        }
        //GET: api/Flights/User/{userId}
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlightsByUserId(long userId)
        {
            var flights = await _context.Flight.Where(f => f.UserId == userId).ToListAsync();

            if (flights == null || flights.Count == 0)
            {
                return NotFound();
            }

            return Ok(flights);
        }

        // GET: api/Flights/Flight/{flightId}
        [HttpGet("Flight/{flightId}")]
        public async Task<ActionResult<Flight>> GetFlightByFlightId(long flightId)
        {
            var flight = await _context.Flight
                                    .FirstOrDefaultAsync(f => f.FlightId == flightId);

            if (flight == null)
            {
                return NotFound();
            }

            return flight;
        }
        // GET: api/Flights/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Flight>> GetFlight(long id)
        {
            var flight = await _context.Flight.FindAsync(id);

            if (flight == null)
            {
                return NotFound();
            }

            return flight;
        }

        // PUT: api/Flights/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFlight(long id, Flight flight)
        {
            if (id != flight.FlightId)
            {
                return BadRequest();
            }

            _context.Entry(flight).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Flights
        [HttpPost]
        public async Task<ActionResult<Flight>> PostFlight(Flight flight)
        {
            // Check for Null Crew, If NULL create empty list
            if (flight.CrewMembers == null)
            {
                flight.CrewMembers = new List<CrewMember>();
            }
            // Start a new transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.Flight.Add(flight);
                await _context.SaveChangesAsync();
                // Update the aircraft's CurrentHours
                var aft = await _context.UserAircraft
                        .FirstOrDefaultAsync(a => a.AircraftId == flight.AircraftId
                                                && a.UserId == flight.UserId); // Add Role selection for user to log different time

                // If no UserAircraft record is found, rollback the transaction and return NotFound
                if (aft == null)
                {
                    // Rollback transaction in case of error
                    await transaction.RollbackAsync();
                    return NotFound("Aircraft not associated with the user.");
                }

                aft.CurrentHours += flight.Duration;

                // Save updated CurrentHours
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return CreatedAtAction("GetFlight", new { id = flight.FlightId }, flight);
            }
            catch (Exception ex)
            {
                // Rollback the transaction in case of an error
                await transaction.RollbackAsync();

                // Log or handle the exception as needed
                Console.WriteLine($"Error occurred during transaction: {ex.Message}");

                // Return a generic error response
                return StatusCode(500, "An error occurred while processing the flight.");
            }
        }

        // DELETE: api/Flights/42
        [HttpDelete("{flightId}")]
        public async Task<IActionResult> DeleteFlightByFlightId(int flightId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var flight = await _context.Flight.FirstOrDefaultAsync(f => f.FlightId == flightId);
                if (flight == null)
                {
                    return NotFound();
                }

                // Get associated UserAircraft and update Current Hours
                var userAircraft = await _context.UserAircraft.FirstOrDefaultAsync(u => u.UserId == flight.UserId &&
                                                                                    u.AircraftId == flight.AircraftId);
                if (userAircraft == null)
                {
                    // Rollback transaction in case of error
                    await transaction.RollbackAsync();
                    return NotFound("Aircraft not associated with the user.");
                }

                // Update CurrentHours
                userAircraft.CurrentHours -= flight.Duration;

                _context.Entry(userAircraft).State = EntityState.Modified;

                // Save the changes to CurrentHours
                await _context.SaveChangesAsync();

                // Remove flight from the Flight table
                _context.Flight.Remove(flight);

                // Save changes to remove the flight
                await _context.SaveChangesAsync();

                // Commit transaction after everything is successful
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                // Rollback the transaction in case of an error
                await transaction.RollbackAsync();

                // Log or handle the exception as needed
                Console.WriteLine($"Error occurred during transaction: {ex.Message}");

                // Return a generic error response
                return StatusCode(500, "An error occurred while processing the flight.");
            }
        }

        private bool FlightExists(long id)
        {
            return _context.Flight.Any(e => e.FlightId == id);
        }
    }
}
