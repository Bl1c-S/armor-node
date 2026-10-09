using API.Models.Requests;

namespace API.Controllers.Authentication;

public static class AuthValidations
{
    public static bool IsValidRequest(this LoginByEmailRequest byEmailRequest)
    {
        if (string.IsNullOrEmpty(byEmailRequest.Email) || string.IsNullOrEmpty(byEmailRequest.Password))
            return false;
        return true;
    }

    public static bool IsValidRequest(this RegisterByEmailRequest byEmailRequest)
    {
        if (string.IsNullOrEmpty(byEmailRequest.Email) || string.IsNullOrEmpty(byEmailRequest.Password))
            return false;
        return true;
    }

    public static bool IsValidRequest(this RefreshTokenRequest request)
    {
        return !string.IsNullOrWhiteSpace(request.RefreshToken);
    }

    public static bool IsValidRequest(this GoogleAuthRequest request)
    {
        return !string.IsNullOrWhiteSpace(request.Code) || !string.IsNullOrWhiteSpace(request.Token);
    }
}
