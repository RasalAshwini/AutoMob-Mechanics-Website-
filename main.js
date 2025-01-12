console.log(document.getElementById("loginBtn")); // Should log the button element
console.log(document.getElementById("registerBtn")); // Should log the button element

function redirectToPage(url) {
    window.location.href = url;
}


document.getElementById("loginBtn").addEventListener("click", handleLogin);
document.getElementById("registerBtn").addEventListener("click", handleRegister);

document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", function() {
        window.location.href = button.dataset.url;
    });
});


// Handle Login
function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
    }

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            alert('Login Successful!');
            window.location.href = "home.html"; // Redirect to home page
        } else {
            alert('Invalid credentials.');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Handle Register
function handleRegister() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (!passwordPattern.test(password)) {
        alert(
            "Password must contain:\n" +
            "- At least one uppercase letter\n" +
            "- At least one lowercase letter\n" +
            "- At least one number\n" +
            "- At least one special character (@#$%^&+=!)\n" +
            "- Minimum 8 characters in total"
        );
        return;
    }

    fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert('Registration Successful! You can now login.');
        } else {
            alert('Error registering user: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
