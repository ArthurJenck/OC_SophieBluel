import { redefineWorks } from "./main.js";

export /**
 * Cette fonction ouvre la modale d'édition.
 */
const modaleOuvrir = () => {
  const popupBackground = document.querySelector(".popup-background");
  const editBtn = document.querySelector("#portfolio-title button");
  editBtn.addEventListener("click", () => {
    popupBackground.classList.add("active");
  });
};

export /**
 * Cette fonction prend un tableau en paramètre et s'en sert pour créer la galerie sur la modale d'édition.
 * @param {array} worksList
 */
const modaleAfficherGallerie = (worksList) => {
  const popupGallery = document.querySelector(".popup-gallery");
  popupGallery.innerHTML = "";
  if (typeof worksList != "array") {
    worksList = Array.from(worksList);
  }
  worksList.forEach((work) => {
    const galleryItem = document.createElement("figure");
    galleryItem.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
    <button data-work-id="${work.id}" class="remove-item-btn"></button>`;
    popupGallery.appendChild(galleryItem);
  });
};

export /**
 * Cette fonction permet de modifier toutes les propriétés nécessaires à la fermeture de la modale.
 */
const modaleFermer = () => {
  document.querySelector(".popup-background").classList.remove("active");
  document.getElementById("popup-section-add").style.left = "250%";
  document.getElementById("popup-section-remove").style.right = "16%";
};

export /**
 * Cette fonction prend le type de modification effectuée en paramètre et crée le popup de confirmation.
 * @param {string} editType
 * @return {object}
 */
const modaleConfirmEdition = (editType) => {
  const confirmMsg = document.createElement("p");
  confirmMsg.classList.add("edit-confirm");
  if (editType === "ajout") {
    confirmMsg.innerText = "Projet ajouté";
    confirmMsg.style.backgroundColor = "#1D6154";
  } else if (editType === "suppr") {
    confirmMsg.innerText = "Projet supprimé";
    confirmMsg.style.backgroundColor = "#ce3939";
  } else {
    return false;
  }
  document.body.appendChild(confirmMsg);
  setTimeout(() => {
    confirmMsg.remove();
  }, 4000);
  return confirmMsg;
};

export /**
 * Cette fonction prend le jeton d'authentification en paramètre et s'en sert pour créer les event listeners afin de supprimer des projets du portfolio.
 * @param {string} token
 */
const modaleSuppressionProjet = (token) => {
  const removeButtons = document.querySelectorAll(".remove-item-btn");
  for (let i = 0; i < removeButtons.length; i++) {
    const button = removeButtons[i];
    button.index = i + 1;
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const itemId = button.getAttribute("data-work-id");
      await fetch(`http://localhost:5678/api/works/${itemId}`, {
        method: "DELETE",
        headers: {
          Accept: "/",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      redefineWorks();
      modaleConfirmEdition("suppr");
    });
  }
};

export /**
 * Cette fonction prend un tableau en paramètre et s'en sert pour ajouter les catégories dans l'ajout de projet dans la modale.
 * @param {array} categList
 * @return {object}
 */
const modaleGenererCategs = (categList) => {
  const categorySelector = document.getElementById("file-category");
  categList.forEach((category) => {
    const categoryOption = document.createElement("option");
    categoryOption.setAttribute("value", category.name);
    categoryOption.innerText = category.name;
    categorySelector.appendChild(categoryOption);
  });
  return categorySelector;
};

export /**
 * Cette fonction permet de passer d'une section de la modale à l'autre à l'aide des boutons internes.
 */
const modaleSwitchSection = () => {
  const addItemBtn = document.querySelector(".add-item-btn");
  const returnBtn = document.querySelector(".modal-return-btn");
  const addSectionContainer = document.getElementById("popup-section-add");
  const rmvSectionContainer = document.getElementById("popup-section-remove");
  addItemBtn.addEventListener("click", () => {
    addSectionContainer.style.left = "50%";
    rmvSectionContainer.style.right = "150%";
  });
  returnBtn.addEventListener("click", () => {
    addSectionContainer.style.left = "150%";
    rmvSectionContainer.style.right = "16%";
  });
};

// --- Formulaire d'ajout de projet ---

export /**
 * Cette fonction permet d'afficher un aperçu de l'image sélectionnée par l'utilisateur pour le nouveau projet.
 */
const modalePreviewImage = () => {
  const fileImgPreview = document.querySelector(
    'label[for="file-picture"] img'
  );
  const addImgBtn = document.querySelector(".form-picture-btn");
  const imgInfoText = document.querySelector('label[for="file-picture"] p');
  const fileImg = document.getElementById("file-picture").files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    fileImgPreview.src = reader.result;
    fileImgPreview.style.height = "100%";
    fileImgPreview.style.width = "auto";
    fileImgPreview.style.marginTop = "0";
    addImgBtn.remove();
    imgInfoText.remove();
  });

  if (fileImg) {
    reader.readAsDataURL(fileImg);
  }
};

export /**
 * Cette fonction prend trois paramètres, les inputfields des données souhaitées par l'utilisateur pour son nouveau projet, et renvoie un booléen selon si une donnée est vide ou non.
 * @param {object} img
 * @param {string} name
 * @param {string} categ
 * @return {boolean}
 */
const modaleVerifChamps = (img, name, categ) => {
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
    errorMessage.style.top = "16.1rem";
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

export /**
 * Cette fonction prend en paramètres les données du nouveau projet entrées par l'utilisateur ainsi que le jeton d'authentification et s'en sert pour envoyer le projet sur l'API.
 * @param {object} picture
 * @param {string} name
 * @param {string} category
 * @param {string} token
 * @return {boolean}
 */
const modaleEnvoiProjet = async (picture, name, category, token) => {
  const fetchBody = new FormData();
  fetchBody.append("image", picture);
  fetchBody.append("title", name);
  fetchBody.append("category", category);

  const response = await fetch("http://localhost:5678/api/works", {
    body: fetchBody,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
  });
  if (response.status === 201) {
    return true;
  } else {
    throw new Error("Utilisateur non trouvé.");
  }
};
