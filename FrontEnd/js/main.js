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

// Ajout des travaux dans le HTML à l'aide d'une fonction qu'on pourra appeler plusieurs fois plus tard
/**
 * Cette fonction prend un tableau en paramètre et affiche tous les éléments de ce tableau dans la galerie du site.
 * @param {array} email
 * @return {object}
 */
const gallery = document.querySelector(".gallery");
const afficherTravaux = (array) => {
  gallery.innerHTML = "";
  array.forEach((work) => {
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

if (userData != null) {
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
}

const popupGallery = document.querySelector(".popup-gallery");
/**
 * Cette fonction prend un tableau en paramètre et s'en sert pour créer la galerie sur la modale d'édition.
 * @param {array} array
 */
const galleryPopup = (array) => {
  array.forEach((work) => {
    const galleryItem = document.createElement("figure");
    galleryItem.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
  <button class="remove-item-btn item-${work.id}"></button>`;
    popupGallery.appendChild(galleryItem);
  });
};
galleryPopup(works);

const closeModalBtn = document.querySelector("#popup .close-modal-btn");
const popupBackground = document.querySelector(".popup-background");
const popup = document.getElementById("popup");
document.querySelector(".popup-background").addEventListener("click", (e) => {
  if (e.target === closeModalBtn || e.target === popupBackground) {
    popup.classList.remove("active");
    popupBackground.classList.remove("active");
  }
});

const editBtn = document.querySelector("#portfolio-title button");
editBtn.addEventListener("click", () => {
  popup.classList.add("active");
  popupBackground.classList.add("active");
});

const galleryItems = document.querySelectorAll(".popup-gallery figure");
const removeButtons = document.querySelectorAll(".remove-item-btn");
/**
 * Cette fonction sert à créer les event listeners afin de supprimer des projets du portfolio.
 */
console.log(works);
const applyRemoveBtns = () => {
  for (let i = 0; i < removeButtons.length; i++) {
    const button = removeButtons[i];
    button.index = i + 1;
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const itemId = button.classList[1].replace("item-", "");
      console.log(itemId);

      await fetch(`http://localhost:5678/api/works/${itemId}`, {
        method: "DELETE",
        headers: {
          Accept: "/",
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });
      works = await fetch("http://localhost:5678/api/works");
      works = await works.json();
      console.log(works);
      const arrayWorks = JSON.stringify(works);
      window.localStorage.setItem("works", arrayWorks);
      button.parentElement.remove();
    });
  }
};

applyRemoveBtns();
