using API.Conventions;
using API.Options;
using API.Services.Auth;
using Infrastructure.Data;
using Infrastructure.Logger;
using Infrastructure.Model;
using Infrastructure.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace API.Extensions.WebApplicationBuilderExtensions;

public static class ConfigureWebApplicationBuilderExtensions
{
    extension(WebApplicationBuilder builder)
    {
        public void AddApplicationServices()
        {
            var services = builder.Services;
            var cfg = builder.Configuration;
            
            services.ConfigureOptions(cfg);

            var connectionOptions = GetOptions<ConnectionOptions>("Connection", cfg);

            builder.ConfigureLogger(connectionOptions);

            services.ConfigureEntityFramework(connectionOptions, builder);

            var authOptions = GetOptions<AuthOptions>("Auth", cfg);
            services.ConfigureAuthentication(authOptions);

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            services.AddHttpClient();
            services.AddControllers(options => { options.Conventions.Add(new ApiPrefixConvention("api")); });
            services.AddOpenApi();
        }

        private static TOptions GetOptions<TOptions>(string sectionName, ConfigurationManager cfg)
            where TOptions : class
        {
            var section = cfg.GetSection(sectionName);
            var options = section.Get<TOptions>()!;
            return options;
        }

        private void ConfigureLogger(ConnectionOptions options)
        {
            builder.Host.UseSerilog((_, services, configuration) =>
            {
                var loggerBuilder = new ArmorLoggerBuilder(options.Psql);
                var logger = loggerBuilder.Build();

                configuration.ReadFrom.Services(services)
                    .WriteTo.Logger(logger);
            });
            Log.Information("Logger init");
        }
    }

    extension(IServiceCollection services)
    {
        private void ConfigureEntityFramework(ConnectionOptions options,
            WebApplicationBuilder builder)
        {
            services.AddDbContext<ApplicationDbContext>(op =>
                op.UseNpgsql(options.Psql));

            services.AddIdentityCore<ArmorUser>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
            }).AddEntityFrameworkStores<ApplicationDbContext>();
            builder.Services.AddDataProtection()
                .SetApplicationName("ArmorNode")
                .PersistKeysToDbContext<ApplicationDbContext>();
        }

        private void ConfigureAuthentication(AuthOptions options)
        {
            services.AddScoped<TokenService>();
            services.AddScoped<EmailAuthService>();
            services.AddScoped<GoogleAuthService>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(op =>
                {
                    op.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,

                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = options.GetSymmetricSecurityKey()
                    };
                });
        }

        private void ConfigureOptions(ConfigurationManager cfg)
        {
            services.AddOptions<AuthOptions>()
                .Bind(cfg.GetSection("Auth")).ValidateOnStart();
            services.AddOptions<ConnectionOptions>()
                .Bind(cfg.GetSection("Connection")).ValidateOnStart();
        }
    }
}
