let tasks = [];
let isEditing = false; 
let editIndex = -1;    

function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();
  
  const deadlineInput = document.getElementById('deadline');
  const deadline = deadlineInput.value;

  if (taskText !== '' && deadline !== '') {
    if (isEditing) {
      // Jika sedang dalam mode edit, update tugas yang sedang diedit
      tasks[editIndex] = { text: taskText, deadline: deadline, completed: false };
      isEditing = false;
      editIndex = -1;
    } else {
      // Jika tidak sedang mengedit, tambahkan tugas baru
      tasks.push({ text: taskText, deadline: deadline, completed: false });
    }
    
    taskInput.value = '';
    deadlineInput.value = '';
    renderTasks();
    showToast('Task added successfully!');
  } else {
    showToast('Please enter a task and deadline!');
  }
}

function editTask(index) {
  const taskInput = document.getElementById('new-task');
  const deadlineInput = document.getElementById('deadline');

  // Isi input dengan data tugas yang sedang diedit
  taskInput.value = tasks[index].text;
  deadlineInput.value = tasks[index].deadline;

  isEditing = true; 
}

function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'flex items-center justify-between bg-white py-2 px-4 rounded-lg shadow';
    
    const taskText = document.createElement('span');
    taskText.className = task.completed ? 'line-through text-gray-500' : '';
    taskText.innerText = `${task.text} (Deadline: ${task.deadline})`;
    
    const taskActions = document.createElement('div');
    
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = task.completed ? 'Unmark' : 'Done';
    completeBtn.className = 'bg-army-green-pastel text-white font-bold py-1 px-2 rounded mr-2';
    completeBtn.addEventListener('click', () => toggleTaskCompletion(index));

    const editBtn = document.createElement('button');
    editBtn.innerHTML = 'Edit';
    editBtn.className = 'bg-orange-pastel text-white font-bold py-1 px-2 rounded mr-2';
    editBtn.addEventListener('click', () => editTask(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.className = 'bg-red-pastel text-white font-bold py-1 px-2 rounded';
    deleteBtn.addEventListener('click', () => deleteTask(index));
    
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);
    
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskActions);
    taskList.appendChild(taskItem);
  });
  
  updateProgressBar();
}

function updateProgressBar() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  document.getElementById('progress-bar').style.width = `${progressPercent}%`;
  document.getElementById('progress-percent').innerText = `${progressPercent.toFixed(1)}%`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'bg-pink-500 text-white px-4 py-2 rounded fixed bottom-4 right-4';
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function sortTasksByDeadline() {
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  renderTasks();
}

document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('sort-tasks').addEventListener('change', function() {
  if (this.value === 'nearest-deadline') {
    sortTasksByDeadline();
  } else if (this.value === 'completed') {
    tasks.sort((a, b) => b.completed - a.completed);
    renderTasks();
  } else {
    renderTasks(); 
  }
});
