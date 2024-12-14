//clock coding
 
var gameTimer, seconds,minutes, isPaused = false, isGameActive = false;  // Variable to store timer interval

function startGameTimer() {
	clearInterval(gameTimer); 
	seconds = 0;
	isGameActive = true;  // Mark the game as active
	document.getElementById("timerDisplay").innerHTML = "00:00"; // Reset the display to 00:00
	isPaused = false;
    gameTimer = setInterval(function() {
        if (!isPaused) {  // Only increment the timer if not paused
            seconds++;
            minutes = Math.floor(seconds / 60);
            displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
            document.getElementById("timerDisplay").innerHTML = displayTime; // Display the timer on the UI
        }
    }, 1000);
    resetInactivityTimer(); // Start the inactivity timer only when the game starts
}

function stopGameTimer(fullMessage, date=null, timeTaken=null) {
    openModal(fullMessage, false, true);
    saveGameTime(date, timeTaken);
    clearInterval(gameTimer); // Stop the game timer
    isGameActive = false; // Mark the game as inactive
    clearTimeout(inactivityTimer); // Stop the inactivity timer as well
}

// Function to convert time string to a number in the format MM.SS
function convertTimeToNumber(timeString) {
    // Extract only the time part from the string (e.g., "00:30.")
    var parts = timeString.match(/(\d{2}):(\d{2})/);
    
    if (parts) {
        var minutes = parseInt(parts[1]) || 0; // Convert minutes to an integer
        var seconds = parseInt(parts[2]) || 0; // Convert seconds to an integer
        
        // Return the number in the format MM.SS
        return parseFloat((minutes + seconds / 60).toFixed(2)); // Convert to MM.SS format
    } else {
        return 0; // Return 0 if the format is incorrect
    }
}

function openModal(message, showChoices = false, showEndChoices = false) {
    pauseGameTimer(); // Pause the timer when the modal is shown
    document.getElementById("modal").style.display = "block"; // Show the modal
    document.getElementById("modal-message").innerText = message; // Set the message
    
    // Show or hide the choices based on showChoices
    if (showChoices) {
        document.getElementById("modal-choices").style.display = "block"; // Show the buttons
    } else {
        document.getElementById("modal-choices").style.display = "none"; // Hide the buttons
    }
    
    if (showEndChoices) {
        document.getElementById("modal-choices-end").style.display = "block"; // Show the buttons
    } else {
        document.getElementById("modal-choices-end").style.display = "none"; // Hide the buttons
    }

}	

function closeModal() {
resumeGameTimer();
resetInactivityTimer()
document.getElementById("modal").style.display = "none"; // Hide the modal
}

// Pause the game timer (for when modal is shown)
function pauseGameTimer() {
    isPaused = true;  // Set the pause flag to true
}

// Resume the game timer (when modal is closed)
function resumeGameTimer() {
    isPaused = false;  // Set the pause flag to false
}

var inactivityTimer;

// Function that will be triggered if there is no activity for 5 seconds
function onInactivityDetected() {
    if (isGameActive) {  // Only trigger if the game is active
        var message = "Still here? Make a choice.";
        openModal(message, true, false); // Show modal and pause timer
    }
}	

// Function to reset the timer whenever activity is detected
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);  // Reset the previous timer
    inactivityTimer = setTimeout(onInactivityDetected, 5000);  // Start a new 5-second timer
}


// Functions for inactivity modal options
function startNewGame() {
    closeModal();  // Close the modal before starting a new game
    generateRandomSudoku();  // Call the function to generate a new game
}

function getHint() {
    closeModal();  // Close the modal before giving a hint
    hint();  // Call the hint function to reveal a number
}

function hint() {
	resetInactivityTimer()
	var foundEmptyCell = false;
	while (!foundEmptyCell ) {
	
	randomRow = Math.floor(Math.random() * 4)+1; 
	randomCol = Math.floor(Math.random() * 4)+1;
	position = randomRow + '-' + randomCol;
	
	if (userGrid[randomRow-1][randomCol-1] === '*' && $(position).style.backgroundColor !== 'skyblue') {
	  document.getElementById(position).value = completeGrid[randomRow-1][randomCol-1];
	  document.getElementById(position).setAttribute('disabled', true);
	  userGrid[randomRow-1][randomCol-1] = completeGrid[randomRow-1][randomCol-1];
	  foundEmptyCell = true;
	}
	}
}
