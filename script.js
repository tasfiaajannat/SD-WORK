document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const clearAllButton = document.getElementById('clearAllButton');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task.text, task.completed));
    };

    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                completed: task.classList.contains('task-completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTaskToList = (taskText, completed = false) => {
        const li = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-text');
        taskSpan.textContent = taskText;
        if (completed) {
            li.classList.add('task-completed');
        }

        const completeButton = document.createElement('button');
        completeButton.textContent = completed ? 'Undo' : 'Complete';
        completeButton.addEventListener('click', () => {
            li.classList.toggle('task-completed');
            completeButton.textContent = li.classList.contains('task-completed') ? 'Undo' : 'Complete';
            saveTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const newText = prompt('Edit task:', taskSpan.textContent);
            if (newText) {
                taskSpan.textContent = newText;
                saveTasks();
            }
        });

        li.append(taskSpan, completeButton, editButton, deleteButton);
        taskList.appendChild(li);
        saveTasks();
    };

    addTaskButton.addEventListener('click', () => {
        if (taskInput.value.trim()) {
            addTaskToList(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    clearAllButton.addEventListener('click', () => {
        taskList.innerHTML = '';
        saveTasks();
    });

    // Make list sortable
    new Sortable(taskList, {
        animation: 150,
        onEnd: saveTasks
    });

    loadTasks();
});
