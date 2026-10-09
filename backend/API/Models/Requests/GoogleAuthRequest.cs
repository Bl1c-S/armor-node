namespace API.Models.Requests;

public record GoogleAuthRequest(string? Code, string? Token, string? RedirectUri);
