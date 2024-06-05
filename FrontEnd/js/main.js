// Import des fonctions depuis les fichiers dédiés
import {
  afficherTravaux,
  ouvrirModale,
  genererFiltres,
  updataLStorageWorks,
  updataLStorageCategs,
  fonctionnementFiltres,
  logOut,
} from "./functions.js";

import {
  fermerModale,
  modaleAfficherGallerie,
  modaleGenererCategs,
  modalePreviewImage,
  modaleSuppressionProjet,
  modaleSwitchSection,
} from "./modale.js";

// Récupération des travaux et catégories déjà stockés dans le localStorage
let works = window.localStorage.getItem("works");
let categories = window.localStorage.getItem("categories");
let userData = JSON.parse(window.localStorage.getItem("userData"));

// Si les données ne sont pas encore stockés, on les fetch et les stocke
if (works === null) {
  updataLStorageWorks();
} else {
  works = JSON.parse(works);
}

if (categories === null) {
  updataLStorageCategs();
} else {
  categories = JSON.parse(categories);
}

// Génération des filtres
genererFiltres(categories);

// Ajout des event listener sur les filtres
fonctionnementFiltres(works);

// Ajout des travaux dans le HTML
afficherTravaux(works);

if (userData) {
  // Ajout de la bannière en haut du site pour le mode édition
  const editDropDown = document.createElement("p");
  editDropDown.innerText = "Mode édition";
  editDropDown.id = "edit-dropdown";
  document.querySelector("header").before(editDropDown);
  document.querySelector("body").style.paddingTop = "32px";

  // Ajout de l'indicateur du mode édition au-dessus de la galerie photo
  const editButton = document.createElement("button");
  const portfolioTitleContainer = document.createElement("div");

  editButton.innerText = "modifier";
  portfolioTitleContainer.id = "portfolio-title";
  portfolioTitleContainer;

  document.querySelector("#portfolio h2").before(portfolioTitleContainer);
  document
    .getElementById("portfolio-title")
    .append(document.querySelector("#portfolio h2"));
  document.getElementById("portfolio-title").append(editButton);
  document.querySelector("#portfolio-title h2").style.margin = "0";

  // Ouverture de la modale
  ouvrirModale();

  // Possibilité de se déconnecter
  logOut(userData);
}

// --- Modale ---

// Affichage des travaux dans le menu de suppression de projet
modaleAfficherGallerie(works);

// Ajout des eventListeners pour fermer la modale
fermerModale();

// Suppression de projet
modaleSuppressionProjet();

// Ajout des catégories dans la modale d'ajout de projet
modaleGenererCategs(categories);

// Ajout des event listeners pour ouvrir et fermer la section d'ajout de projet
modaleSwitchSection();

// Ajout de la preview de l'image dans la modale
const fileImgInput = document.getElementById("file-picture");
fileImgInput.addEventListener("change", () => {
  modalePreviewImage();
});

// Fonctionnement du formulaire

// Fonction permettant de re-définir la liste de travaux affichés sur tout le site
const redefineWorks = async () => {
  updataLStorageWorks(works);
  works = JSON.parse(works);
  afficherTravaux(works);
  galleryPopup(works);
  applyRemoveBtns();
};

// Vérification qu'il n'y a pas de champ vide dans le formulaire
const checkRequired = (img, name, categ) => {
  const formContainer = document.querySelector(".popup-form");
  if (document.querySelector(".popup-error")) {
    document.querySelector(".popup-error").remove();
  }
  if (!img) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("popup-error");
    errorMessage.innerText = "Veuillez ajouter la photographie du projet.";
    errorMessage.style.top = "10.1rem";
    formContainer.appendChild(errorMessage);
  } else if (!name) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("popup-error");
    errorMessage.innerText = "Veuillez ajouter le titre du projet.";
    errorMessage.style.top = "16rem";
    formContainer.appendChild(errorMessage);
  } else if (!categ) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("popup-error");
    errorMessage.innerText = "Veuillez ajouter la catégorie du projet.";
    errorMessage.style.top = "22.4rem";
    formContainer.appendChild(errorMessage);
  } else {
    document.querySelector(
      '#popup-section-add input[type="submit"]'
    ).style.backgroundColor = "#1D6154";
    return true;
  }
};

const inputFields = [
  document.getElementById("file-picture"),
  document.getElementById("file-title"),
  document.getElementById("file-category"),
];
inputFields.forEach((field) => {
  field.addEventListener("change", () => {
    checkRequired(
      document.getElementById("file-picture").files[0],
      document.getElementById("file-title").value,
      document.getElementById("file-category").value
    );
  });
});

const addWork = async () => {
  const workImg = document.getElementById("file-picture").files[0];
  const workName = document.getElementById("file-title").value;
  const wantedCateg = document.getElementById("file-category").value;

  if (checkRequired(workImg, workName, wantedCateg)) {
    const fetchBody = new FormData();
    fetchBody.append("image", workImg);
    fetchBody.append("title", workName);
    const workCateg = categories.find((categ) => categ.name === wantedCateg).id;
    fetchBody.append("category", workCateg);

    await fetch("http://localhost:5678/api/works", {
      body: fetchBody,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
      method: "POST",
    });
    redefineWorks();
    popupBackground.classList.remove("active");
    addSectionContainer.style.left = "250%";
    rmvSectionContainer.style.right = "16%";
    const confirmMsg = document.createElement("p");
    confirmMsg.classList.add("edit-confirm");
    confirmMsg.innerText = "Projet ajouté";
    confirmMsg.style.backgroundColor = "#1D6154";
    document.body.appendChild(confirmMsg);
    setTimeout(() => {
      confirmMsg.remove();
    }, 4000);
  }
};

const popupSubmit = document.querySelector('.popup-form input[type="submit"]');
popupSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  addWork();
});
