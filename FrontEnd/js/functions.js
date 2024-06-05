export /**
 * Cette fonction prend un objet en paramètre et met à jour cet objet dans le localStorage depuis l'API.
 * @param {object} data
 * @return {object}
 */
const updataLStorageWorks = async (data) => {
  data = await fetch("http://localhost:5678/api/works").then((response) =>
    response.json()
  );
  const arrayFrom = JSON.stringify(data);
  window.localStorage.setItem("works", arrayFrom);
  return data;
};

export /**
 * Cette fonction prend un objet en paramètre et met à jour cet objet dans le localStorage depuis l'API.
 * @param {object} data
 * @return {object}
 */
const updataLStorageCategs = async (data) => {
  data = await fetch("http://localhost:5678/api/categories").then((response) =>
    response.json()
  );
  const arrayFrom = JSON.stringify(data);
  window.localStorage.setItem("categories", arrayFrom);
  return data;
};

export /**
 * Cette fonction prend un tableau en paramètre et affiche tous les éléments de ce tableau dans la galerie du site.
 * @param {array} worksList
 * @return {object}
 */
const afficherTravaux = (worksList) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  if (typeof worksList != "array") {
    worksList = Array.from(worksList);
  }
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

export /**
 * Cette fonction prend un tableau en paramètre et génère des boutons de filtre pour chaque entrée de ce tableau.
 * @param {array} categList
 * @return {object}
 */
const genererFiltres = (categList) => {
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

export /**
 * Cette fonction prend la liste de travaux originale en paramètre et génère les eventListeners nécessaires au fonctionnement des filtres.
 * @param {object} ogList
 * @return {object}
 */
const fonctionnementFiltres = (ogList) => {
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

export /**
 * Cette fonction prend le jeton d'authentification en paramètre et déconnecte l'utilisateur, le sortant du mode édition.
 * @param {object} ogList
 * @return {object}
 */
const logOut = (token) => {
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

// --- Login page ---

export /**
 * Cette fonction prend un type d'erreur en paramètre et crée la balise correspondante en DOM
 * @param {string} error
 * @return {object}
 */
const domCreerErreur = (errorType) => {
  // Affichage du message d'erreur pour l'utilisateur
  const errorMessage = document.createElement("p");
  errorMessage.id = `error-${errorType}`;
  errorMessage.style.position = "absolute";
  // Modifications selon le type d'erreur
  if (errorType === "mail") {
    errorMessage.style.top = `calc(110rem/16)`;
    errorMessage.innerText = "Veuillez entrer une adresse-mail valide.";
    document.getElementById("mail").after(errorMessage);
    throw new Error("Veuillez entrer une adresse-mail valide.");
  } else if (errorType === "password") {
    errorMessage.style.top = `calc(214rem/16)`;
    errorMessage.innerText =
      "Votre mot de passe doit comporter au moins une majuscule et un chiffre.";
    document.getElementById("password").after(errorMessage);
    throw new Error(
      "Votre mot de passe doit comporter au moins une majuscule et un chiffre."
    );
  } else {
    errorMessage.style.top = `calc(214rem/16)`;
    errorMessage.innerText = "Adresse-mail ou mot de passe incorrect.";
    document.getElementById("password").after(errorMessage);
    throw new Error("Adresse-mail ou mot de passe incorrect.");
  }
};

export /**
 * Cette fonction prend une donnee ainsi que son type (adresse-mail ou mot de passe) en paramètre et valide qu'il est au bon format.
 * @param {string} donnee
 * @return {boolean}
 */
const validerDonnees = (donnee, typeDonnee) => {
  typeDonnee = typeDonnee.toLowerCase();

  // Suppression d'un éventuel ancien message d'erreur lié à la donnée
  const messageErreur = document.getElementById(`error-${typeDonnee}`);
  if (messageErreur != null) {
    messageErreur.remove();
  }

  // Création des RegExp
  const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  const minLength = new RegExp("[a-zA-Z0-9]{2,}");
  const oneDigit = new RegExp("[0-9]");
  const oneUpper = new RegExp("[A-Z]");

  // Vérification des données avec les RegExp
  if (typeDonnee === "mail" && emailRegExp.test(donnee)) {
    return true;
  } else if (typeDonnee === "mail") {
    domCreerErreur("mail");
  }
  if (
    typeDonnee === "password" &&
    minLength.test(donnee) &&
    oneDigit.test(donnee) &&
    oneUpper.test(donnee)
  ) {
    return true;
  } else if (typeDonnee === "password") {
    domCreerErreur("password");
  }
};

export /**
 * Cette fonction prend un mail et un mot de passe en paramètres et retourne un nombre.
 * @param {string} mail
 * @param {string} password
 * @return {number}
 */
const envoyerIds = async (mail, password) => {
  // Création de l'objet des identifiants à envoyer
  const ids = {
    email: mail,
    password: password,
  };
  // Création de la charge utile en JSON
  const chargeUtile = JSON.stringify(ids);
  // Appel de la fonction fetch avec toutes les informations nécessaires
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile,
  });
  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else if (response.status === 401) {
    throw new Error("Adresse e-mail ou mot de passe incorrect.");
  } else {
    throw new Error("Utilisateur non trouvé.");
  }
};
