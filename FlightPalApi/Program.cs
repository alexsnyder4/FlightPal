using Microsoft.EntityFrameworkCore;
using FlightPalApi.Models;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

// Add services to the container.
// CORS (Cross-Origin Resource Sharing) services to allow front end requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Register Authorization service
builder.Services.AddAuthorization();

builder.Services.AddControllers();

// Configure MySQL connection
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
builder.Services.AddDbContext<FlightPalContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// Configure Kestrel to listen on all interfaces
app.Urls.Add("http://0.0.0.0:5092");

app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseSwagger();
    app.UseSwaggerUI();
// Enable Authorization middleware
app.UseAuthorization();

app.MapControllers();

app.Run();
