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
        private readonly AuthService _authService;
        public AuthController(FlightPalContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDTO registerDTO)
        {
            // Validate inputs
            if (!InputValidator.IsValidEmail(registerDTO.Email))
                return BadRequest("Invalid email format.");

            if (!InputValidator.IsValidPassword(registerDTO.Password))
                return BadRequest("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");

            var existingUser = _context.Users.SingleOrDefault(u => u.Email == registerDTO.Email);

            if (existingUser != null)
                return Conflict("A user with this email already exists.");
            
            var hashedPassword = _authService.HashPassword(registerDTO.Password);
            var user = new User
            {
                FName = registerDTO.FName,
                LName = registerDTO.LName,
                Email = registerDTO.Email,
                Password = hashedPassword,
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
            // Validate inputs
            if (string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Password))
                return BadRequest("Email and password are required.");

            if (!InputValidator.IsValidEmail(login.Email))
                return BadRequest("Invalid email format.");

            var user = _context.Users.SingleOrDefault(u => u.Email == login.Email);

            if (user == null || !_authService.VerifyPassword(login.Password, user.Password))
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(new { Message = "Login successful", User = user });
        }
    }
}