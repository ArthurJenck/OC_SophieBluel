/**
 * Cette fonction prend un tableau en paramètre et s'en sert pour créer la galerie sur la modale d'édition.
 * @param {array} worksArray
 */
export const modaleAfficherGallerie = (worksArray) => {
  const popupGallery = document.querySelector(".popup-gallery");
  popupGallery.innerHTML = "";
  worksArray.forEach((work) => {
    const galleryItem = document.createElement("figure");
    galleryItem.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
    <button data-work-id="${work.id}" class="remove-item-btn"></button>`;
    popupGallery.appendChild(galleryItem);
  });
};

/**
 * Cette fonction ajoute les eventListeners nécessaires pour fermer la modale.
 */
export const fermerModale = () => {
  const closeModalBtn = document.querySelector("#popup .modal-close-btn");
  const popupBackground = document.querySelector(".popup-background");
  const addSectionContainer = document.getElementById("popup-section-add");
  const rmvSectionContainer = document.getElementById("popup-section-remove");
  document.querySelector(".popup-background").addEventListener("click", (e) => {
    if (e.target === closeModalBtn || e.target === popupBackground) {
      popupBackground.classList.remove("active");
      addSectionContainer.style.left = "250%";
      rmvSectionContainer.style.right = "16%";
    }
  });
};

/**
 * Cette fonction sert à créer les event listeners afin de supprimer des projets du portfolio.
 */
export const modaleSuppressionProjet = () => {
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
      const confirmMsg = document.createElement("p");
      confirmMsg.classList.add("edit-confirm");
      confirmMsg.innerText = "Projet supprimé";
      confirmMsg.style.backgroundColor = "#ce3939";
      document.body.appendChild(confirmMsg);
      setTimeout(() => {
        confirmMsg.remove();
      }, 4000);
    });
  }
};

/**
 * Cette fonction prend un tableau en paramètre et s'en sert pour ajouter les catégories dans l'ajout de projet dans la modale.
 * @param {array} categList
 * @return {object}
 */
export const modaleGenererCategs = (categList) => {
  const categorySelector = document.getElementById("file-category");
  categList.forEach((category) => {
    const categoryOption = document.createElement("option");
    categoryOption.setAttribute("value", category.name);
    categoryOption.innerText = category.name;
    categorySelector.appendChild(categoryOption);
  });
  return categorySelector;
};

/**
 * Cette fonction permet de passer d'une section de la modale à l'autre à l'aide des boutons internes.
 */
export const modaleSwitchSection = () => {
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

/**
 * Cette fonction permet d'afficher un aperçu de l'image sélectionnée par l'utilisateur pour le nouveau projet.
 */
export const modalePreviewImage = () => {
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
