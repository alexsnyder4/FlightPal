using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Determine the environment
string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

if (environment == "Development")
{
    Env.Load(".env.development");
}

// Add CORS policy for specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
        policy.WithOrigins("https://alexandersnyderportfolio.com", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// Register services
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// Configure MySQL connection
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string is missing.");
}
builder.Services.AddDbContext<FlightPalContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Middleware for handling preflight OPTIONS requests
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.StatusCode = 204; // No Content
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});


// Enable Swagger if in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply unified CORS policy
app.UseCors("AllowSpecificOrigins");

// Enable Authorization middleware
app.UseAuthorization();

// Global error logging middleware
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

// Map controllers
app.MapControllers();

app.Run();
