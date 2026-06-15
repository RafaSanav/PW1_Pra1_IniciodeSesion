const token = localStorage.getItem('token_jwt');

document.addEventListener('DOMContentLoaded', async () => {
   

    if (!token) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html"; 
        return;
    }

    obtenerTareas();
});

async function obtenerTareas() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            alert(data.message);
            localStorage.removeItem('token_jwt');
            window.location.href = "index.html";
            return;
        }

        renderTasks(data.tasks);

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

function renderTasks(tasks) {
    const lista = document.getElementById("lista-tareas");
    lista.innerHTML = "";

    if (tasks.length === 0) {
        lista.innerHTML = "<li>No tienes tareas pendientes </li>";
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong>
            </div>
            <button class="btn-delete" onclick="borrarTask(${task.id})">Borrar tarea</button>
        `;
        lista.appendChild(li);
    });
}

async function crearTask() {
    const inputTitulo = document.getElementById("titletask");
    
    const title = inputTitulo.value.trim();
    inputTitulo.value = "";

    if (!title) {
        alert("Por favor, escribe un título para la tarea.");
        inputTitulo.focus();
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title})
        });

        const data = await response.json();

        if (response.status === 201) {
            alert(data.message);
            obtenerTareas();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error al crear la tarea:", error);
    }
}

async function borrarTask(taskId) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(data.message);
            obtenerTareas();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
    }
}