const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addButton = document.getElementById("add-button");

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Index of the task being edited
let editIndex = -1;

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Add or update task
addButton.addEventListener("click", () => {
  const taskText = inputBox.value;
  if (taskText.trim() !== "") {
    if (editIndex === -1) {
      tasks.push(taskText); // Adding new task
    } else {
      tasks[editIndex] = taskText; // Updating existing task
      editIndex = -1; // Reseting editIndex
    }
    inputBox.value = ""; // Reseting the input field
    addButton.textContent = "Add";
    saveTasks();
  } else {
    alert("Task title is required!");
  }
});

// Function to render tasks
function renderTasks() {
  listContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task}</span>
      <div class="btn-wrapper">
      <button class="edit-button" data-index="${index}">&#9998;</button>
      <button class="delete-button" data-index="${index}">&#10008;</button>
      </div>
    `;
    listContainer.appendChild(li);
  });
}

// toggle checked class
listContainer.addEventListener("click", function (event) {
  if (event.target.tagName === "SPAN") {
    event.target.classList.toggle("checked");
  }
});

// Edit task
listContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("edit-button")) {
    editIndex = parseInt(target.getAttribute("data-index"));
    inputBox.value = tasks[editIndex];
    inputBox.focus();
    addButton.textContent = "Update";
  }
});

// Delete task
listContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-button")) {
    const index = target.getAttribute("data-index");
    tasks.splice(index, 1);
    saveTasks();
  }
});

// Initial rendering of tasks
renderTasks();
