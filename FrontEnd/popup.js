
// Messages d'alerte
function showPopup(message, type = "info") {
  const popup = document.createElement("div");
  popup.className = `popup ${type}`; 
  popup.textContent = message;

  document.body.appendChild(popup);

  // Disparaît après 5 secondes
  setTimeout(() => {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }, 5000);
}