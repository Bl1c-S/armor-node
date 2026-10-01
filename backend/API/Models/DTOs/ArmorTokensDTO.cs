using API.Services.Auth;

namespace API.Models.DTOs;

public record ArmorTokensDto(ArmorToken AccessToken, ArmorToken RefreshToken);