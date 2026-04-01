class Todo {
  constructor() {
    const savedTasks = localStorage.getItem('myTasks');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    } else {
      this.tasks = [];
    }
    this.term = '';
  }

  saveToStorage() {
    localStorage.setItem('myTasks', JSON.stringify(this.tasks));
  }

  getFilteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }

    return this.tasks.filter(task => {
      return task.name.toLowerCase().includes(this.term.toLowerCase());
    });
  }

  add(name, date) {
    if (name.length < 3 || name.length > 255) {
      alert("Nazwa zadania musi mieć od 3 do 255 znaków!");
      return;
    }

    if (date) {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        alert("Data musi być pusta albo w przyszłości!");
        return;
      }
    }

    const newTask = {
      id: Date.now(),
      name: name,
      date: date
    };

    this.tasks.push(newTask);
    this.saveToStorage();
    this.draw();
  }

  remove(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToStorage();
    this.draw();
  }

  edit(id, newName, newDate) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index].name = newName;
      this.tasks[index].date = newDate;
      this.saveToStorage();
      this.draw();
    }
  }

  draw() {
    const listContainer = document.getElementById('todoList');
    listContainer.innerHTML = '';

    const tasksToRender = this.getFilteredTasks();

    tasksToRender.forEach(task => {
      const liElement = document.createElement('li');

      let displayName = task.name;
      if (this.term.length >= 2) {
        const regex = new RegExp(`(${this.term})`, 'gi');
        displayName = displayName.replace(regex, '<span class="highlight">$1</span>');
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'task-content';
      contentDiv.innerHTML = `<span>${displayName}</span> <strong>${task.date || ''}</strong>`;
      
      contentDiv.addEventListener('click', () => {
        liElement.innerHTML = '';

        const editNameInput = document.createElement('input');
        editNameInput.type = 'text';
        editNameInput.value = task.name;

        const editDateInput = document.createElement('input');
        editDateInput.type = 'date';
        editDateInput.value = task.date;

        const saveChanges = () => {
          setTimeout(() => {
            if (document.activeElement !== editNameInput && document.activeElement !== editDateInput) {
              this.edit(task.id, editNameInput.value, editDateInput.value);
            }
          }, 50);
        };

        editNameInput.addEventListener('blur', saveChanges);
        editDateInput.addEventListener('blur', saveChanges);

        liElement.appendChild(editNameInput);
        liElement.appendChild(editDateInput);

        editNameInput.focus();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerText = '🗑️';
      deleteBtn.addEventListener('click', () => {
        this.remove(task.id);
      });

      liElement.appendChild(contentDiv);
      liElement.appendChild(deleteBtn);

      listContainer.appendChild(liElement);
    });
  }
}

document.todo = new Todo();

document.todo.draw();

document.getElementById('addBtn').addEventListener('click', () => {
  const nameInput = document.getElementById('newTaskName');
  const dateInput = document.getElementById('newTaskDate');

  document.todo.add(nameInput.value, dateInput.value);

  nameInput.value = '';
  dateInput.value = '';
});

document.getElementById('searchInput').addEventListener('input', (event) => {
  document.todo.term = event.target.value;
  document.todo.draw();
});
