// Import des fonctions depuis les fichiers dédiés
import {
  updataLStorageWorks,
  updataLStorageCategs,
  afficherTravaux,
  genererFiltres,
  fonctionnementFiltres,
  logOut,
} from "./functions.js";

import {
  modaleOuvrir,
  modaleAfficherGallerie,
  modaleFermer,
  modaleConfirmEdition,
  modaleSuppressionProjet,
  modaleGenererCategs,
  modaleSwitchSection,
  modalePreviewImage,
  modaleVerifChamps,
  modaleEnvoiProjet,
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

/**
 * Cette fonction permet de re-définir la liste de travaux affichés sur tout le site.
 * @param {object} data
 * @return {object}
 */
export const redefineWorks = async () => {
  works = await updataLStorageWorks(works);
  afficherTravaux(works);
  modaleAfficherGallerie(works);
  modaleSuppressionProjet(userData.token);
  return works;
};

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

  // Possibilité de se déconnecter
  logOut(userData);

  // --- Modale ---

  // Ouverture de la modale
  modaleOuvrir();

  // Affichage des travaux dans le menu de suppression de projet
  modaleAfficherGallerie(works);

  // Ajout des eventListeners pour fermer la modale
  document.querySelector(".popup-background").addEventListener("click", (e) => {
    if (
      e.target === document.querySelector("#popup .modal-close-btn") ||
      e.target === document.querySelector(".popup-background")
    ) {
      modaleFermer();
    }
  });

  // Suppression de projet
  modaleSuppressionProjet(userData.token);

  // Ajout des catégories dans la modale d'ajout de projet
  modaleGenererCategs(categories);

  // Ajout des event listeners pour ouvrir et fermer la section d'ajout de projet
  modaleSwitchSection();

  // Ajout de la preview de l'image dans la modale
  const fileImgInput = document.getElementById("file-picture");
  fileImgInput.addEventListener("change", () => {
    modalePreviewImage();
  });

  // --- Fonctionnement du formulaire ---

  // Vérification qu'il n'y a pas de champ vide dans le formulaire

  const inputImg = document.getElementById("file-picture");
  const inputTitle = document.getElementById("file-title");
  const inputCateg = document.getElementById("file-category");
  const inputFields = [inputImg, inputTitle, inputCateg];
  inputFields.forEach((field) => {
    field.addEventListener("change", () => {
      modaleVerifChamps(inputImg.files[0], inputTitle.value, inputCateg.value);
    });
  });

  const popupSubmit = document.querySelector(
    '.popup-form input[type="submit"]'
  );
  popupSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    const workImg = inputImg.files[0];
    const workName = inputTitle.value;
    const wantedCateg = inputCateg.value;

    if (modaleVerifChamps(workImg, workName, wantedCateg)) {
      const workCateg = categories.find(
        (categ) => categ.name === wantedCateg
      ).id;
      await modaleEnvoiProjet(workImg, workName, workCateg, userData.token);
      redefineWorks();
      modaleFermer();
      modaleConfirmEdition("ajout");
    }
  });
}
