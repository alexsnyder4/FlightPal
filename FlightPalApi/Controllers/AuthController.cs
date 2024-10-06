using Microsoft.AspNetCore.Mvc;
using FlightPalApi.Models;
using System.Linq;

namespace FlightPalApi.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly FlightPalContext _context;

        public AuthController(FlightPalContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDTO registerDTO)
        {

            var user = new User
            {
                FName = registerDTO.FName,
                LName = registerDTO.LName,
                Email = registerDTO.Email,
                Password = registerDTO.Password,
            };

            _context.Users.Add(user);

            try
            {
                // Log before saving to the database
                Console.WriteLine("Attempting to save user to the database...");

                await _context.SaveChangesAsync();

                // Log after successful save
                Console.WriteLine("User saved successfully with ID: " + user.UserId);
            }
            catch (Exception ex)
            {
                // Log any exceptions that occur
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

            return CreatedAtAction("GetUser", "Users", new { UserId = user.UserId }, user);
        }



        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO login)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == login.Email && u.Password == login.Password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(new { Message = "Login successful", User = user });
        }
    }
}