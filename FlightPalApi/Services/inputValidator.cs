using System.Text.RegularExpressions;

public static class InputValidator
{
    public static bool IsValidEmail(string username)
    {
        if (string.IsNullOrWhiteSpace(username) || username.Length < 3 || username.Length > 50)
            return false;

        // Validate email format
        var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        return regex.IsMatch(username);
    }

    public static bool IsValidPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8 || password.Length > 64)
            return false;

        // Ensure password has at least one uppercase, one lowercase, one number, and one special character
        var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
        return regex.IsMatch(password);
    }
}
