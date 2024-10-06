using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;

namespace FlightPalApi.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FlightPalContext _context;

        public UsersController(FlightPalContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            return await _context.Users
            .Select(x => UsertoDTO(x))
            .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserDTO>> GetUser(long userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return UsertoDTO(user);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkId=2123754
        [HttpPut("{userId}")]
        public async Task<IActionResult> PutUser(long userId, UserDTO userDTO)
        {
            if (userId != userDTO.UserId)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            //copy data from userDTO to user except Id
            user.FName = userDTO.FName;
            user.LName = userDTO.LName;
            user.Email = userDTO.Email;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
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

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO userDTO)
        {
           var user = new User 
           {
                FName = userDTO.FName,
                LName = userDTO.LName,
                Email = userDTO.Email,
           };

           _context.Users.Add(user);
           await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetUser), 
                new { userId = user.UserId }, 
                UsertoDTO(user));
        }

        // DELETE: api/Users/5
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(long userId)

        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/User/{userId}/aircraft
        [HttpGet("{userId}/aircraft")]
        public async Task<ActionResult<IEnumerable<UserAircraftDTO>>> GetUserAircraft(long userId)
        {
            var userAircrafts = await _context.UserAircraft
                .Where(ua => ua.UserId == userId)
                .Select(ua => new UserAircraftDTO
                {
                    AircraftId = ua.Aircraft.AircraftId,
                    Model = ua.Aircraft.Model,
                    Manufacturer = ua.Aircraft.Manufacturer,
                    Role = ua.Role,
                    CurrentHours = ua.CurrentHours,
                    RequiredHours = ua.RequiredHours
                })
                .ToListAsync();

            if (!userAircrafts.Any())
            {
                return NotFound("No aircraft found for this user.");
            }

            return userAircrafts;
        }
        
        // POST: api/User/{userId}/aircraft
        [HttpPost("{userId}/aircraft")] 
        public async Task<ActionResult<UserAircraft>> AddOrUpdateUserAircraft(long userId, [FromBody] UserAircraftDTO dto)
        {
            if (userId != dto.UserId) // Validate User credentials
            {
                return BadRequest("Mismatched User ID.");
            }

            var aircraft = await _context.Aircraft        // Check if aircraft is in db
                .FirstOrDefaultAsync(a => a.Model.ToLower().Trim() == dto.Model.ToLower().Trim() &&
                                  a.Manufacturer.ToLower().Trim() == dto.Manufacturer.ToLower().Trim());

            if (aircraft == null)   // If it is a new aircraft, add it to Aircraft Table
            {
                Console.WriteLine("No matching aircraft found.");
                aircraft = new Aircraft { Model = dto.Model, Manufacturer = dto.Manufacturer };
                _context.Aircraft.Add(aircraft);
                Console.WriteLine("Added aircraft to database.");
                await _context.SaveChangesAsync();
                Console.WriteLine("Saved changes to database.");
            }

            var userAircraft = await _context.UserAircraft      // Check if User is already associated with aircraft
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AircraftId == aircraft.AircraftId);

            if (userAircraft == null)   // Add aircraft to User
            {
                Console.WriteLine("Adding new aircraft to user.");
                userAircraft = new UserAircraft
                {
                    UserId = userId,
                    AircraftId = aircraft.AircraftId,
                    Role = dto.Role,
                    RequiredHours = dto.RequiredHours
                };
                Console.WriteLine(userAircraft);
                _context.UserAircraft.Add(userAircraft);
                Console.WriteLine("Added aircraft to user.");
            }
            else
            {
                Console.WriteLine("Updating Role and Required Hours.");
                userAircraft.Role = dto.Role;
                userAircraft.RequiredHours = dto.RequiredHours;
            }

            await _context.SaveChangesAsync();

            return Ok(userAircraft);
        }
    
        // DELETE: api/Users/5/4
        [HttpDelete("{userId}/{aircraftId}")]
        public async Task<IActionResult> DeleteAircraftFromUser(long userId, long aircraftId)

        {
            var userAircraft = await _context.UserAircraft.FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AircraftId == aircraftId);
            if (userAircraft == null)
            {
                return NotFound();
            }

            _context.UserAircraft.Remove(userAircraft);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    
        private bool UserExists(long userId)
        {
            return _context.Users.Any(e => e.UserId == userId);
        }

        private static UserDTO UsertoDTO(User user) =>
            new UserDTO 
            {
                UserId = user.UserId,
                FName = user.FName,
                LName = user.LName,
                Email = user.Email,
            };
    }
}
