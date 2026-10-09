using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace API.Options;

public class AuthOptions
{
    public string Secret { get; set; } = string.Empty;
    public string? GoogleClientId { get; set; }
    public string? GoogleClientSecret { get; set; }
    
    public SymmetricSecurityKey GetSymmetricSecurityKey() => new(Encoding.UTF8.GetBytes(Secret));
}
