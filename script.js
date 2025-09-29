const tresorBtn = document.getElementById("tresorBtn");
const video = document.getElementById("Video1");
const pageContent = document.getElementById("pageContent");
const loader = document.getElementById("loader");

// Étape 1 : clic sur le bouton trésor → afficher la vidéo en pause
tresorBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Si déjà joué une fois → aller direct à menu
  if (localStorage.getItem("videoPlayed")) {
    window.location.href = "menu.html";
    return;
  }

  // cacher le contenu
  pageContent.style.display = "none";

  // afficher la vidéo (attente du clic utilisateur)
  video.style.display = "block";
});

// Étape 2 : clic sur la vidéo → afficher loader puis lancer la lecture
video.addEventListener("click", () => {
  // afficher le loader
  loader.style.display = "flex";

  // empêcher toute interaction ensuite
  video.style.pointerEvents = "none";

  // petit délai pour que le loader s’affiche
  setTimeout(() => {
    loader.style.display = "none";
    video.play().catch(err => {
      console.error("Erreur de lecture vidéo:", err);
      window.location.href = "menu.html";
    });
  }, 800);
  
  // marquer comme déjà joué
  localStorage.setItem("videoPlayed", "true");
});

// Étape 3 : quand la vidéo se termine → redirection
video.addEventListener("ended", () => {
  window.location.href = "menu.html";
});
