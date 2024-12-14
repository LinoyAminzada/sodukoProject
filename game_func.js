function $(el) { return document.getElementById(el); }

mx = 4; // num of rows
my = 4; // num of column
completeGrid = []; // Store the complete solution grid
userGrid = []; // Store the user solution grid
isAutoCheckEnabled = false;
gameStarted = false;


function createTable() {
    var tstr = '<table>'; // Add the table start
    for (r = 1; r <= my; r++) { // rows
        tstr += "<tr>"; // Add new row tr
        for (c = 1; c <= mx; c++) {
        	tstr +='<td><input type="text" maxlength="1" id="'+r+'-'+c+'" oninput="validateInput(this);" disabled></td>';
        }
        tstr += "</tr>"; // Add tr close
    }
    tstr += '</table>'; // Add the table end
    return tstr;
}

function validateInput(input) {
    value = input.value;

    // Check if the value is not empty and not a digit between 1 and 4 - lesson 6 
    if (!/^[1-4]$/.test(value)) {
        $("message").innerHTML = "Please enter a digit between 1 and 4";
        input.value = ""; // Clear the input if it's invalid
        // Hide the message after 3 seconds
        setTimeout(() => {
            $("message").innerHTML = "";
        }, 3000);
        return;
   		 }
   	else{
   	//console.log(input.id);
   	position = input.id.split('-');
   	row = parseInt(position[0]) - 1;
	col = parseInt(position[1]) - 1;

    userGrid[row][col] = value; // Update userGrid
    
	$(input.id).style.backgroundColor = '#f8f9fa'; // Highlight the cell
	//$(input.id).disabled=true;	
	
	if (isAutoCheckEnabled) {
		checkEachInput(input, row, col);
		} 
	else {
		cellPointer();
	}
	resetInactivityTimer(); // Reset inactivity timer here
	}
     
}

// Function to check the last input against the solution
function checkEachInput(input, row, col) {
    // Compare the input value with the corresponding value in completeGrid
    if (input.value == completeGrid[row][col]) {
        input.style.color = '#0D6EE2'; // Set text color to blue if correct
    } else {
        input.style.color = '#CC0026'; // Set text color to red if incorrect
        input.style.backgroundColor = '#FEDDE3';
    }

    cellPointer(); // Move to the next cell if needed
}		

function createRandomArray() {
    var newArray = [];
    var num;
    while (newArray.length < mx) {
        num = Math.floor(Math.random() * mx) + 1; // Generate a random number between 1 and mx
        if (!newArray.includes(num)) { // Check if the number is not already in the array
            newArray.push(num); // Add unique number to the array
        }
    }
    return newArray;
}

// Function to fill the table and reveal only 4 positions
function fillTable() {
    randomArray = createRandomArray(); // Generate a random array
    
    // Create the full solution grid
    for (r = 1; r <= my; r++) {
        rowArray = [];
        switch (r) {
            case 1:
                rowArray = [randomArray[0], randomArray[1], randomArray[2], randomArray[3]];
                break;
            case 2:
                rowArray = [randomArray[2], randomArray[3], randomArray[0], randomArray[1]];
                break;
            case 3:
                rowArray = [randomArray[1], randomArray[0], randomArray[3], randomArray[2]];
                break;
            case 4:
                rowArray = [randomArray[3], randomArray[2], randomArray[1], randomArray[0]];
                break;
        }
        completeGrid.push(rowArray); // Save the row to the complete grid
        userGrid.push(["*","*","*","*"]);
    }
    
console.log("Complete Grid:", completeGrid); // Print the complete grid to the console for debugging
console.log("Complete user Grid:", userGrid);

// Now reveal only 4 random positions
revealRandomPositions(completeGrid);
}


// Function to randomly reveal unique positions
function revealRandomPositions(completeGrid) {
    revealedPositions = [];
    
    while (revealedPositions.length < mx ) {
        randomRow = Math.floor(Math.random() * my) + 1;  //num between 1-4 
        randomCol = Math.floor(Math.random() * mx) + 1;
		position = randomRow + '-' + randomCol;
        
        // Ensure the position is unique
        if (!revealedPositions.includes(position)) {
            revealedPositions.push(position);
            $(position).value = completeGrid[randomRow-1][randomCol-1]; // Reveal the number, indexes from 0-3 
            //$(position).disabled=true; // Disable input field for revealed positions
            $(position).style.color= 'gray';
            $(position).style.fontWeight= 'bold';
            
            // Store the revealed value in userGrid
            userGrid[randomRow-1][randomCol-1] = completeGrid[randomRow-1][randomCol-1];   
        }
    }
 cellPointer();
}
          
function generateRandomSudoku() {
    gameStarted = true;
    completeGrid = [];
    userGrid = [];
    $("maindiv").innerHTML = createTable();
    console.log("Auto-Check Mode:", isAutoCheckEnabled);
    startGameTimer(); // Start the timer when the game is generated
    fillTable();
}

