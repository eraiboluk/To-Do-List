const API_URL = "http://localhost:5037/api/todoitems";

const todoList = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dueDateInput = document.getElementById("dueDate");

document.addEventListener('DOMContentLoaded', function () {
    fetchList();
    todoForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const dueDate = dueDateInput.value;

        if (!title) {
            alert("Title is required.");
            return;
        }

        const newTodo = {
            title,
            description,
            dueDate
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTodo)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            titleInput.value = "";
            descriptionInput.value = "";
            dueDateInput.value = "";

            fetchList();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    });
});

async function fetchList() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const todos = await response.json();
        displayTodos(todos);

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function displayTodos(todos) {
    todoList.innerHTML = '';

    if (!todos || todos.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = 'No tasks added yet. You can add new tasks using the form above.';
        todoList.appendChild(emptyMessage);
        return;
    }

    todos.forEach(todo => {
        const listItem = createTodoElement(todo);
        todoList.appendChild(listItem);
    });
}

function createTodoElement(todo) {
    const listItem = document.createElement('li');
    listItem.className = todo.isCompleted ? 'completed' : '';

    const formattedDate = todo.dueDate ?
        new Date(todo.dueDate).toLocaleDateString('en-US') :
        'No date specified';

    listItem.innerHTML = `
        <div class="todo-item">
            <div class="todo-content">
                <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? 'checked' : ''} disabled>
                <div class="todo-info">
                    <div class="todo-title">${todo.title}</div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                    <div class="todo-date">${formattedDate}</div>
                </div>
            </div>
        </div>
    `;

    return listItem;
}
