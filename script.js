let totalTime = 0; // Total time for all tasks in seconds
let tasks = []; // Array to store tasks
let currentTaskIndex = -1; // Index of the current task
let currentTaskTimerId; // Interval ID for the current task's timer
let isPaused = false; // Flag to indicate if the current task is paused
let currentTaskElement = null; // HTML element of the current task

// Adds a task to the tasks array and updates the UI
function addTask() {
    const taskName = document.getElementById("taskInput").value.trim();
    const taskTime = parseInt(document.getElementById("timeInput").value, 10);

    if (taskName && !isNaN(taskTime) && taskTime > 0) {
        const task = { name: taskName, duration: taskTime * 60 }; // Convert minutes to seconds
        tasks.push(task);
        displayTask(task);
        updateTotalTime();
        clearInputFields();
    } else {
        alert("Please enter a valid task name and time.");
    }
}

// Updates the total time display
function updateTotalTime() {
    totalTime = tasks.reduce((acc, task) => acc + task.duration, 0);
    document.getElementById("totalRoutineTimer").textContent = formatTime(totalTime);
}

// Displays a task in the task list UI
function displayTask(task) {
    const li = document.createElement("li");
    li.textContent = `${task.name} - ${task.duration / 60} minutes`;
    document.getElementById("taskList").appendChild(li);
}

// Clears the input fields after adding a task
function clearInputFields() {
    document.getElementById("taskInput").value = "";
    document.getElementById("timeInput").value = "";
}

// Starts the timer for the routine
function startRoutine() {
    if (tasks.length === 0) {
        alert("No tasks added to the routine.");
        return;
    }

    if (currentTaskIndex < 0) {
        currentTaskIndex = 0;
        startCurrentTask();
    }
}

// Starts the timer for the current task
function startCurrentTask() {
    if (currentTaskIndex >= tasks.length) {
        alert("All tasks completed!");
        resetRoutine();
        return;
    }
    document.getElementById("lofiMusic").play();
    document.getElementById("inspirationalQuote").style.display = "block";

    const task = tasks[currentTaskIndex];
    let duration = task.duration;
    currentTaskElement = document.querySelectorAll("#taskList li")[currentTaskIndex];
    highlightActiveTask(currentTaskElement);
    isPaused = false;

    currentTaskTimerId = setInterval(() => {
        if (!isPaused) {
            duration--;
            task.duration = duration; // Update the task's duration
            if (duration <= 0) {
                clearInterval(currentTaskTimerId);
                finishCurrentTask();
            } else {
                updateTaskTimer(currentTaskElement, duration);
                updateTotalTime();
            }
        }
    }, 1000);
}

// Pauses or resumes the current task's timer
function pauseTask() {
    isPaused = !isPaused;
    updatePauseButton();
    const music = document.getElementById("lofiMusic");
    if (isPaused) {
        music.pause();
    } else {
        music.play();
    }
}

// Adds 5 minutes to the current task's duration
function snoozeTask() {
    if (currentTaskIndex !== -1) {
        tasks[currentTaskIndex].duration += 5 * 60; // Add 5 minutes
        updateTotalTime();
    }
}

// Finishes the current task and moves to the next one
function finishCurrentTask() {
    clearInterval(currentTaskTimerId);
    currentTaskIndex++;
    startCurrentTask();
    if (currentTaskIndex >= tasks.length) {
        document.getElementById("lofiMusic").pause();
        document.getElementById("lofiMusic").currentTime = 0; // Reset audio to start
        document.getElementById("inspirationalQuote").style.display = "none";
    }
}

// Highlights the active task in the UI
function highlightActiveTask(taskElement) {
    const allTasks = document.querySelectorAll("#taskList li");
    allTasks.forEach(task => task.classList.remove("active-task"));
    taskElement.classList.add("active-task");
}

// Updates the pause button text based on the current state
function updatePauseButton() {
    const pauseButton = document.querySelector("#taskControls button:first-child");
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
}

// Updates the timer display for the current task
function updateTaskTimer(taskElement, duration) {
    taskElement.textContent = `${tasks[currentTaskIndex].name} - ${formatTime(duration)}`;
}

// Formats time from seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Resets the routine to its initial state
function resetRoutine() {
    tasks = [];
    currentTaskIndex = -1;
    totalTime = 0;
    document.getElementById("taskList").innerHTML = "";
    document.getElementById("totalRoutineTimer").textContent = "00:00";
    document.getElementById("taskControls").style.display = "none"; // Hide the task controls
    document.getElementById("lofiMusic").pause();
    document.getElementById("lofiMusic").currentTime = 0; // Reset audio to start
    document.getElementById("inspirationalQuote").style.display = "none";
}
const quotes = [
    "Do what you love and the necessary resources will follow.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Don’t watch the clock; do what it does. Keep going.",
    // Add more quotes as desired
];

function displayRandomQuote() {
    const quoteElement = document.getElementById("inspirationalQuote");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.innerHTML = `<p>"${quotes[randomIndex]}"</p>`;
    quoteElement.style.display = "block";
}
document.getElementById("taskControls").style.display = "block"; // Show the task controls after defining functions


