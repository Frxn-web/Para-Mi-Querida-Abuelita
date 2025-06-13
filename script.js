class MusicPlayer {
    constructor() {
        this.currentPlaylist = null;
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 70;
        
        // Simulación de playlists (en una app real, estas vendrían de Spotify API)
        this.playlists = {
            boleros: {
                name: "Boleros Románticos",
                songs: [
                    { title: "Bésame Mucho", artist: "Consuelo Velázquez", duration: "3:45" },
                    { title: "Sabor a Mí", artist: "Álvaro Carrillo", duration: "4:12" },
                    { title: "La Llorona", artist: "Chavela Vargas", duration: "5:23" },
                    { title: "Solamente Una Vez", artist: "Agustín Lara", duration: "3:56" },
                    { title: "Perfidia", artist: "Alberto Domínguez", duration: "4:08" }
                ]
            },
            rancheras: {
                name: "Rancheras Clásicas",
                songs: [
                    { title: "Cielito Lindo", artist: "Pedro Infante", duration: "3:34" },
                    { title: "El Rey", artist: "José Alfredo Jiménez", duration: "4:21" },
                    { title: "Volver Volver", artist: "Vicente Fernández", duration: "4:45" },
                    { title: "La Bikina", artist: "Luis Miguel", duration: "3:52" },
                    { title: "Cucurrucucú Paloma", artist: "Lola Beltrán", duration: "5:12" }
                ]
            },
            tangos: {
                name: "Tangos Argentinos",
                songs: [
                    { title: "La Cumparsita", artist: "Carlos Gardel", duration: "4:23" },
                    { title: "Por Una Cabeza", artist: "Carlos Gardel", duration: "3:45" },
                    { title: "El Choclo", artist: "Ángel Villoldo", duration: "4:12" },
                    { title: "Adiós Muchachos", artist: "Julio César Sanders", duration: "4:56" },
                    { title: "Volvió Una Noche", artist: "Carlos Gardel", duration: "4:34" }
                ]
            },
            valses: {
                name: "Valses Peruanos",
                songs: [
                    { title: "La Flor de la Canela", artist: "Chabuca Granda", duration: "4:12" },
                    { title: "José Antonio", artist: "Chabuca Granda", duration: "3:45" },
                    { title: "Fina Estampa", artist: "Chabuca Granda", duration: "4:23" },
                    { title: "El Plebeyo", artist: "Felipe Pinglo", duration: "5:01" },
                    { title: "Amarraditos", artist: "Felipe Pinglo", duration: "3:56" }
                ]
            }
        };
        
        this.initializeEventListeners();
        this.updateVolumeDisplay();
    }
    
    initializeEventListeners() {
        // Controles de reproducción
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSong());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSong());
        
        // Control de volumen
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.volume = e.target.value;
            this.updateVolumeDisplay();
        });
        
        // Selección de playlists
        document.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const playlistId = e.currentTarget.dataset.playlist;
                this.selectPlaylist(playlistId);
            });
        });
    }
    
    selectPlaylist(playlistId) {
        // Remover selección anterior
        document.querySelectorAll('.playlist-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Seleccionar nueva playlist
        document.querySelector(`[data-playlist="${playlistId}"]`).classList.add('active');
        
        this.currentPlaylist = this.playlists[playlistId];
        this.currentSongIndex = 0;
        this.displayCurrentPlaylist();
        this.updateCurrentSong();
        
        // Mostrar mensaje de confirmación
        this.showMessage(`¡Perfecto! Seleccionaste "${this.currentPlaylist.name}"`);
    }
    
    displayCurrentPlaylist() {
        const playlistDiv = document.getElementById('currentPlaylist');
        const songListDiv = document.getElementById('songList');
        
        playlistDiv.style.display = 'block';
        songListDiv.innerHTML = '';
        
        this.currentPlaylist.songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <strong>${song.title}</strong><br>
                <small>${song.artist} - ${song.duration}</small>
            `;
            songItem.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.updateCurrentSong();
                this.play();
            });
            songListDiv.appendChild(songItem);
        });
        
        this.updateSongSelection();
    }
    
    updateCurrentSong() {
        if (!this.currentPlaylist) return;
        
        const song = this.currentPlaylist.songs[this.currentSongIndex];
        document.getElementById('songTitle').textContent = song.title;
        document.getElementById('artistName').textContent = song.artist;
        document.getElementById('albumArt').textContent = '🎵';
        
        this.updateSongSelection();
    }
    
    updateSongSelection() {
        document.querySelectorAll('.song-item').forEach((item, index) => {
            item.classList.toggle('playing', index === this.currentSongIndex);
        });
    }
    
    togglePlay() {
        if (!this.currentPlaylist) {
            this.showMessage('¡Primero selecciona una playlist, abuelita! 😊');
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        document.getElementById('playBtn').textContent = '⏸️';
        this.showMessage('🎵 ¡Reproduciendo tu música favorita! 🎵');
        
        // Simular reproducción (en una app real, aquí se conectaría con Spotify)
        this.simulatePlayback();
    }
    
    pause() {
        this.isPlaying = false;
        document.getElementById('playBtn').textContent = '▶️';
        this.showMessage('⏸️ Música pausada');
    }
    
    nextSong() {
        if (!this.currentPlaylist) return;
        
        this.currentSongIndex = (this.currentSongIndex + 1) % this.currentPlaylist.songs.length;
        this.updateCurrentSong();
        
        if (this.isPlaying) {
            this.showMessage('⏭️ Siguiente canción');
        }
    }
    
    previousSong() {
        if (!this.currentPlaylist) return;
        
        this.currentSongIndex = this.currentSongIndex === 0 
            ? this.currentPlaylist.songs.length - 1 
            : this.currentSongIndex - 1;
        this.updateCurrentSong();
        
        if (this.isPlaying) {
            this.showMessage('⏮️ Canción anterior');
        }
    }
    
    updateVolumeDisplay() {
        // En una app real, aquí se ajustaría el volumen real
        console.log(`Volumen: ${this.volume}%`);
    }
    
    simulatePlayback() {
        // Simula el comportamiento de reproducción
        // En una app real, aquí se integraría con la API de Spotify
        if (this.isPlaying) {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.nextSong();
                    this.simulatePlayback();
                }
            }, 30000); // Cambia de canción cada 30 segundos para demo
        }
    }
    
    showMessage(message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 1.1em;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
    
    // Mensaje de bienvenida
    setTimeout(() => {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.95);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 1001;
            max-width: 400px;
        `;
        welcome.innerHTML = `
            <h2 style="color: #4a5568; margin-bottom: 15px;">¡Bienvenida, Abuelita! 💕</h2>
            <p style="color: #666; margin-bottom: 20px;">Tu música favorita está lista. Solo toca una playlist para empezar a escuchar.</p>
            <button onclick="this.parentElement.remove()" style="background: #48bb78; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1em;">¡Entendido!</button>
        `;
        document.body.appendChild(welcome);
    }, 1000);
});
