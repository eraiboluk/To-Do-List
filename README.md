ToDo List Application
Bir yapılacaklar listesi uygulaması. .NET Core Web API backend'i ve vanilla JavaScript frontend'i ile geliştirilmiştir.

Backend: ASP.NET Core Web API
Veritabanı: Entity Framework Core ve SQLite(SQL server proje yapılırken bellek yetersizliğine yol açtığı için tercih edilmedi)

Frontend HTML/CSS/Vanilla JS

Özellikler
Görev ekleme, güncelleme ve silme
Görev tamamlama/geri alma
Son tarih belirleme

## Tests

This project includes unit tests for the `TodoItemsController` class to verify the correctness of key API endpoints.

### Tested Endpoints

- **POST /api/todoitems**  
  Ensures that a new to-do item can be created successfully and saved to the database.

- **PUT /api/todoitems/{id}**
  - Returns `204 NoContent` if the item is updated successfully.
  - Returns `404 NotFound` if the item with the given ID does not exist.

### Frameworks

- `xUnit` – Unit testing framework  
- `Microsoft.EntityFrameworkCore.InMemory` – In-memory database provider for Entity Framework Core  
- `Microsoft.AspNetCore.Mvc` – Controller result types  
- `Moq` – Referenced but not used in this context, as mocking was not necessary

### Notes

- All tests are isolated using separate in-memory databases for each case.
- The controller directly uses `DbContext`, so mocking with Moq was not needed.