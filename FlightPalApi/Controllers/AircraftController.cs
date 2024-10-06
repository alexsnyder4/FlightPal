using Microsoft.AspNetCore.Mvc;
using FlightPalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightPalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AircraftController : ControllerBase
    {
        private readonly FlightPalContext _context;

        public AircraftController(FlightPalContext context)
        {
            _context = context;
        }

        // GET: api/Aircraft
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aircraft>>> GetAircraft()
        {
            return await _context.Aircraft.ToListAsync();
        }

        // GET: api/Aircraft/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<Aircraft>> GetAircraft(long userId)
        {
            var aircraft = await _context.Aircraft.FindAsync(userId);

            if (aircraft == null)
            {
                return NotFound();
            }

            return aircraft;
        }

        // GET: api/Aircraft/model?modelName={modelName}
        [HttpGet("model")]
        public async Task<ActionResult<IEnumerable<Aircraft>>> GetAircraftByModel([FromQuery] string modelName)
        {
            var aircrafts = await _context.Aircraft
                                    .Where(a => a.Model.ToLower() == modelName.ToLower())
                                    .ToListAsync();;    
            if (!aircrafts.Any())
            {
                return NotFound(new { message = $"No aircraft found with model name {modelName}." });
            }

            return Ok(aircrafts);
        }

        // POST: api/Aircraft
        [HttpPost]
        public async Task<ActionResult<Aircraft>> PostAircraft(Aircraft aircraft)
        {
            _context.Aircraft.Add(aircraft);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAircraft", new { id = aircraft.AircraftId }, aircraft);
        }

        // PUT: api/Aircraft/5
        [HttpPut("{userId}")]
        public async Task<IActionResult> PutAircraft(long userId, Aircraft aircraft)
        {
            if (userId != aircraft.AircraftId)
            {
                return BadRequest();
            }

            _context.Entry(aircraft).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AircraftExists(userId))
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

        // DELETE: api/Aircraft/5
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteAircraft(long userId)
        {
            var aircraft = await _context.Aircraft.FindAsync(userId);
            if (aircraft == null)
            {
                return NotFound();
            }

            _context.Aircraft.Remove(aircraft);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AircraftExists(long userId)
        {
            return _context.Aircraft.Any(e => e.AircraftId == userId);
        }
    }
}