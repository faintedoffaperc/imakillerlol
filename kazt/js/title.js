document.addEventListener('DOMContentLoaded', function() {
    var titleText = ".lol"; 
    var interval = 500; 
    var currentIndex = 0;
    var direction = 1; 
    var titleInterval;

    function updateTitle() {
        document.title = "imakiller" + titleText.substring(0, currentIndex);
        currentIndex += direction;
        if (currentIndex === titleText.length || currentIndex === 0) {
            direction *= -1; 
        }
    }

    titleInterval = setInterval(updateTitle, interval);


});