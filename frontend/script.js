const API_URL = "http://localhost:3000/api";

async function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await response.json();
    alert(data.message);
    window.location.href = "tasks.html";
}

async function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        console.log("🛰️ Servidor responde:", data);

        if (response.status === 200) {
            localStorage.setItem('token_jwt', data.token);
            alert(data.message);
            window.location.href = "tasks.html";
        } else {
            alert("Error al iniciar sesión: " + data.message);
        }

    } catch (error) {
        console.error("Error de conexión con el backend:", error);
    }
}