document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const songs = ["/dan/mp3/music1.mp3", "/dan/mp3/music2.mp3", "/dan/mp3/music3.mp3"];
    const audio = new Audio();

    function closeOverlay() {
        overlay.style.opacity = "0";
        const randomSongIndex = Math.floor(Math.random() * songs.length);
        const selectedSong = songs[randomSongIndex];
        console.log("Selected song:", selectedSong);
        audio.src = selectedSong;
        audio.play();
        setTimeout(() => {
            overlay.style.display = "none";
        }, 2000);
    }

    overlay.addEventListener("click", function () {
        closeOverlay();
    });


    audio.addEventListener("ended", function() {

        audio.currentTime = 0;
        audio.play();
    });
});


