// Script corrigé pour correspondre au HTML fourni
const creationButton = document.querySelector('.creation2-button a');
const Video1 = document.getElementById('Video1');

// Vérification que les éléments existent avant d'ajouter les événements
if (creationButton && Video1) {
  creationButton.addEventListener('click', function(event) {
    event.preventDefault(); // Empêche la redirection par défaut du lien
    creationButton.style.display = 'none'; // Cache le bouton
    Video1.style.display = 'block'; // Affiche la vidéo
    Video1.play(); // Lance la lecture de la vidéo
    
    // Tenter de passer en plein écran
    if (Video1.requestFullscreen) {
      Video1.requestFullscreen();
    } else if (Video1.webkitRequestFullscreen) { // Safari
      Video1.webkitRequestFullscreen();
    } else if (Video1.msRequestFullscreen) { // IE/Edge
      Video1.msRequestFullscreen();
    }
  });

  Video1.addEventListener('ended', function() {
    // Sortir du plein écran si nécessaire
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    // Redirection vers creation.html au lieu de menu.html puisque nous sommes déjà sur menu
    window.location.href = 'creation.html';
  });

  // Gérer la sortie du plein écran avec Escape
  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
      // Si on sort du plein écran avant la fin de la vidéo
      if (!Video1.ended) {
        Video1.pause();
        creationButton.style.display = 'block'; // Réafficher le bouton
        Video1.style.display = 'none'; // Cacher la vidéo
      }
    }
  });
} else {
  console.error('Éléments manquants : bouton création ou vidéo');
  if (!creationButton) console.error('Bouton .creation2-button a non trouvé');
  if (!Video1) console.error('Vidéo #Video1 non trouvée');
}
