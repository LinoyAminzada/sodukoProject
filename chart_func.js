// Initialize the game history array with column headers
var gameHistory = [['Game Start Time', 'Time Taken (minutes)']];

// Function to load game history from localStorage
function loadGameHistory() {
    var savedHistory = localStorage.getItem('gameHistory');
    if (savedHistory) {
        gameHistory = JSON.parse(savedHistory);
    }
    console.log(gameHistory);
} 

// Function to draw the chart
function drawChart() {
    // Convert the game history array to a DataTable for the chart
    var data = google.visualization.arrayToDataTable(gameHistory);

    // Set options for the chart
    var options = {
        title: 'Game Finish Time History',
        hAxis: { title: 'Game Date', format: 'MM-dd-yyyy' },
        vAxis: { title: 'Time Taken (minutes)', ticks: [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5] },
        curveType: 'function',
        width: 600,  // Adjust width here
        height: 400  // Adjust height here
    };

    // Create a new LineChart and draw it on the specified HTML element
    var chart = new google.visualization.LineChart(document.getElementById('graph_place'));
    chart.draw(data, options);
}

// Function to show the chart modal
function showChart() {
    closeModal(); // Close any existing modals
    loadGameHistory(); // Load game history here
    console.log(gameHistory);

    // Check if the game history is empty
    if (gameHistory.length === 1) {
        openModal('No game history available!'); // Notify the user
        return; // Exit the function if there's no history
    }

    openGraphModal(); // Open the graph modal
    drawChart(); // Call the function to draw the chart
}

// Function to save the current game's time to the history
function saveGameTime(date, timeTaken) {
    //console.log('Saving game time:', date, timeTaken); // Debugging line
    if ((date && timeTaken) != null) { // Ensure both are valid
        gameHistory.push([date, timeTaken]); 
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } else {
        return; // Log error
    }
}

// Function to clear the game history
function clearChart() {
    closeModal(); // Close any existing modals
    localStorage.removeItem("gameHistory"); // Remove the game history from localStorage
    // Reset gameHistory to its initial state
    gameHistory = [['Game Start Time', 'Time Taken (minutes)']];
    console.log(gameHistory)
}

// Function to open the graph modal
function openGraphModal() {
    document.getElementById('graph-modal').style.display = 'block'; // Display the graph modal
}

// Function to close the graph modal
function closeGraphModal() {
    document.getElementById("graph-modal").style.display = "none"; // Hide the graph modal
}
    