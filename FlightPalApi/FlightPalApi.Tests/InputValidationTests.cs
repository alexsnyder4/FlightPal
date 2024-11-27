using Xunit;

public class InputValidatonTests
{
    [Theory]
    [InlineData("valid.email@example.com", true)]
    [InlineData("short@e.co", true)]
    [InlineData("invalidemail.com", false)]
    [InlineData("", false)]
    [InlineData("a@b", false)]
    public void IsValidEmail_ShouldValidateCorrectly(string email, bool expected)
    {
        // Act
        var result = InputValidator.IsValidEmail(email);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("ValidPass1@", true)]
    [InlineData("short1@", false)] // Too short
    [InlineData("NoSpecialChar1", false)]
    [InlineData("NoNumber@", false)]
    [InlineData("12345678@", false)]
    [InlineData("", false)]
    public void IsValidPassword_ShouldValidateCorrectly(string password, bool expected)
    {
        // Act
        var result = InputValidator.IsValidPassword(password);

        // Assert
        Assert.Equal(expected, result);
    }
}
