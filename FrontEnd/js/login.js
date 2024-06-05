import { domCreerErreur, envoyerIds, validerDonnees } from "./functions.js";

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
