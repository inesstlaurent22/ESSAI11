// Sélectionne le bouton Trésor
const tresorButton = document.querySelector('.tresor-button a');
const Video1 = document.getElementById('Video1');

// Vérifie que les éléments existent
if (tresorButton && Video1) {
  tresorButton.addEventListener('click', function(event) {
    event.preventDefault(); // Empêche la redirection immédiate vers creation.html
    tresorButton.style.display = 'none'; // Cache le bouton
    Video1.style.display = 'block'; // Affiche la vidéo
    Video1.play(); // Lance la lecture

    // Tentative plein écran
    if (Video1.requestFullscreen) {
      Video1.requestFullscreen();
    } else if (Video1.webkitRequestFullscreen) { // Safari
      Video1.webkitRequestFullscreen();
    } else if (Video1.msRequestFullscreen) { // IE/Edge
      Video1.msRequestFullscreen();
    }
  });

  // Quand la vidéo se termine → redirection
  Video1.addEventListener('ended', function() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    window.location.href = 'creation.html';
  });

  // Gestion sortie du plein écran avant la fin
  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
      if (!Video1.ended) {
        Video1.pause();
        tresorButton.style.display = 'block'; // Réaffiche le bouton
        Video1.style.display = 'none'; // Cache la vidéo
      }
    }
  });
} else {
  console.error('Éléments manquants : bouton trésor ou vidéo');
}
