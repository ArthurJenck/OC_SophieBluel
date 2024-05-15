/**
 * Cette fonction prend un type d'erreur en paramètre et crée la balise correspondante en DOM
 * @param {string} error
 * @return {node}
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

/**
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

/**
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
    // console.log(data);
    return data;
  } else if (response.status === 401) {
    throw new Error("Adresse e-mail ou mot de passe incorrect.");
  } else {
    throw new Error("Utilisateur non trouvé.");
  }
};

let userData = {};
// Ajout du submit sur le bouton de connexion
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputMail = document.getElementById("mail");
  const mail = inputMail.value;

  const inputPassword = document.getElementById("password");
  const password = inputPassword.value;

  // On vérifie la validité du mail et du mot de passe
  let inputsValides = true;
  try {
    validerDonnees(mail, "mail");
  } catch (err) {
    console.error("Erreur :", err.message);
    inputsValides = false;
  }

  try {
    validerDonnees(password, "password");
  } catch (err) {
    console.error("Erreur :", err.message);
    inputsValides = false;
  }

  // Si le mail et le mot de passe sont valides, on fait une demande de connexion
  if (inputsValides) {
    try {
      userData = await envoyerIds(mail, password);
      window.localStorage.setItem("userData", JSON.stringify(userData));
      document.location.href = "./index.html";
    } catch (err) {
      const messageErreur = document.getElementById("error-connexion");
      if (messageErreur != null) {
        messageErreur.remove();
      }
      domCreerErreur("connexion");
    }
  }
});
