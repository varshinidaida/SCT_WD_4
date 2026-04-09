let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filteredTasks = tasks) {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}" 
            onclick="toggleComplete(${index})">
        ${task.text}
      </span>
      <br>
      <small>${task.date || "No date"}</small>
      <br>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    list.appendChild(li);
  });

  updateProgress();
}

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskDate = document.getElementById("taskDate");

  let text = taskInput.value;
  let date = taskDate.value;

  if (text === "") return;

  tasks.push({ text, date, completed: false });

  saveTasks();
  renderTasks();

  // ✅ CLEAR INPUT FIELDS AFTER ADD
  taskInput.value = "";
  taskDate.value = "";
  taskInput.focus();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  let newText = prompt("Edit task:", tasks[index].text);
  if (newText) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function clearAll() {
  tasks = [];
  saveTasks();
  renderTasks();
}

// 🔍 Search Feature
function searchTask() {
  let query = document.getElementById("search").value.toLowerCase();
  let filtered = tasks.filter(t => t.text.toLowerCase().includes(query));
  renderTasks(filtered);
}

// 🌙 Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("light");

  let btn = document.querySelector(".top-bar button");
  btn.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
}
// 📊 Progress Bar
function updateProgress() {
  let completed = tasks.filter(t => t.completed).length;
  let total = tasks.length;

  let percent = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// 🔔 Reminder System
setInterval(() => {
  let now = new Date().toISOString().slice(0,16);

  tasks.forEach(task => {
    if (task.date === now && !task.completed) {
      alert("⏰ Reminder: " + task.text);
    }
  });
}, 60000);

renderTasks();