using API.Models.Requests;
using API.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace API.Controllers.Authentication;

[ApiController]
[Route("auth/google")]
public class GoogleAuthenticationController(GoogleAuthService googleAuthService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Authenticate([FromBody] GoogleAuthRequest request)
    {
        if (!request.IsValidRequest())
            return BadRequest(new { message = "Invalid Google authorization request." });

        try
        {
            var (tokens, errorMessage) = await googleAuthService.AuthenticateAsync(request);
            
            if (!string.IsNullOrWhiteSpace(errorMessage))
                return BadRequest(new { message = errorMessage });

            if (tokens == null)
                return Unauthorized(new { message = "Unable to verify Google user email." });

            return Ok(new { tokens });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Unexpected error during Google authentication");
            return StatusCode(500, new { message = "An error occurred while authenticating with Google." });
        }
    }
}
