using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace FlightPalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HealthController> _logger;
        private readonly string _openWeatherApiKey;
        private readonly string _googleMapsApiKey;

        public HealthController(HttpClient httpClient, ILogger<HealthController> logger, IConfiguration config)
        {
            _httpClient = httpClient;
            _logger = logger;

            // Load API keys from environment variables
            _openWeatherApiKey = config["REACT_APP_WEATHER_API_KEY"];
            _googleMapsApiKey = config["REACT_APP_GOOGLE_MAPS_API_KEY"];
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Health check at root endpoint hit");
            return Ok(new { status = "Healthy" });
        }

        [HttpGet("OpenWeather")]
        public async Task<IActionResult> CheckOpenWeather()
        {
            var openWeatherUrl = $"https://api.openweathermap.org/data/2.5/weather?q=London&appid={_openWeatherApiKey}";

            try
            {
                var response = await _httpClient.GetAsync(openWeatherUrl);
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("OpenWeather API is healthy");
                    return Ok(new { status = "OpenWeather API is healthy" });
                }

                _logger.LogWarning("OpenWeather API is not healthy");
                return StatusCode((int)response.StatusCode, new { status = "OpenWeather API is not healthy" });
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error while checking OpenWeather API");
                return StatusCode(500, new { status = "OpenWeather API check failed", error = ex.Message });
            }
        }

        [HttpGet("GoogleMaps")]
        public async Task<IActionResult> CheckGoogleMaps()
        {
            var googleMapsUrl = $"https://maps.googleapis.com/maps/api/geocode/json?address=London&key={_googleMapsApiKey}";

            try
            {
                var response = await _httpClient.GetAsync(googleMapsUrl);
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Google Maps API is healthy");
                    return Ok(new { status = "Google Maps API is healthy" });
                }

                _logger.LogWarning("Google Maps API is not healthy");
                return StatusCode((int)response.StatusCode, new { status = "Google Maps API is not healthy" });
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error while checking Google Maps API");
                return StatusCode(500, new { status = "Google Maps API check failed", error = ex.Message });
            }
        }
    }
}
