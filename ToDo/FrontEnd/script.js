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
            `<button type="button" class="action-btn complete-btn" onclick="toggleComplete(${todo.id}, true)"> Complete </button>`} 
                <button type="button" class="action-btn update-btn" onclick="startUpdate(${todo.id})"> Update </button>
                <button type="button" class="action-btn delete-btn" onclick="deleteTodo(${todo.id})"> Delete </button>
            </div>
        </div>
    </div>
`;

    return listItem;
}

async function startUpdate(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Task could not be fetched.');
        }
        const todo = await response.json();

        document.getElementById('updateId').value = todo.id;
        document.getElementById('title').value = todo.title;
        document.getElementById('description').value = todo.description || '';
        document.getElementById('dueDate').value = todo.dueDate ? todo.dueDate.substring(0, 10) : '';

        document.getElementById('formTitle').innerText = 'Update Task';
        document.getElementById('submitBtn').innerText = 'Update Task';

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error preparing update:', error);
    }
}

function resetFormState() {
    document.getElementById('updateId').value = '';
    document.getElementById('formTitle').innerText = 'Add New Task';
    document.getElementById('submitBtn').innerText = 'Add Task';
    todoForm.reset();
}

todoForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const updateId = document.getElementById('updateId').value;

    if (updateId) {
        await handleUpdate(updateId);
    } else {
        await handleAdd();
    }
});

async function handleAdd() {
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        resetFormState();
        await fetchList();

    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function handleUpdate(id) {
    try {
        const getResponse = await fetch(`${API_URL}/${id}`);
        if (!getResponse.ok) throw new Error('Could not fetch task to update.');
        const currentTodo = await getResponse.json();

        const updatedTodo = {
            ...currentTodo,
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim() || null,
            dueDate: document.getElementById('dueDate').value || null
        };

        const putResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });

        if (!putResponse.ok) throw new Error(`HTTP ${putResponse.status}`);

        resetFormState();
        await fetchList();

    } catch (error) {
        console.error('Error updating task:', error);
    }
}

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