/**
 * Cette fonction prend un objet en paramètre et met à jour cet objet dans le localStorage depuis l'API.
 * @param {object} data
 * @return {object}
 */
export const updataLStorageWorks = async (data) => {
  data = await fetch("http://localhost:5678/api/works").then((response) =>
    response.json()
  );
  const arrayFrom = JSON.stringify(data);
  window.localStorage.setItem("works", arrayFrom);
  return data;
};

/**
 * Cette fonction prend un objet en paramètre et met à jour cet objet dans le localStorage depuis l'API.
 * @param {object} data
 * @return {object}
 */
export const updataLStorageCategs = async (data) => {
  data = await fetch("http://localhost:5678/api/categories").then((response) =>
    response.json()
  );
  const arrayFrom = JSON.stringify(data);
  window.localStorage.setItem("categories", arrayFrom);
  return data;
};

/**
 * Cette fonction prend un tableau en paramètre et affiche tous les éléments de ce tableau dans la galerie du site.
 * @param {array} worksList
 * @return {object}
 */
export const afficherTravaux = (worksList) => {
  const gallery = document.querySelector(".gallery");
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

/**
 * Cette fonction ouvre la modale d'édition.
 */
export const ouvrirModale = () => {
  const popupBackground = document.querySelector(".popup-background");
  const editBtn = document.querySelector("#portfolio-title button");
  editBtn.addEventListener("click", () => {
    popupBackground.classList.add("active");
  });
};

/**
 * Cette fonction prend un tableau en paramètre et génère des boutons de filtre pour chaque entrée de ce tableau.
 * @param {array} categList
 * @return {object}
 */
export const genererFiltres = (categList) => {
  const filtersContainer = document.querySelector(".filters");
  categList.forEach((categ) => {
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

    // Calcul des padding selon la largeur du bouton
    const labelWidth = categLabel.offsetWidth;
    if (labelWidth < 100) {
      categLabel.style.padding = `9px ${(100 - labelWidth) / 2}px`;
    } else if (labelWidth < 150) {
      categLabel.style.padding = "9px 15px";
    } else {
      categLabel.style.padding = "9px 10px";
    }
  });
  return filtersContainer;
};

/**
 * Cette fonction prend la liste de travaux originale en paramètre et génère les eventListeners nécessaires au fonctionnement des filtres.
 * @param {object} ogList
 * @return {object}
 */
export const fonctionnementFiltres = (ogList) => {
  const filterInputs = document.querySelectorAll(".filters input");
  filterInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      let sortedWorks = ogList.filter(
        (work) => work.category.name === e.target.value
      );
      if (e.target.id === "tous") {
        sortedWorks = ogList;
      }
      afficherTravaux(sortedWorks);
    });
  });
  return filterInputs;
};

/**
 * Cette fonction prend le jeton d'authentification en paramètre et déconnecte l'utilisateur, le sortant du mode édition.
 * @param {object} ogList
 * @return {object}
 */
export const logOut = (token) => {
  const navLnks = document.querySelectorAll("nav li");
  const logLnk = Array.from(navLnks).find((link) => link.innerText === "login");
  logLnk.innerHTML = "<a href='#'>logout</a>";

  logLnk.addEventListener("click", () => {
    token = undefined;
    localStorage.removeItem("userData");
    location.reload();
  });

  return token;
};
