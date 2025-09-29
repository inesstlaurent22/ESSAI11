const tresorBtn = document.getElementById("tresorBtn");
const video = document.getElementById("Video1");
const pageContent = document.getElementById("pageContent");
const loader = document.getElementById("loader");

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

// Étape 2 : clic sur la vidéo → loader puis lecture
video.addEventListener("click", () => {
  // afficher le loader
  loader.style.display = "flex";

  // empêcher tout autre clic
  video.style.pointerEvents = "none";

  // petit délai pour afficher le loader avant la lecture
  setTimeout(() => {
    loader.style.display = "none"; // enlever le loader
    video.play().catch(err => {
      console.error("Erreur de lecture vidéo:", err);
      window.location.href = "menu.html";
    });
  }, 1000); // délai ajustable (1s ici)
  
  // marquer comme déjà joué
  localStorage.setItem("videoPlayed", "true");
});

// Étape 3 : quand la vidéo se termine → redirection
video.addEventListener("ended", () => {
  window.location.href = "menu.html";
});
