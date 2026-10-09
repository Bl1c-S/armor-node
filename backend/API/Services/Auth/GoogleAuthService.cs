using System.IdentityModel.Tokens.Jwt;
using System.Text.Json.Nodes;
using API.Models.Requests;
using API.Options;
using Infrastructure.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Serilog;

namespace API.Services.Auth;

public class GoogleAuthService(
    UserManager<ArmorUser> userManager,
    TokenService tokenService,
    IHttpClientFactory httpClientFactory,
    IOptions<AuthOptions> authOptions)
{
    private readonly AuthOptions _options = authOptions.Value;

    private const string GoogleTokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo";
    private const string GoogleTokenExchangeUrl = "https://oauth2.googleapis.com/token";
    private const string GoogleUserInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    private const string DefaultRedirectUri = "http://localhost:3000/login";
    private const string GrantType = "authorization_code";
    private const string EmailClaimType1 = "email";
    private const string EmailClaimType2 = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

    public async Task<(Models.DTOs.ArmorTokensDto? tokens, string? errorMessage)> AuthenticateAsync(GoogleAuthRequest request)
    {
        var (email, errorMessage) = await ResolveGoogleUserEmailAsync(request);

        if (!string.IsNullOrWhiteSpace(errorMessage))
            return (null, errorMessage);

        if (string.IsNullOrWhiteSpace(email))
            return (null, "Unable to verify Google user email.");

        var user = await GetOrCreateUserAsync(email);
        if (user == null)
            return (null, "Failed to register Google user account.");

        var tokens = tokenService.Create(user);
        return (tokens, null);
    }

    private async Task<ArmorUser?> GetOrCreateUserAsync(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user != null)
        {
            Log.Information("Existing user logged in via Google OAuth: {Email}", email);
            return user;
        }

        user = new ArmorUser(email);
        var createResult = await userManager.CreateAsync(user);
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
            Log.Error("Failed to create Google user: {Errors}", errors);
            return null;
        }

        Log.Information("New user created via Google OAuth: {Email}", email);
        return user;
    }

    private async Task<(string? email, string? errorMessage)> ResolveGoogleUserEmailAsync(GoogleAuthRequest request)
    {
        var client = httpClientFactory.CreateClient();

        if (!string.IsNullOrWhiteSpace(request.Token))
            return await ValidateIdTokenAsync(client, request.Token);

        if (!string.IsNullOrWhiteSpace(request.Code))
            return await ExchangeAuthorizationCodeAsync(client, request.Code, request.RedirectUri);

        return (null, "Unable to resolve email from Google OAuth.");
    }

    private async Task<(string? email, string? errorMessage)> ValidateIdTokenAsync(HttpClient client, string token)
    {
        var url = $"{GoogleTokenInfoUrl}?id_token={Uri.EscapeDataString(token)}";
        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            Log.Warning("Google tokeninfo failed: {ErrorBody}", errorBody);
            return (null, "Invalid or expired Google token.");
        }

        var content = await response.Content.ReadAsStringAsync();
        var email = ExtractEmailFromJson(content);

        return !string.IsNullOrWhiteSpace(email) ? (email, null) : (null, "Email not found in token info.");
    }

    private async Task<(string? email, string? errorMessage)> ExchangeAuthorizationCodeAsync(HttpClient client, string code, string? redirectUri)
    {
        var clientId = GetClientId();
        var clientSecret = GetClientSecret();

        if (string.IsNullOrWhiteSpace(clientSecret))
        {
            const string msg = "Google Client Secret is not configured on the server. Please set GoogleClientSecret in backend appsettings.json or GOOGLE_CLIENT_SECRET environment variable.";
            Log.Error(msg);
            return (null, msg);
        }

        var tokenRequestBody = new Dictionary<string, string>
        {
            { "code", code },
            { "client_id", clientId ?? string.Empty },
            { "client_secret", clientSecret },
            { "redirect_uri", redirectUri ?? DefaultRedirectUri },
            { "grant_type", GrantType }
        };

        var response = await client.PostAsync(GoogleTokenExchangeUrl, new FormUrlEncodedContent(tokenRequestBody));
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            Log.Warning("Google code exchange failed: {ErrorBody}", errorBody);
            return (null, $"Google token exchange failed: {ExtractErrorDetail(errorBody)}");
        }

        var tokenJson = await response.Content.ReadAsStringAsync();
        var tokenNode = JsonNode.Parse(tokenJson);

        var idToken = tokenNode?["id_token"]?.ToString();
        if (!string.IsNullOrWhiteSpace(idToken))
        {
            var email = ExtractEmailFromJwt(idToken);
            if (!string.IsNullOrWhiteSpace(email))
                return (email, null);
        }

        var accessToken = tokenNode?["access_token"]?.ToString();
        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            var email = await FetchUserInfoAsync(client, accessToken);
            if (!string.IsNullOrWhiteSpace(email))
                return (email, null);
        }

        return (null, "Unable to resolve email from Google OAuth.");
    }

    private async Task<string?> FetchUserInfoAsync(HttpClient client, string accessToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, GoogleUserInfoUrl);
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            return ExtractEmailFromJson(json);
        }
        return null;
    }

    private string? GetClientId() =>
        !string.IsNullOrWhiteSpace(_options.GoogleClientId)
            ? _options.GoogleClientId
            : Environment.GetEnvironmentVariable("NEXT_PUBLIC_GOOGLE_CLIENT_ID")
              ?? Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");

    private string? GetClientSecret() =>
        !string.IsNullOrWhiteSpace(_options.GoogleClientSecret)
            ? _options.GoogleClientSecret
            : Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")
              ?? Environment.GetEnvironmentVariable("Auth__GoogleClientSecret");

    private static string? ExtractEmailFromJson(string json)
    {
        try
        {
            var node = JsonNode.Parse(json);
            return node?["email"]?.ToString();
        }
        catch
        {
            return null;
        }
    }

    private static string? ExtractEmailFromJwt(string idToken)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(idToken);
            var claim = jwt.Claims.FirstOrDefault(c => c.Type is EmailClaimType1 or EmailClaimType2);
            return claim?.Value;
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "Failed to parse Google id_token JWT");
            return null;
        }
    }

    private static string ExtractErrorDetail(string errorBody)
    {
        try
        {
            var node = JsonNode.Parse(errorBody);
            return node?["error_description"]?.ToString() ?? node?["error"]?.ToString() ?? errorBody;
        }
        catch
        {
            return errorBody;
        }
    }
}
