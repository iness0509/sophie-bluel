
// authentification de l'utilisateur 
const login = document.querySelector(".form-login");

login.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const connection = await fetch('http://localhost:5678/api/users/login', {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

if (connection.ok) {
      const data = await connection.json();
      sessionStorage.setItem("token", data.token); // Stocker le token dans le sessionStorage
      window.location.replace("index.html"); // Rediriger vers la page d'accueil
    } else {
      const errorData = await connection.json();
      document.querySelector(".error").style.display = "block";
    }

  } catch (error) {
    window.alert("Erreur");

  }
});