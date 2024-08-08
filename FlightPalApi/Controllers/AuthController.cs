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