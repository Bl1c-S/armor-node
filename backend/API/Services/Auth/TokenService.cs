using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using API.Models.DTOs;
using API.Options;
using Infrastructure.Model;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Services.Auth;

public class TokenService(IOptions<AuthOptions> options)
{
    private readonly AuthOptions _options = options.Value;
    public ArmorTokensDto Create(ArmorUser user)
    {
        var accessToken = CreateAccessToken(user);
        var refreshToken = CreateRefreshToken(user);
        return new ArmorTokensDto(accessToken, refreshToken);
    }

    private ArmorToken CreateAccessToken(ArmorUser user) => Create(user, TimeSpan.FromHours(2));

    private ArmorToken CreateRefreshToken(ArmorUser user) => Create(user, TimeSpan.FromDays(7), "refresh_token");

    private ArmorToken Create(ArmorUser user, TimeSpan lifeTime, string name = "access_token")
    {
        var claims = new List<Claim> { new(ClaimTypes.Name, user.UserName) };
        
        var credentials = new SigningCredentials(_options.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            audience: "VGT7",
            claims: claims,
            expires: DateTime.UtcNow.Add(lifeTime),
            signingCredentials: credentials);

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        return new ArmorToken(user.Id, token, name);
    }
}