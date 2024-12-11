using System;
using System.Linq;
using FlightPalApi.Models;

// Rehash Passwords and add hashing to old passwords
public class PasswordUpdater
{
    public static void UpdateUserPasswords(FlightPalContext context, AuthService authService)
    {
        var users = context.Users.Where(u => !u.Password.Contains(":")).ToList(); // Check if the password is plaintext

        foreach (var user in users)
        {
            try
            {
                Console.WriteLine($"Updating password for user: {user.Email}");

                // Hash the plaintext password
                string hashedPassword = authService.HashPassword(user.Password);

                // Update the user object
                user.Password = hashedPassword;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating password for user {user.Email}: {ex.Message}");
            }
        }

        try
        {
            // Save changes to the database
            context.SaveChanges();
            Console.WriteLine("Passwords updated successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving changes to the database: {ex.Message}");
        }
    }
}
