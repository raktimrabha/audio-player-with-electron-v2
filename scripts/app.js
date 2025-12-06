// DOM Elements
const openFileBtn = document.getElementById('openFile');
const playPauseBtn = document.getElementById('playPause');
const stopBtn = document.getElementById('stopBtn');
const progressBar = document.getElementById('progress');
const volumeControl = document.getElementById('volume');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const nowPlayingEl = document.getElementById('nowPlaying');
const fileInfoEl = document.getElementById('fileInfo');

// Audio setup
let audio = new Audio();
let isPlaying = false;
let isDragging = false;

// Format time in MM:SS format
const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Update time display
const updateTimeDisplay = () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
    
    if (!isDragging) {
        const progress = (audio.currentTime / audio.duration) * 100 || 0;
        progressBar.value = progress;
    }
};

// Open file handler
openFileBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
        audio.src = filePath;
        audio.load();
        playPauseBtn.disabled = false;
        stopBtn.disabled = false;
        
        // Extract filename from path
        const fileName = filePath.split(/[\\/]/).pop();
        nowPlayingEl.textContent = 'Now Playing';
        fileInfoEl.textContent = fileName;
        
        // Reset progress bar
        progressBar.value = 0;
    }
});

// Play/Pause handler
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
});

// Stop handler
stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    updateTimeDisplay();
});

// Progress bar interaction
progressBar.addEventListener('input', () => {
    isDragging = true;
    const seekTime = (progressBar.value / 100) * audio.duration;
    currentTimeEl.textContent = formatTime(seekTime);
});

progressBar.addEventListener('change', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    isDragging = false;
});

// Volume control
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Audio event listeners
audio.addEventListener('play', () => {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playPauseBtn.classList.remove('bg-blue-500');
    playPauseBtn.classList.add('bg-blue-600');
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    playPauseBtn.classList.remove('bg-blue-600');
    playPauseBtn.classList.add('bg-blue-500');
});

audio.addEventListener('timeupdate', updateTimeDisplay);

audio.addEventListener('loadedmetadata', () => {
    updateTimeDisplay();
});

audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    updateTimeDisplay();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Initialize volume
audio.volume = volumeControl.value;