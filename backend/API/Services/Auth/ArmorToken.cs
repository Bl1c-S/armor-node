using Microsoft.AspNetCore.Identity;

namespace API.Services.Auth;

public sealed class ArmorToken : IdentityUserToken<string>
{
    public ArmorToken(string userid, string token, string name)
    {
        UserId = userid;
        LoginProvider = "JWT";
        Name = name;
        Value = token;
    }
}