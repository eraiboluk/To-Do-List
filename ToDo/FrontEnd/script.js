const API_URL = "http://localhost:5037/api/todoitems";

const todoList = document.getElementById("todoList");

document.addEventListener('DOMContentLoaded', function () {
    fetchList();
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
