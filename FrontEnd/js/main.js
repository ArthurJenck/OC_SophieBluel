// Récupération des travaux et catégories déjà stockés dans le localStorage
let works = window.localStorage.getItem("SBworks");
let categories = window.localStorage.getItem("SBcategories");

// Si les données ne sont pas encore stockés, on les fetch et les stock
if (works === null) {
  works = await fetch("http://localhost:5678/api/works");
  works = await works.json();
  const arrayWorks = JSON.stringify(works);
  // L'ajout de SB devant les noms des identifiants permet d'éviter que d'autres sites ne remplacent les données stockées
  window.localStorage.setItem("SBworks", arrayWorks);
} else {
  works = JSON.parse(works);
}

if (categories === null) {
  categories = await fetch("http://localhost:5678/api/categories");
  categories = await categories.json();
  const arrayCateg = JSON.stringify(categories);
  window.localStorage.setItem("SBcategories", arrayCateg);
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

