// Transform the music player to big and small
const musicPlayer = document.getElementsByClassName('music-player--small')[0];
const songInformation = document.getElementById('song-information');
const back = document.getElementById('back');

songInformation.addEventListener('click', transformMusicPlayerBig);
function transformMusicPlayerBig() {
    musicPlayer.classList.add('big');
}

back.addEventListener('click', transformMusicPlayerSmall);
function transformMusicPlayerSmall() {
    musicPlayer.classList.remove('big');
}

function showPlayerSmall(song) {
    // Make player visible
    musicPlayer.classList.add('visible');

    // Clear player and add song in it
    songInformation.innerHTML = '';
    songInformation.append(song);

    // Set icon to pause, because song is playing
    let control = controls.children;
    control = control[0];
    control.src = '/pause_icon.svg';
    playState = false;

}

// Toggle pause play on click on controls
const controls = document.getElementsByClassName('controls')[0];
controls.addEventListener('click', togglePausePlay);

let playState = false;

function togglePausePlay() {
    // Get control img element
    let control = controls.children;
    control = control[0];

    // Toggle player
    player.togglePlay();

    // Toggle pause / play image
    const pause = '/pause_icon.svg';
    const play = '/play_icon.svg';

    if (playState === false) {
        control.src = play;
        playState = true;
    } else {
        control.src = pause;
        playState = false;
    }
}

// Toggle visibility of favorite songs
const playlistLarge = document.getElementsByClassName('playlist-large')[0];

document.getElementById('playlist-small').addEventListener('click', showPlaylist);
function showPlaylist() {
    playlistLarge.classList.add('visible');
}

document.getElementById('back-overview').addEventListener('click', hidePlaylist);
function hidePlaylist() {
    playlistLarge.classList.remove('visible');
}