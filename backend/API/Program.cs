using API.Extensions.WebApplicationBuilderExtensions;
using API.Extensions.WebApplicationExtensions;

var builder = WebApplication.CreateBuilder(args);
builder.AddApplicationServices();


var app = builder.Build();
app.ApplyMigrations();
app.ConfigureDevelopment();


app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.ApplicationStarted();
app.Run();

public partial class Program { }
