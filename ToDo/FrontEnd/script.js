const API_URL = "http://localhost:5037/api/todoitems";

const todoList = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");

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
                
                <div class="todo-actions">
                    ${todo.isCompleted ?
                            `<button type="button" class="action-btn undo-btn" onclick="toggleComplete(${todo.id}, false)"> Undo </button>` :
                            `<button type="button" class="action-btn complete-btn" onclick="toggleComplete(${todo.id}, true)"> Complete </button>`
                        }
                    <button type="button" class="action-btn delete-btn" onclick="deleteTodo(${todo.id})"> Delete </button>
                </div>
            </div>
        </div>
    `;

    return listItem;
}

todoForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const dueDate = document.getElementById('dueDate').value;

        if (!title) {
            alert('Task title is required!');
            return;
        }

        const todoData = {
            title: title,
            description: description || null,
            dueDate: dueDate || null,
            isCompleted: false
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todoData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        todoForm.reset();
        await fetchList();

    } catch (error) {
        console.error('Error adding task:', error);
    }
});

async function toggleComplete(id, isCompleted) {
    try {
        const getResponse = await fetch(`${API_URL}/${id}`);
        if (!getResponse.ok) {
            throw new Error(`Could not fetch task details: HTTP ${getResponse.status}`);
        }

        const currentTodo = await getResponse.json();

        const updatedTodo = {
            ...currentTodo,
            isCompleted: isCompleted
        };

        const putResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo)
        });

        if (!putResponse.ok) {
            throw new Error(`HTTP ${putResponse.status}: ${putResponse.statusText}`);
        }

        await fetchList();

    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

async function deleteTodo(id) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        await fetchList();

    } catch (error) {
        console.error('Error deleting task:', error);
    }
}