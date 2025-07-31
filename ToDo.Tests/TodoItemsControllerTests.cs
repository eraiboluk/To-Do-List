using Microsoft.EntityFrameworkCore;
using ToDo.Controllers;
using ToDo.Data;
using ToDo.Models;
using Microsoft.AspNetCore.Mvc;

namespace ToDo.Tests
{
    public class TodoItemsControllerTests
    {
        [Fact]
        public async Task Create_AddsNewTodoItemAndReturnsCreatedAtAction()
        {
            var options = new DbContextOptionsBuilder<ThisDbContext>()
                .UseInMemoryDatabase(databaseName: "ToDoTestDB_Create")
                .Options;

            using (var context = new ThisDbContext(options))
            {
                var controller = new TodoItemsController(context);
                var newItem = new TodoItem { Title = "New Task", Description = "Test Description" };

                var result = await controller.Create(newItem);

                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
                var returnedItem = Assert.IsType<TodoItem>(createdAtActionResult.Value);
                Assert.NotNull(returnedItem);
                Assert.Equal("New Task", returnedItem.Title);
            }

            using (var context = new ThisDbContext(options))
            {
                var itemInDb = await context.TodoItems.SingleOrDefaultAsync(i => i.Title == "New Task");
                Assert.NotNull(itemInDb);
            }
        }

        [Fact]
        public async Task Update_ReturnsNoContentResult_WhenItemIsUpdatedSuccessfully()
        {
            var options = new DbContextOptionsBuilder<ThisDbContext>()
                .UseInMemoryDatabase(databaseName: "ToDoTestDB_Update")
                .Options;

            using (var context = new ThisDbContext(options))
            {
                context.TodoItems.Add(new TodoItem { Id = 1, Title = "Old Title" });
                await context.SaveChangesAsync();
            }

            var updatedItem = new TodoItem { Id = 1, Title = "New Title" };

            using (var context = new ThisDbContext(options))
            {
                var controller = new TodoItemsController(context);
                var result = await controller.Update(1, updatedItem);
                Assert.IsType<NoContentResult>(result);
            }
        }

        [Fact]
        public async Task Update_ReturnsNotFoundResult_WhenItemDoesNotExist()
        {
            var options = new DbContextOptionsBuilder<ThisDbContext>()
                .UseInMemoryDatabase(databaseName: "ToDoTestDB_Update_NotFound")
                .Options;

            var updatedItem = new TodoItem { Id = 999, Title = "New Title" };

            using (var context = new ThisDbContext(options))
            {
                var controller = new TodoItemsController(context);
                var result = await controller.Update(999, updatedItem);
                Assert.IsType<NotFoundResult>(result);
            }
        }
    }
}
