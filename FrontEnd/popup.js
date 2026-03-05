
// Messages d'alerte
function showPopup(message, type = "info") {
  const popup = document.createElement("div");
  popup.className = `popup ${type}`; 
  popup.textContent = message;

  document.body.appendChild(popup);

  // Disparaît après 5 secondes
   setTimeout(() => {
    popup.remove();
  }, 5000);
}