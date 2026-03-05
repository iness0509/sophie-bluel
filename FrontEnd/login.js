
function showPopup(message, type = "info") {
  const popup = document.createElement("div");
  popup.className = `popup ${type}`; // applique type et style
  popup.textContent = message;

  document.body.appendChild(popup);

  // Disparaît après 5 secondes
  setTimeout(() => {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }, 5000);
}

//Lien login en gras 
const loginLink = document.querySelector('nav a[href="login.html"]');

if (loginLink) {
  loginLink.classList.add("active");
}

// authentification de l'utilisateur 
const login = document.querySelector(".form-login");

login.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showPopup("Veuillez remplir tous les champs", "info");
    return;
  }

  try {
    const res = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem("token", data.token);
      window.location.replace("index.html");
    } else {
      showPopup("Email ou mot de passe incorrect", "error");
    }

  } catch (error) {
    showPopup("Impossible de contacter le serveur", "error");
  }
  
});