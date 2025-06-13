class AutoMusicPlayer {
    constructor() {
        this.currentPlaylist = null;
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 70;
        this.autoMode = true;
        this.autoChangeInterval = 60; // minutos
        this.autoTimer = null;
        this.countdownTimer = null;
        this.timeLeft = 0;
        
        // Playlists predeterminadas con enlaces de ejemplo
        this.playlists = {
            boleros: {
                name: "💕 Boleros Románticos",
                icon: "💕",
                description: "Las canciones de amor de siempre",
                songs: [
                    { 
                        title: "Bésame Mucho", 
                        artist: "Consuelo Velázquez", 
                        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Ejemplo
                    },
                    { 
                        title: "Sabor a Mí", 
                        artist: "Álvaro Carrillo", 
                        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                    }
                ]
            },
            rancheras: {
                name: "🌹 Rancheras Clásicas",
                icon: "🌹",
                description: "La música de México querido",
                songs: [
                    { 
                        title: "Cielito Lindo", 
                        artist: "Pedro Infante", 
                        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                    },
                    { 
                        title: "El Rey", 
                        artist: "José Alfredo Jiménez", 
                        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                    }
                ]
            }
        };
        
        this.audioPlayer = document.getElementById('audioPlayer');
        this.loadCustomPlaylists();
        this.initializeEventListeners();
        this.renderPlaylists();
        this.startAutoMode();
        this.updateVolumeDisplay();
        
        // Mensaje de bienvenida
        setTimeout(() => this.showWelcomeMessage(), 1000);
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
            this.audioPlayer.volume = this.volume / 100;
        });
        
        // Eventos del reproductor de audio
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        this.audioPlayer.addEventListener('loadstart', () => this.showNotification('🎵 Cargando canción...'));
        this.audioPlayer.addEventListener('canplay', () => this.hideNotification());
        this.audioPlayer.addEventListener('error', () => this.handleAudioError());
        
        // Auto-cambio de tiempo
        document.getElementById('autoChangeTime').addEventListener('change', (e) => {
            this.autoChangeInterval = parseInt(e.target.value);
            if (this.autoMode) {
                this.restartAutoMode();
            }
        });
    }
    
    renderPlaylists() {
        const grid = document.getElementById('playlistGrid');
        grid.innerHTML = '';
        
        Object.keys(this.playlists).forEach(key => {
            const playlist = this.playlists[key];
            const card = document.createElement('div');
            card.className = 'playlist-card';
            card.dataset.playlist = key;
            card.innerHTML = `
                <div class="playlist-icon">${playlist.icon}</div>
                <h4>${playlist.name}</h4>
                <p>${playlist.description}</p>
                <small>${playlist.songs.length} canciones</small>
            `;
            card.addEventListener('click', () => this.selectPlaylist(key));
            grid.appendChild(card);
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
        this.loadCurrentSong();
        
        this.showNotification(`🎵 Reproduciendo: ${this.currentPlaylist.name}`);
        
        // Reiniciar modo automático
        if (this.autoMode) {
            this.restartAutoMode();
        }
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
                <small>${song.artist}</small>
            `;
            songItem.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.loadCurrentSong();
                this.play();
            });
            songListDiv.appendChild(songItem);
        });
        
        this.updateSongSelection();
    }
    
    loadCurrentSong() {
        if (!this.currentPlaylist) return;
        
        const song = this.currentPlaylist.songs[this.currentSongIndex];
        document.getElementById('songTitle').textContent = song.title;
        document.getElementById('artistName').textContent = song.artist;
        document.getElementById('playlistName').textContent = `🎵 ${this.currentPlaylist.name}`;
        document.getElementById('albumArt').textContent = '🎵';
        
        // Cargar audio
        this.audioPlayer.src = song.url;
        this.audioPlayer.volume = this.volume / 100;
        
        this.updateSongSelection();
    }
    
    updateSongSelection() {
        document.querySelectorAll('.song-item').forEach((item, index) => {
            item.classList.toggle('playing', index === this.currentSongIndex);
        });
    }
    
    togglePlay() {
        if (!this.currentPlaylist) {
            this.showNotification('🎵 Selecciona una playlist primero');
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audioPlayer.play().then(() => {
            this.isPlaying = true;
            document.getElementById('playBtn').textContent = '⏸️';
            this.showNotification('🎵 ¡Reproduciendo!', 2000);
        }).catch(error => {
            console.error('Error al reproducir:', error);
            this.handleAudioError();
        });
    }
    
    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        document.getElementById('playBtn').textContent = '▶️';
        this.showNotification('⏸️ Pausado', 2000);
    }
    
    nextSong() {
        if (!this.currentPlaylist) return;
        
        this.currentSongIndex = (this.currentSongIndex + 1) % this.currentPlaylist.songs.length;
        this.loadCurrentSong();
        
        if (this.isPlaying) {
            this.play();
        }
        
        this.showNotification('⏭️ Siguiente canción', 2000);
    }
    
    previousSong() {
        if (!this.currentPlaylist) return;
        
        this.currentSongIndex = this.currentSongIndex === 0 
            ? this.currentPlaylist.songs.length - 1 
            : this.currentSongIndex - 1;
        this.loadCurrentSong();
        
        if (this.isPlaying) {
            this.play();
        }
        
        this.showNotification('⏮️ Canción anterior', 2000);
    }
    
    updateVolumeDisplay() {
        document.getElementById('volumeDisplay').textContent = `${this.volume}%`;
    }
    
    // Modo automático
    startAutoMode() {
        if (!this.autoMode) return;
        
        this.timeLeft = this.autoChangeInterval * 60; // convertir a segundos
        this.startCountdown();
        
        this.autoTimer = setTimeout(() => {
            this.autoChangePlaylist();
        }, this.autoChangeInterval * 60 * 1000);
    }
    
    startCountdown() {
        this.countdownTimer = setInterval(() => {
            this.timeLeft--;
            this.updateCountdownDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.countdownTimer);
            }
        }, 1000);
    }
    
    updateCountdownDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('countdown').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    autoChangePlaylist() {
        const playlistKeys = Object.keys(this.playlists);
        let nextIndex = 0;
        
        if (this.currentPlaylist) {
            const currentKey = Object.keys(this.playlists).find(key => 
                this.playlists[key] === this.currentPlaylist
            );
            const currentIndex = playlistKeys.indexOf(currentKey);
            nextIndex = (currentIndex + 1) % playlistKeys.length;
        }
        
        this.selectPlaylist(playlistKeys[nextIndex]);
        this.play();
        this.showNotification('🔄 Cambiando automáticamente de playlist', 3000);
        
        if (this.autoMode) {
            this.startAutoMode();
        }
    }
    
    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        const button = document.getElementById('toggleAuto');
        
        if (this.autoMode) {
            button.textContent = '⏸️ Pausar Auto';
            button.style.background = '#ed8936';
            this.startAutoMode();
            this.showNotification('🔄 Modo automático activado', 2000);
        } else {
            button.textContent = '▶️ Activar Auto';
            button.style.background = '#48bb78';
            clearTimeout(this.autoTimer);
            clearInterval(this.countdownTimer);
            document.getElementById('countdown').textContent = 'Pausado';
            this.showNotification('⏸️ Modo automático pausado', 2000);
        }
    }
    
    restartAutoMode() {
        clearTimeout(this.autoTimer);
        clearInterval(this.countdownTimer);
        this.startAutoMode();
    }
    
    // Gestión de playlists personalizadas
    addCustomPlaylist() {
        const name = document.getElementById('playlistName').value.trim();
        const linksText = document.getElementById('playlistLinks').value.trim();
        
        if (!name || !linksText) {
            alert('Por favor, completa todos los campos');
            return;
        }
        
        const links = linksText.split('\n').filter(link => link.trim());
        const songs = links.map((link, index) => ({
            title: `Canción ${index + 1}`,
            artist: 'Artista Desconocido',
            url: this.convertYouTubeLink(link.trim())
        }));
        
        const playlistId = 'custom_' + Date.now();
        this.playlists[playlistId] = {
            name: `🎵 ${name}`,
            icon: '🎵',
            description: `Playlist personalizada (${songs.length} canciones)`,
            songs: songs
        };
        
        this.saveCustomPlaylists();
        this.renderPlaylists();
        
        // Limpiar formulario
        document.getElementById('playlistName').value = '';
        document.getElementById('playlistLinks').value = '';
        
        this.showNotification(`✅ Playlist "${name}" agregada correctamente`, 3000);
    }
    
    convertYouTubeLink(url) {
        // Aquí podrías integrar con un servicio para convertir enlaces de YouTube
        // Por ahora, devolvemos el enlace original
        return url;
    }
    
    saveCustomPlaylists() {
        const customPlaylists = {};
        Object.keys(this.playlists).forEach(key => {
            if (key.startsWith('custom_')) {
                customPlaylists[key] = this.playlists[key];
            }
        });
        localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
    }
    
    loadCustomPlaylists() {
        const saved = localStorage.getItem('customPlaylists');
        if (saved) {
            const customPlaylists = JSON.parse(saved);
            Object.assign(this.playlists, customPlaylists);
        }
    }
    
    // Manejo de errores
    handleAudioError() {
        this.showNotification('❌ Error al cargar la canción. Intentando siguiente...', 3000);
        setTimeout(() => this.nextSong(), 2000);
    }
    
    // Notificaciones
    showNotification(message, duration = 3000) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        
        if (duration > 0) {
            setTimeout(() => this.hideNotification(), duration);
        }
    }
    
    hideNotification() {
        document.getElementById('notification').style.display = 'none';
    }
    
    showWelcomeMessage() {
        this.showNotification('💕 ¡Hola Abuelita! Tu música está lista. Solo toca una playlist para empezar.', 5000);
        
        // Auto-seleccionar primera playlist si no hay ninguna seleccionada
        setTimeout(() => {
            if (!this.currentPlaylist) {
                const firstPlaylist = Object.keys(this.playlists)[0];
                this.selectPlaylist(firstPlaylist);
            }
        }, 3000);
    }
}

// Funciones globales para el panel de administración
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function addCustomPlaylist() {
    window.musicPlayer.addCustomPlaylist();
}

function toggleAutoMode() {
    window.musicPlayer.toggleAutoMode();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new AutoMusicPlayer();
});
