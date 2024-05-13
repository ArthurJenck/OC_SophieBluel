/**
 * Cette fonction prend un email en paramètre et valide qu'il est au bon format.
 * @param {string} email
 * @return {boolean}
 */
const validerEmail = (email) => {
  // Vérification que l'élément n'existe pas encore
  const messageErreur = document.getElementById("error-mail");
  if (messageErreur != null) {
    messageErreur.remove();
  }
  const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (emailRegExp.test(email)) {
    return true;
  }
  domCreerErreur("mail");
};

/**
 * Cette fonction prend un type d'erreur en paramètre et crée la balise correspondante en DOM
 * @param {string} error
 * @return {node}
 */
const domCreerErreur = (errorType) => {
  // Affichage du message d'erreur pour l'utilisateur
  if (errorType === "mail") {
    const errorMail = document.createElement("p");
    errorMail.innerText = "Veuillez entrer une adresse-mail valide.";
    errorMail.id = `error-${errorType}`;
    errorMail.style.position = "absolute";
    errorMail.style.top = `calc(110rem/16)`;
    document.getElementById("mail").after(errorMail);
    throw new Error("Veuillez entrer une adresse-mail valide.");
  } else {
    const errorMdp = document.createElement("p");
    errorMdp.innerText =
      "Votre mot de passe doit comporter au moins une majuscule et un chiffre.";
    errorMdp.id = "error-mdp";
    errorMdp.style.position = "absolute";
    errorMdp.style.top = `calc(214rem/16)`;
    document.getElementById("password").after(errorMdp);
    throw new Error(
      "Votre mot de passe doit comporter au moins une majuscule et un chiffre."
    );
  }
};

/**
 * Cette fonction prend un mot de passe en paramètre et valide qu'il est au bon format.
 * @param {string} password
 * @return {boolean}
 */
const validerMdp = (password) => {
  // Vérification que l'élément n'existe pas encore
  const messageErreur = document.getElementById("error-mdp");
  if (messageErreur != null) {
    messageErreur.remove();
  }

  const minLength = new RegExp("[a-zA-Z0-9]{2,}");
  const oneDigit = new RegExp("[0-9]");
  const oneUpper = new RegExp("[A-Z]");
  if (
    minLength.test(password) &&
    oneDigit.test(password) &&
    oneUpper.test(password)
  ) {
    return true;
  }
  domCreerErreur("mdp");
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
    return data.userId;
  } else if (response.status === 401) {
    throw new Error("Adresse e-mail ou mot de passe incorrect.");
  } else {
    throw new Error("Utilisateur non trouvé.");
  }
};

let userId = null;
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
    validerEmail(mail);
  } catch (err) {
    console.error("Erreur :", err.message);
    inputsValides = false;
  }

  try {
    validerMdp(password);
  } catch (err) {
    console.error("Erreur :", err.message);
    inputsValides = false;
  }

  // Si le mail et le mot de passe sont valides, on fait une demande de connexion
  if (inputsValides) {
    try {
      userId = await envoyerIds(mail, password);
      console.log(userId);
      document.location.href = "./index.html";
    } catch (err) {
      console.error(err.message);
    }
  }
});
