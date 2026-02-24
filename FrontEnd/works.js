
// URL API
const API_WORKS = "http://localhost:5678/api/works";
const API_CATEGORIES = "http://localhost:5678/api/categories";


// Récupére les zones HTML
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

// Stockage global des projets pour éviter de refaire fetch
let allWorks = [];


// Récupére les données des projets
async function fetchWorks() {
  const response = await fetch(API_WORKS);
  const works = await response.json();
  return works;
}

// Récupére les données des catégories
async function fetchCategories() {
  const response = await fetch(API_CATEGORIES);
  const categories = await response.json();
  return categories;
}


// Affiche la galerie
function renderGallery(works) {
  gallery.innerHTML = ""; // évite les doublons

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


// Gestion du bouton actif
function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  activeButton.classList.add("active");
}


// Créer un bouton de filtre
function createFilterButton(label, categoryId) {
  const button = document.createElement("button");
  button.textContent = label;
  button.classList.add("filter-btn");

  button.addEventListener("click", () => {
    setActiveButton(button);

    if (categoryId === null) {
      renderGallery(allWorks);
    } else {
      const filteredWorks = allWorks.filter
      ((work) => work.categoryId === categoryId
      );
      renderGallery(filteredWorks);
    }
  });

  return button;
  
}


// Affiche les filtres
function renderFilters(categories) {
  filtersContainer.innerHTML = "";

  // Bouton "Tous"
  const allButton = createFilterButton("Tous", null);
  allButton.classList.add("active");
  filtersContainer.appendChild(allButton);

  // Boutons catégories
  categories.forEach((category) => {
    const button = createFilterButton(category.name, category.id);
    filtersContainer.appendChild(button);
  });
}


// Initialisation
async function init() {
  const works = await fetchWorks();
  const categories = await fetchCategories();

  allWorks = works;

  renderFilters(categories);
  renderGallery(allWorks);

  renderModalGallery(allWorks);
}

init();


// GESTION des login/logout
const authLink = document.getElementById("auth");
const token = sessionStorage.getItem("token");
const modeEditionBar = document.getElementById("mode-edition");
const edit = document.querySelector(".edit");

if (token && edit) {
  edit.style.display="flex";
}

if (token && modeEditionBar) {
  // afficher la barre du mode edition 
  modeEditionBar.style.display = "flex"; 
  document.body.classList.add("admin-bar");
}

// cacher les filtres si connecté
if (token && filtersContainer) {
  filtersContainer.style.display = "none";
}

if (authLink) {
  if (token) {
    // Si connecté
    authLink.textContent = "logout";
    authLink.href = "#";

    authLink.addEventListener("click", function (event) {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.reload();
      
    });
  } else {
    // Si non connecté
    authLink.textContent = "login";
    authLink.href = "login.html";
  }
} 


// LES MODALES 

const modalGallery = document.querySelector(".modal-gallery");

// Fonction qui remplit la galerie de la modale
function renderModalGallery(works) {
  if (!modalGallery) return;

  modalGallery.innerHTML = ""; 

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-thumb");
    figure.dataset.id = work.id; // utile plus tard pour supprimer

    const img = document.createElement("img");
    img.src = work.imageUrl;     
    img.alt = work.title;        

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("thumb-delete");
    deleteBtn.dataset.id = work.id; // indispensable pour le DELETE API


    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");

    deleteBtn.appendChild(trashIcon);
    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  });
}

// gestions des clic
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const editBtn = document.querySelector(".edit");             
const addPhotoBtn = document.querySelector("#modal1 .modal-add-button");
const backBtn = document.querySelector("#modal2 .modal-back");
const closeBtns = document.querySelectorAll(".modal .modal-close");

// ouvrir la modal1 au clic sur le bouton modifier
if (editBtn && modal1) {
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal1.classList.add("is-open");
  });
}

// passer de la modal1 à la modal2 au clic sur le bouton "Ajouter une photo"
if (addPhotoBtn && modal1 && modal2) {
  addPhotoBtn.addEventListener("click", () => {
    modal1.classList.remove("is-open");
    modal2.classList.add("is-open");
   
  });
}

//  revenir de la modal2 à la  modal1 au clic sur la flèche retour
if (backBtn && modal1 && modal2) {
  backBtn.addEventListener("click", () => {
    modal2.classList.remove("is-open");
    modal1.classList.add("is-open");
  
  });
}

//  fermer la modale ouverte au clic sur la croix 
closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    if (modal) {
      modal.classList.remove("is-open");
     
    }
  });
});

