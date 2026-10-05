using Infrastructure.Model;
using Microsoft.AspNetCore.Identity;

namespace API.Services.Auth;

public class EmailAuthService(UserManager<ArmorUser> userManager)
{
    public async Task<(bool wasCreated, ArmorUser? user)> Register(string email, string password)
    {
        var newUser = new ArmorUser(email);
        var result = await userManager.CreateAsync(newUser, password);

        if (result.Succeeded)
            return (true, newUser);

        if (result.Errors.Any(e => e.Code is "DuplicateUserName" or "DuplicateEmail"))
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user != null) return (false, user);
        }

        var errors = string.Join("\n", result.Errors.Select(e => e.Description));
        throw new ArgumentException(errors);
    }

    public async Task<(bool isLogin, ArmorUser? user)> Login(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user == null)
            return (false, null);

        var isPasswordCorrect = await userManager.CheckPasswordAsync(user, password);

        if (isPasswordCorrect)
            return (true, user);

        return (false, null);
    }

    public async Task<(bool isFound, ArmorUser? user)> GetUserByEmail(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        return (user != null, user);
    }

    public async Task<(bool isFound, ArmorUser? user)> GetUserById(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        return (user != null, user);
    }
}