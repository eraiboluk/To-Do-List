using Microsoft.AspNetCore.Mvc;
using ToDo.Data;
using ToDo.Models;

namespace ToDo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoItemsController : ControllerBase
    {
        private readonly ThisDbContext _context;

        public TodoItemsController(ThisDbContext context)
        {
            _context = context;
        }

        // Tüm yapılacaklar listesi öğelerini getirir.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetAll()
        {
            throw new NotImplementedException();
        }

        // Belirli bir id'ye sahip yapılacaklar listesi öğesini getirir. Öğe bulunamazsa uygun bir HTTP 404 Not Found yanıtı döndürün.
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> Get(int id)
        {
            throw new NotImplementedException();
        }

        // Yeni bir yapılacaklar listesi öğesi oluşturur. Başarılı olursa HTTP 201 Created yanıtı ile oluşturulan öğeyi ve konumunu (Location header) döndürün.
        [HttpPost]
        public async Task<ActionResult<TodoItem>> Create(TodoItem item)
        {
            throw new NotImplementedException();
        }

        // Belirli bir id'ye sahip yapılacaklar listesi öğesini günceller. Öğe bulunamazsa HTTP 404 Not Found, geçersiz veri gelirse HTTP 400 Bad Request yanıtı döndürün.
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TodoItem updatedItem)
        {
            throw new NotImplementedException();
        }

        // Belirli bir id'ye sahip yapılacaklar listesi öğesini siler. Öğe başarıyla silinirse HTTP 204 No Content yanıtı döndürün. Öğe bulunamazsa HTTP 404 Not Found yanıtı döndürün.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
