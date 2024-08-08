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
        [HttpGet("{Id}")]
        public async Task<ActionResult<UserDTO>> GetUser(long Id)
        {
            var user = await _context.Users.FindAsync(Id);

            if (user == null)
            {
                return NotFound();
            }

            return UsertoDTO(user);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkId=2123754
        [HttpPut("{Id}")]
        public async Task<IActionResult> PutUser(long Id, UserDTO userDTO)
        {
            if (Id != userDTO.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(Id);
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
                if (!UserExists(Id))
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkId=2123754
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
                new { Id = user.Id }, 
                UsertoDTO(user));
        }

        // DELETE: api/Users/5
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteUser(long Id)
        {
            var user = await _context.Users.FindAsync(Id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(long Id)
        {
            return _context.Users.Any(e => e.Id == Id);
        }

        private static UserDTO UsertoDTO(User user) =>
            new UserDTO 
            {
                Id = user.Id,
                FName = user.FName,
                LName = user.LName,
                Email = user.Email,
            };
    }
}
