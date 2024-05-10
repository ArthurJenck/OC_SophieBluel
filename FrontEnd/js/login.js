let users = await fetch("http://localhost:5678/api/users/login");

/**
 * Cette fonction prend un email en paramètre et valide qu'il est au bon format.
 * @param {string} email
 * @return {boolean}
 */
const validerEmail = (email) => {
  let errorMail = document.getElementById("error-mail");
  if (errorMail != null) {
    errorMail.remove();
  }
  const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (emailRegExp.test(email)) {
    return true;
  }
  errorMail = document.createElement("p");
  errorMail.innerText = "Veuillez entrer une adresse-mail valide.";
  errorMail.classList.add("error");
  errorMail.id = "error-mail";
  document.getElementById("mail").after(errorMail);
  return false;
};

/**
 * Cette fonction prend un mot de passe en paramètre et valide qu'il est au bon format.
 * @param {string} password
 * @return {boolean}
 */
const validerMdp = (password) => {
  let errorMdp = document.getElementById("error-mdp");
  if (errorMdp != null) {
    errorMdp.remove();
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
  errorMdp = document.createElement("p");
  errorMdp.innerText =
    "Votre mot de passe doit comporter au moins une majuscule et un chiffre.";
  errorMdp.classList.add("error");
  errorMdp.id = "error-mdp";
  document.getElementById("password").after(errorMdp);
  console.log("oui");
  return false;
};

// Ajout du submit sur le bouton de connexion
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputMail = document.getElementById("mail");
  const mail = inputMail.value;

  const inputPassword = document.getElementById("password");
  const password = inputPassword.value;

  if (validerEmail(mail) && validerMdp(password)) {
    window.location.replace("./index.html");
  } else {
    throw new Error(
      "Veuillez entrer une adresse-mail et un mot de passe valides."
    );
  }
});

console.log(users);
