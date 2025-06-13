let items = JSON.parse(localStorage.getItem('abuelita_items') || '[]');

function renderItems() {
  const section = document.getElementById('playlistSection');
  section.innerHTML = '';
  items.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = 'playlist-btn';
    btn.textContent = item.nombre;
    btn.onclick = () => playSpotify(item.link);
    section.appendChild(btn);
  });
}

function agregarItem() {
  const nombre = document.getElementById('nombre').value.trim();
  const link = document.getElementById('link').value.trim();
  if (!nombre || !link) {
    alert('Por favor, completa ambos campos');
    return;
  }
  items.push({ nombre, link });
  localStorage.setItem('abuelita_items', JSON.stringify(items));
  renderItems();
  document.getElementById('nombre').value = '';
  document.getElementById('link').value = '';
}

function playSpotify(link) {
  // Soporta links de playlist, album o canción
  let embedUrl = '';
  if (link.includes('playlist')) {
    const id = link.split('playlist/')[1].split('?')[0];
    embedUrl = `https://open.spotify.com/embed/playlist/${id}`;
  } else if (link.includes('track')) {
    const id = link.split('track/')[1].split('?')[0];
    embedUrl = `https://open.spotify.com/embed/track/${id}`;
  } else if (link.includes('album')) {
    const id = link.split('album/')[1].split('?')[0];
    embedUrl = `https://open.spotify.com/embed/album/${id}`;
  } else {
    alert('Link de Spotify no reconocido');
    return;
  }
  document.getElementById('spotifyPlayer').src = embedUrl;
}

window.onload = renderItems;
