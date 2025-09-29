const tresorBtn = document.getElementById("tresorBtn");
const video = document.getElementById("Video1");
const pageContent = document.getElementById("pageContent");
const loader = document.getElementById("loader");

tresorBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Si déjà joué une fois → aller direct à menu
  if (localStorage.getItem("videoPlayed")) {
    window.location.href = "menu.html";
    return;
  }

  // cacher le contenu
  pageContent.style.display = "none";

  // afficher le loader
  loader.style.display = "flex";

  // afficher la vidéo
  video.style.display = "block";

  // lancer la vidéo directement
  video.play().then(() => {
    loader.style.display = "none"; // enlever loader quand la vidéo démarre
  }).catch(err => {
    console.error("Erreur de lecture vidéo:", err);
    window.location.href = "menu.html";
  });

  // marquer comme déjà joué
  localStorage.setItem("videoPlayed", "true");
});

// quand la vidéo se termine → redirection
video.addEventListener("ended", () => {
  window.location.href = "menu.html";
});