function toggleAutoCheck() {
    isAutoCheckEnabled = !isAutoCheckEnabled; 
    let button = document.getElementById('autoCheckButton');
    
    if (isAutoCheckEnabled) {
        button.innerHTML = 'Disable Auto-Check Mode'; 
    } else {
        button.innerHTML = 'Enable Auto-Check Mode';
    }
    resetInactivityTimer();
}

function checkSudoku() {
	if (!gameStarted) {
	        $("message").innerHTML = "Please start a new game before checking.";
	        setTimeout(() => {
	            $("message").innerHTML = "";
	        }, 3000);
	        return; 
	    }
	      
	if (isBoardFull()!== true) {
	    	$("message").innerHTML =("Please fill all the cells before checking.");
	    	// Hide the message after 3 seconds
	        setTimeout(() => {
	            $("message").innerHTML = "";
	        }, 3000);
	        resetInactivityTimer();
	    	return;
	    }
    
    var isCorrect = true;
    
    // Check the user's input against the solution
    for (r = 0; r < my; r++) {
        for (c = 0; c < mx; c++) {
            if (parseInt(userGrid[r][c]) != completeGrid[r][c]) {
            console.log("user grid value:", userGrid[r][c])
            console.log("complete grid value:", completeGrid[r][c])
            	isCorrect = false;
            	for (c = 0; c < mx; c++) {
            		// Highlight the entire row
					$((r+1) + '-' + (c+1)).style.backgroundColor = '#FEDDE3';
				    }
             break;
             }
            }
        }
    
     // If rows are correct, there's no need to check columns
    if (isCorrect) {
        message=("Congratulations! You've completed the Sudoku correctly!");
        var timeTaken=(`Time taken to finish the game: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.`);
		fullMessage=`${message}${" "}${timeTaken}`;
        var today = new Date();
 		var date= (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
 		var numericTime = convertTimeToNumber(timeTaken);
    	console.log(numericTime);
 		stopGameTimer(fullMessage,date, numericTime);
 	
    } else{

    // Check columns only if there were errors in the rows
    for (c = 0; c < mx; c++) {
        for (r = 0; r < my; r++) {
            if (parseInt(userGrid[r][c]) !== completeGrid[r][c]) {
                // Highlight the entire incorrect column
                for (r = 0; r < my; r++) {
                    $((r + 1) + '-' + (c + 1)).style.backgroundColor = '#FEDDE3';
                    //console.log("wrong at:", (r+1) + '-' + (c+1))
                }
                break; // Exit the row check for this column
            }
        }
        }
        fullMessage=("Didn't work this time.");
        stopGameTimer(fullMessage); // Stop the timer after checking the solution
        }
}

           
// Check if the entire board is full 
function isBoardFull() {
    for (row = 0; row < my; row++) {
        for (col = 0; col < mx; col++) {
            if (userGrid[row][col] === '*') {
                return false; // Found an empty cell
            }
        }
    }
    return true; // No empty cells found
}

function cellPointer() {
	var randRow, randCol, cellId;
	var pointNeed=difficultLevel();
	var pointedCells=howManyPointed(userGrid); 
	var cellsToPoint = pointNeed - pointedCells;
	
	if (cellsToPoint <= 0) {
        return; // No additional cells need to be pointed
    }
	
	while (cellsToPoint > 0) {		        
        randRow = Math.floor(Math.random() * my) + 1;
        randCol = Math.floor(Math.random() * mx) + 1; 
        cellId = randRow + '-' +randCol;

        // Ensure the position is empty and not already pointed
        if (userGrid[randRow-1][randCol-1] === '*' && $(cellId).style.backgroundColor !== 'skyblue') {
            $(cellId).style.backgroundColor = 'skyblue'; // Highlight the cell
            $(cellId).disabled = false; //Enable it for user input
            cellsToPoint--;
        }

        // If no cells can be pointed anymore, exit the loop
        if (cellsToPoint > 0 && noMoreCellsToPoint()) {
            break;
        }
    }
}

function noMoreCellsToPoint() {
    for (r = 0; r < my; r++) {
        for (c = 0; c < mx; c++) {
            if (userGrid[r][c] === '*' && $( (r+1) + '-' + (c+1) ).style.backgroundColor !== 'skyblue') {
                return false;
            }
        }
    }
    return true;
}
 
function howManyPointed(userGrid) {
	 var counter=0, cellId; 
	 
	 for (r = 1; r <= my; r++) { // rows
	    for (c = 1; c <= mx; c++) {
	    	cellId = (r) + '-' + (c);
	    	if ($(cellId).style.backgroundColor === 'skyblue') {
	    		counter++
	    	}
	 	 }
	  }	
	  //console.log("Pointed cells counter:", counter);
	  return counter;
	}
  
function difficultLevel() {
    var difficulty = document.getElementById("difficulty").value;
    //console.log("difficult is:", difficulty );
    var pointNeed;
    
    // Set difficulty level
    if (difficulty === "easy") {
        pointNeed= 3; // highlight 3 cells
    } else if (difficulty === "medium") {
        pointNeed= 2;  // highlight 2 cells
    } else {
        pointNeed= 1;  // highlight 1 cells
    }
    
    return pointNeed;
 }
