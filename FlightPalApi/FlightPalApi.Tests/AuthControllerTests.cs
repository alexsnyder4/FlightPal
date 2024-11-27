using FlightPalApi.Controllers;
using FlightPalApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Threading.Tasks;
using Xunit;

public class AuthControllerTests
{
    private readonly Mock<AuthService> _authServiceMock;
    private readonly FlightPalContext _context;
    private readonly AuthController _authController;

    public AuthControllerTests()
    {
        // Set up in-memory database for FlightPalContext
        var options = new DbContextOptionsBuilder<FlightPalContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
        _context = new FlightPalContext(options);
        // Clear the database for each test run
        _context.Database.EnsureDeleted();
        _context.Database.EnsureCreated();
        // Set up mock AuthService
        _authServiceMock = new Mock<AuthService>();

        // Initialize AuthController with dependencies
        _authController = new AuthController(_context, _authServiceMock.Object);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenEmailIsInvalid()
    {
        // Arrange
        var invalidDTO = new RegisterDTO
        {
            Email = "invalidemail",
            Password = "ValidPass1@",
            FName = "John",
            LName = "Doe"
        };

        // Act
        var result = await _authController.Register(invalidDTO);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Invalid email format.", badRequestResult.Value);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenPasswordIsInvalid()
    {
        // Arrange
        var invalidDTO = new RegisterDTO
        {
            Email = "john.doe@example.com",
            Password = "short1@",
            FName = "John",
            LName = "Doe"
        };

        // Act
        var result = await _authController.Register(invalidDTO);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.", badRequestResult.Value);
    }

    [Fact]
    public async Task Register_ShouldReturnConflict_WhenEmailAlreadyExists()
    {
        // Arrange
        var existingUser = new User
        {
            Email = "john.doe@example.com",
            Password = "ValidPass1@",
            FName = "John",
            LName = "Doe"
        };

        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();

        var newUserDTO = new RegisterDTO
        {
            Email = "john.doe@example.com",
            Password = "ValidPass1@",
            FName = "Jane",
            LName = "Smith"
        };

        // Act
        var result = await _authController.Register(newUserDTO);

        // Assert
        var conflictResult = Assert.IsType<ConflictObjectResult>(result.Result);
        Assert.Equal("A user with this email already exists.", conflictResult.Value);
    }

    [Fact]
    public async Task Register_ShouldCreateUser_WhenInputIsValid()
    {
        // Arrange
        var validDTO = new RegisterDTO
        {
            Email = "valid.email@example.com",
            Password = "ValidPass1@",
            FName = "John",
            LName = "Doe"
        };

        _authServiceMock
            .Setup(s => s.HashPassword(It.IsAny<string>()))
            .Returns("hashedPassword");

        // Act
        var result = await _authController.Register(validDTO);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.NotNull(createdAtResult);
    }

    [Fact]
    public void Login_ShouldReturnBadRequest_WhenEmailIsInvalid()
    {
        // Arrange
        var invalidLoginDTO = new LoginDTO
        {
            Email = "invalidemail",
            Password = "ValidPass1@"
        };

        // Act
        var result = _authController.Login(invalidLoginDTO);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid email format.", badRequestResult.Value);
    }

    [Fact]
    public void Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
    {
        // Arrange
        var loginDTO = new LoginDTO
        {
            Email = "john.doe@example.com",
            Password = "WrongPass1@"
        };

        _authServiceMock
            .Setup(s => s.VerifyPassword(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(false);

        // Act
        var result = _authController.Login(loginDTO);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Invalid credentials", unauthorizedResult.Value);
    }

    [Fact]
    public void Login_ShouldReturnOk_WhenCredentialsAreValid()
    {
        // Arrange
        var loginDTO = new LoginDTO
        {
            Email = "john.doe@example.com",
            Password = "ValidPass1@"
        };

        var user = new User
        {
            Email = "john.doe@example.com",
            Password = "hashedPassword",
            FName = "John",
            LName = "Doe"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        _authServiceMock
            .Setup(s => s.VerifyPassword(loginDTO.Password, user.Password))
            .Returns(true);

        // Act
        var result = _authController.Login(loginDTO);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        dynamic response = okResult.Value; // Use dynamic to access anonymous type properties, Casting returned value to work with anonymous type during UT

        // Verify the properties of the anonymous object
        Assert.Equal("Login successful", response.Message);
        Assert.NotNull(response.User);
        Assert.Equal(user.Email, response.User.Email);
    }
}