// fonction qui ferme les modales au clic sur l'overlay 
function closeModalOverlay(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
 
}
if (modal1) {
  modal1.addEventListener("click", (e) => {
    if (e.target === modal1) {     
      closeModalOverlay(modal1);
    }
  });
}
if (modal2) {
  modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
      closeModalOverlay(modal2);
    }
  });
}

// gestion de l'affichage de l'aperçu des nouvelles images
const fileInput = document.getElementById("file");
const previewImg = document.getElementById("preview-image");
const icon = document.querySelector("#modal2 .upload-Photo i.fa-image");
const uploadBtn = document.querySelector("#modal2 .upload-button");
const text = document.querySelector("#modal2 .upload-Photo p");

if (fileInput && previewImg) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

 // contrôle de la taille avant la preview
  if (file.size > 4_000_000) { // ~4 Mo
    alert("Image > 4 Mo, refusée");
    fileInput.value = "";            // on vide le champ
    // on remet l'état sans image
    previewImg.style.display = "none";
    icon.style.display = "block";
    uploadBtn.style.display = "inline-block";
    text.style.display = "block";
    return;
  }
 // si taille de la photo OK -> on affiche l’aperçu
    const reader = new FileReader();

    reader.onload = (e) => {
    previewImg.src = e.target.result;  
    previewImg.style.display = "block";
    icon.style.display = "none";
    uploadBtn.style.display = "none";
    text.style.display = "none";
    };

    reader.readAsDataURL(file); 
  });
}

// gestion de la suppression des photos 
async function deleteWork(id, token) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  // true si la suppression a bien fonctionné (200, 204, etc.) [web:518][web:603]
  return response.ok;
}

if (modal1) {
  modal1.addEventListener("click", async (e) => {
    const btn = e.target.closest(".thumb-delete");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (!confirm("Supprimer ce travail ?")) return;

    const ok = await deleteWork(id, token);
    if (!ok) {
      alert("Suppression impossible");
      return;
    }

    // 1) mettre à jour le tableau mémoire
    const workId = Number(id);
    allWorks = allWorks.filter((work) => work.id !== workId);

    // 2) réafficher les galeries à partir de allWorks
    renderGallery(allWorks);
    renderModalGallery(allWorks);
  });
}

//récupération des catégories via l'api 
const categorySelect = document.getElementById("categoryInput");

async function loadCategory() {
  const res = await fetch("http://localhost:5678/api/categories");
  const categories = await res.json(); // tableau { id, name, ... } [web:616]

  categorySelect.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
}

loadCategory();


//gestion de la validation des champs avec le bouton vert
const titleInput = document.getElementById("title");
const submitButton = document.querySelector("#modal2 .modal-add-button");

function checkForm() {
  const titleOk = titleInput.value !== "";
  const categoryOk = categorySelect.value !== "";
  const imageOk = fileInput.files.length > 0;

  if (titleOk && categoryOk && imageOk) {
    submitButton.style.backgroundColor = "#1D6154";
  } else {
    submitButton.style.backgroundColor = "#A7A7A7";
  }
}

titleInput.addEventListener("input", checkForm);
categorySelect.addEventListener("change", checkForm);
fileInput.addEventListener("change", checkForm);


//gestion des ajouts photos 
const formAddWork = document.getElementById("formAddWork");
console.log("formAddWork =", formAddWork);
formAddWork.addEventListener("submit", async (e) => {
  e.preventDefault();
console.log("submit déclenché");

  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const image = fileInput.files[0];

   console.log("title:", title, "category:", category, "image:", image);

  // Message d’erreur si formulaire incomplet
  if (!title || !category || !image) {
    alert("Veuillez remplir tous les champs et choisir une image.");
    return;
  }

  // l'envoi de données de formulaire,
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  try {
    const res = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    //  Message selon la réponse de l’API
    if (!res.ok) {
      alert("Erreur de l'API : " + res.status);
      return;
    }
    const newWork = await res.json(); // { id, title, imageUrl, ... } [web:769]

    // 1) mettre à jour le tableau mémoire
    allWorks.push(newWork);
      // 2) réafficher les galeries à partir de allWorks
    renderGallery(allWorks);
    renderModalGallery(allWorks);
    
    resetAddWorkForm();
    modal2.classList.remove("is-open");
    modal1.classList.remove("is-open");

    alert("Projet ajouté avec succès !");
   
    
  } catch (err) {
    alert("Erreur réseau, impossible de contacter l'API.");
  }
});


//Fonction pour nettoyer le formulaire + preview
function resetAddWorkForm() {
  formAddWork.reset();

  // reset preview
  previewImg.style.display = "none";
  previewImg.src = "";
  icon.style.display = "block";
  uploadBtn.style.display = "inline-block";
  text.style.display = "block";

  submitButton.style.backgroundColor = "#A7A7A7";
}

