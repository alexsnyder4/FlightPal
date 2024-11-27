
using Xunit;

public class AuthServiceTests
{
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _authService = new AuthService();
    }

    [Fact]
    public void HashPassword_ShouldReturnHashedPassword()
    {
        // Arrange
        string password = "TestPassword123";

        // Act
        var hashedPassword = _authService.HashPassword(password);

        // Assert
        Assert.NotNull(hashedPassword);
        Assert.Contains(":", hashedPassword); // Ensure salt is included
    }

    [Fact]
    public void VerifyPassword_ShouldReturnTrue_ForValidPassword()
    {
        // Arrange
        string password = "TestPassword123";
        var hashedPassword = _authService.HashPassword(password);

        // Act
        var result = _authService.VerifyPassword(password, hashedPassword);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void VerifyPassword_ShouldReturnFalse_ForInvalidPassword()
    {
        // Arrange
        string password = "TestPassword123";
        var hashedPassword = _authService.HashPassword(password);
        string invalidPassword = "WrongPassword";

        // Act
        var result = _authService.VerifyPassword(invalidPassword, hashedPassword);

        // Assert
        Assert.False(result);
    }
}
