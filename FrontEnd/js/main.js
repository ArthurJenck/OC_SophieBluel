// Récupération des travaux et catégories déjà stockés dans le localStorage
let works = window.localStorage.getItem("works");
let categories = window.localStorage.getItem("categories");
let userData = JSON.parse(window.localStorage.getItem("userData"));

// Si les données ne sont pas encore stockés, on les fetch et les stock
if (works === null) {
  works = await fetch("http://localhost:5678/api/works");
  works = await works.json();
  const arrayWorks = JSON.stringify(works);
  window.localStorage.setItem("works", arrayWorks);
} else {
  works = JSON.parse(works);
}

if (categories === null) {
  categories = await fetch("http://localhost:5678/api/categories");
  categories = await categories.json();
  const arrayCateg = JSON.stringify(categories);
  window.localStorage.setItem("categories", arrayCateg);
} else {
  categories = JSON.parse(categories);
}

// Génération des filtres
const filtersContainer = document.querySelector(".filters");
categories.forEach((categ) => {
  const categInput = document.createElement("input");
  const categLabel = document.createElement("label");
  const idName = categ.name.toLocaleLowerCase().replace(/ /g, "-");
  categInput.setAttribute("type", "radio");
  categInput.setAttribute("name", "filter");
  categInput.setAttribute("id", `${idName}`);
  categInput.setAttribute("value", `${categ.name}`);

  categLabel.setAttribute("for", `${idName}`);
  categLabel.innerText = categ.name;

  filtersContainer.appendChild(categInput);
  filtersContainer.appendChild(categLabel);
});

// Calcul des padding selon la largeur du bouton
const labels = document.querySelectorAll(".filters label");
labels.forEach((label) => {
  const labelWidth = label.offsetWidth;
  if (labelWidth < 100) {
    label.style.padding = `9px ${(100 - labelWidth) / 2}px`;
  } else if (labelWidth < 150) {
    label.style.padding = "9px 15px";
  } else {
    label.style.padding = "9px 10px";
  }
});

// Ajout des travaux dans le HTML à l'aide d'une fonction qu'on pourra appeler plusieurs fois plus tard
/**
 * Cette fonction prend un tableau en paramètre et affiche tous les éléments de ce tableau dans la galerie du site.
 * @param {array} email
 * @return {object}
 */
const gallery = document.querySelector(".gallery");
const afficherTravaux = (worksList) => {
  gallery.innerHTML = "";
  worksList.forEach((work) => {
    const figureTag = document.createElement("figure");
    const imageTag = document.createElement("img");
    const figcaptionTag = document.createElement("figcaption");

    imageTag.setAttribute("src", work.imageUrl);
    imageTag.setAttribute("alt", work.title);
    figureTag.appendChild(imageTag);

    figcaptionTag.innerText = work.title;
    figureTag.appendChild(figcaptionTag);
    gallery.appendChild(figureTag);
  });
  return gallery;
};

afficherTravaux(works);

// Ajout des event listener sur les filtres
const filterInputs = document.querySelectorAll(".filters input");
filterInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    let sortedWorks = works.filter(
      (work) => work.category.name === e.target.value
    );
    if (e.target.id === "tous") {
      sortedWorks = works;
    }
    afficherTravaux(sortedWorks);
  });
});

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
  const editBtn = document.querySelector("#portfolio-title button");
  editBtn.addEventListener("click", () => {
    popup.classList.add("active");
    popupBackground.classList.add("active");
  });

  // Possibilité de se déconnecter
  const navLnks = document.querySelectorAll("nav li");
  const logLnk = Array.from(navLnks).find((link) => link.innerText === "login");
  logLnk.innerHTML = "<a href='#'>logout</a>";

  logLnk.addEventListener("click", () => {
    userData = undefined;
    localStorage.removeItem("userData");
    location.reload();
  });
}

const popupGallery = document.querySelector(".popup-gallery");
/**
 * Cette fonction prend un tableau en paramètre et s'en sert pour créer la galerie sur la modale d'édition.
 * @param {array} array
 */
const galleryPopup = (array) => {
  popupGallery.innerHTML = "";
  array.forEach((work) => {
    const galleryItem = document.createElement("figure");
    galleryItem.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
  <button data-work-id="${work.id}" class="remove-item-btn"></button>`;
    popupGallery.appendChild(galleryItem);
  });
};
galleryPopup(works);

const closeModalBtn = document.querySelector("#popup .modal-close-btn");
const popupBackground = document.querySelector(".popup-background");
document.querySelector(".popup-background").addEventListener("click", (e) => {
  if (e.target === closeModalBtn || e.target === popupBackground) {
    popupBackground.classList.remove("active");
    addSectionContainer.style.left = "250%";
  }
});

const redefineWorks = async () => {
  works = await fetch("http://localhost:5678/api/works");
  works = await works.json();
  works = JSON.stringify(works);
  window.localStorage.setItem("works", works);
  works = JSON.parse(works);
  afficherTravaux(works);
  galleryPopup(works);
  applyRemoveBtns();
};

/**
 * Cette fonction sert à créer les event listeners afin de supprimer des projets du portfolio.
 */
const applyRemoveBtns = () => {
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
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });
      redefineWorks();
    });
  }
};

applyRemoveBtns();

// Ajout des catégories dans la modale d'ajout de projet
const categorySelector = document.getElementById("file-category");
categories.forEach((category) => {
  const categoryOption = document.createElement("option");
  categoryOption.setAttribute("value", category.name);
  categoryOption.innerText = category.name;
  categorySelector.appendChild(categoryOption);
});

// Ajout des event listeners pour ouvrir et fermer la section d'ajout de projet
const addItemBtn = document.querySelector(".add-item-btn");
const returnBtn = document.querySelector(".modal-return-btn");
const addSectionContainer = document.getElementById("popup-section-add");
addItemBtn.addEventListener("click", () => {
  addSectionContainer.style.left = "50%";
});
returnBtn.addEventListener("click", () => {
  addSectionContainer.style.left = "250%";
});

// Formulaire d'ajout de projet

// Ajout de la preview de l'image dans la modale
const imagePreview = () => {
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

const fileImgInput = document.getElementById("file-picture");
fileImgInput.addEventListener("change", () => {
  imagePreview();
});

// Fonctionnement du formulaire

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
    errorMessage.style.top = "15.7rem";
    formContainer.appendChild(errorMessage);
  } else if (!categ) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("popup-error");
    errorMessage.innerText = "Veuillez ajouter la catégorie du projet.";
    errorMessage.style.top = "21.4rem";
    formContainer.appendChild(errorMessage);
  } else {
    return true;
  }
};

const addWork = async () => {
  const workImg = document.getElementById("file-picture").files[0];
  const workName = document.getElementById("file-title").value;
  const wantedCateg = document.getElementById("file-category").value;
  const workCateg = categories.find((categ) => categ.name === wantedCateg).id;
  console.log(workCateg);
  if (checkRequired(workImg, workName, workCateg)) {
    const fetchBody = new FormData();
    fetchBody.append("image", workImg);
    fetchBody.append("title", workName);
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
  }
};

const popupSubmit = document.querySelector('.popup-form input[type="submit"]');
popupSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  addWork();
});
