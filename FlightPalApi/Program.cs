using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;
using DotNetEnv;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

Env.Load(".env.development");

// Define allowed origins using a HashSet for efficient lookup
var allowedOrigins = new HashSet<string> { "https://alexandersnyderportfolio.com", "http://localhost:3000" };

// Add CORS policy to dynamically allow specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
        policy.SetIsOriginAllowed(origin => allowedOrigins.Contains(origin)) // Allow only listed origins
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});
builder.Services.AddScoped<AuthService>(); // Register AuthService
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

string primaryConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
string fallbackConnectionString = Environment.GetEnvironmentVariable("LOCAL_CONNECTION_STRING");

string? connectionString = null;

// Try connecting to the primary connection string
try
{
    Console.WriteLine("Attempting to connect to primary database...");
    using (var tempContext = new FlightPalContext(new DbContextOptionsBuilder<FlightPalContext>()
        .UseMySql(primaryConnectionString, ServerVersion.AutoDetect(primaryConnectionString)).Options))
    {
        // Attempt to connect to the database
        tempContext.Database.CanConnect();
        connectionString = primaryConnectionString;
    }
}
catch
{
    Console.WriteLine("Primary Database connection failed...");
    // If the primary connection string fails, use the fallback
    if (!string.IsNullOrEmpty(fallbackConnectionString))
    {
        try
        {
            Console.WriteLine("Attempting to connect to fallback database...");
            using (var tempContext = new FlightPalContext(new DbContextOptionsBuilder<FlightPalContext>()
                .UseMySql(fallbackConnectionString, ServerVersion.AutoDetect(fallbackConnectionString)).Options))
            {
                // Attempt to connect to the fallback database
                tempContext.Database.CanConnect();
                connectionString = fallbackConnectionString;
            }
        }
        catch
        {
            // Both connection strings failed
            throw new InvalidOperationException("Could not connect to any database.");
        }
    }
    else
    {
        // No fallback connection string provided
        throw new InvalidOperationException("Primary database connection failed, and no fallback connection string is provided.");
    }
}

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("No valid database connection string is available.");
}
Console.WriteLine($"Connecting to database with connection string: {connectionString}");

builder.Services.AddDbContext<FlightPalContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

/*
// Password update script only run once
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FlightPalContext>();
    var authService = scope.ServiceProvider.GetRequiredService<AuthService>();

    // Find users with plaintext passwords
    var usersWithPlaintextPasswords = context.Users
        .Where(u => !u.Password.Contains(":"))
        .ToList();

    foreach (var user in usersWithPlaintextPasswords)
    {
        try
        {
            Console.WriteLine($"Hashing password for user: {user.Email}");
            user.Password = authService.HashPassword(user.Password); // Hash the plaintext password
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating password for user {user.Email}: {ex.Message}");
        }
    }

    try
    {
        // Save changes
        context.SaveChanges();
        Console.WriteLine("Password update script completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error saving changes to the database: {ex.Message}");
    }
}
*/

// Middleware for handling preflight OPTIONS requests
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        var origin = context.Request.Headers["Origin"].ToString();
        if (allowedOrigins.Contains(origin))
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
            context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        }
        context.Response.StatusCode = 204; // No Content
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});

// Apply the CORS policy globally
app.UseCors("AllowSpecificOrigins");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

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

app.MapControllers();

app.Run();
