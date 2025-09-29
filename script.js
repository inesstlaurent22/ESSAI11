const tresorBtn = document.getElementById("tresorBtn");
const video = document.getElementById("Video1");
const pageContent = document.getElementById("pageContent");

// Étape 1 : clic sur le bouton trésor → afficher la vidéo (attente d'un clic utilisateur)
tresorBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Si déjà joué une fois → aller direct à menu
  if (localStorage.getItem("videoPlayed")) {
    window.location.href = "menu.html";
    return;
  }

  // cacher le contenu de la page
  pageContent.style.display = "none";

  // afficher la vidéo en attente (écran noir)
  video.style.display = "block";
});

// Étape 3 : quand la vidéo se termine → redirection
video.addEventListener("ended", () => {
  window.location.href = "menu.html";
});
