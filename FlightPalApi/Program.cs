using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;
using DotNetEnv; // You need this for loading .env files

var builder = WebApplication.CreateBuilder(args);

// Determine the environment
string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

if (environment == "Development")
{
    // Load .env file for development mode
    Env.Load(".env.development"); // Adjust the path if your .env file is elsewhere
}

// Add services to the container
// Add CORS (Cross-Origin Resource Sharing) services to allow front-end requests
builder.Services.AddCors(options =>
{
    if (environment == "Development")
    {
        options.AddPolicy("DevelopmentPolicy", policy =>
            policy.WithOrigins("http://localhost:3000")  // Development origin
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());
    }
    else
    {
        options.AddPolicy("ProductionPolicy", policy =>
            policy.WithOrigins("https://alexandersnyderportfolio.com")  // Production origin
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());
    }
});

// Register Authorization service
builder.Services.AddAuthorization();

// Register controllers and HTTP client for API checks
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// Configure MySQL connection using the connection string from environment variables or .env file
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string is missing.");
}
builder.Services.AddDbContext<FlightPalContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Enable logging
var logger = app.Services.GetRequiredService<ILogger<Program>>();

app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 204; // No Content
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Apply Development CORS Policy
    app.UseCors("DevelopmentPolicy");
}
else
{
    // Apply Production CORS Policy
    app.UseCors("ProductionPolicy");
}

// Enable Authorization middleware
app.UseAuthorization();

// Global error logging
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while processing the request.");
        throw;
    }
});

// Map your controllers
app.MapControllers();

app.Run();
