using Microsoft.EntityFrameworkCore;
using ToDo.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Calisirken LocalDB ile memory sorunlari aldigim icin daha hafif olan SQLite kullandim
builder.Services.AddDbContext<ThisDbContext>(options =>
    options.UseSqlite("Data Source=todo.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
