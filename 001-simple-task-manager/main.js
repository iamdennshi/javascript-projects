const form = document.querySelector('.new-task');
const input = document.querySelector('.new-task-input');
const tasks = document.querySelector('.tasks');
const tasksDone = document.querySelector('.tasks .done');
const tasksNotDone = document.querySelector('.tasks .not-done');
const menu = document.querySelector('.menu-bar');
const description = document.querySelector('.task-list-description');
const hideButton = document.querySelector('.hide-wrap');
const allDone = document.querySelector('.all-done-wrap');
const allDel = document.querySelector('.del-wrap');

let tasksInfo = {
    done: 0,
    total: 0,
}

allDel.addEventListener('click', () => {
    menu.style.display = '';
    tasksNotDone.innerHTML = '';
    tasksDone.innerHTML = '';
    tasksInfo.done = 0;
    tasksInfo.total = 0;
    window.localStorage.clear();
})

allDone.addEventListener('click', () => {
    if (tasksNotDone.childElementCount != 0) {
        const tasks = tasksNotDone.querySelectorAll('.task');

        for (let i = tasks.length - 1; i >= 0; i--) {
            tasksDone.prepend(tasks[i]);
            tasks[i].querySelector('.checkbox').classList.add('fa-check');
            tasks[i].querySelector('input').classList.add('checked');
            tasksInfo.done++;
        }

        window.localStorage.setItem('tasks-notDone', getValueOfNotDoneTasks());
        window.localStorage.setItem('tasks-Done', getValueOfDoneTasks());
        description.innerHTML = `Выполнено ${tasksInfo.done} / ${tasksInfo.total}`;
    }
})

hideButton.addEventListener('click', () => {
    const btn = hideButton.querySelector('button');
    const text = hideButton.querySelector('.btn-text');

    if (btn.classList.contains('fa-eye-slash')) {
        btn.classList.remove('fa-eye-slash');
        btn.classList.add('fa-eye');
        text.innerHTML = 'показать выполненные';
        tasksDone.style.display = 'none';
    } 
    else {
        btn.classList.remove('fa-eye');
        btn.classList.add('fa-eye-slash');
        text.innerHTML = 'скрыть выполненные';
        tasksDone.style.display = '';

    }
})

window.addEventListener('load', (e) => {
    const localDoneTasks = window.localStorage.getItem('tasks-Done');
    if (localDoneTasks) {
        const localDoneTasksArr = localDoneTasks.split(',').reverse();
        for (let i of localDoneTasksArr) {
            addTask(i, true);
        }
    }
    const localNotDoneTasks = window.localStorage.getItem('tasks-notDone');
    if (localNotDoneTasks) {
        const localNotDoneTasksArr = localNotDoneTasks.split(',').reverse();
        for (let i of localNotDoneTasksArr) {
            addTask(i, false);
        }
    }
})

tasks.addEventListener('click', (e) => {
    const item = e.target;
    const parent = item.parentElement;

    // Delete task
    if (item.classList[0] === 'delete') {
        tasksInfo.total--;
        parent.classList.add('fadeOut');
        if (parent.querySelector('.checkbox').classList[2] === 'fa-check') {
            tasksInfo.done--;
        }
        if (tasksInfo.total === 0) {
            menu.style.display = '';
        }
        else {
            description.innerHTML = `Выполнено ${tasksInfo.done} / ${tasksInfo.total}`;
        }
    }
    // Check task
    else if (item.classList[0] === 'checkbox') {
        if (item.classList[2] === 'fa-check') {
            if (document.querySelector('.tasks .done .task:first-child') == parent) {
                parent.classList.remove('fadeIn');    
            }
            else {
                parent.classList.add('fadeIn');
            }
            item.classList.remove('fa-check');
            parent.querySelector('input').classList.remove('checked');
            tasksInfo.done--;
            tasksNotDone.append(parent);
        }
        else {
            item.classList.add('fa-check');
            parent.querySelector('input').classList.add('checked');
            tasksInfo.done++;
            if (document.querySelector('.tasks .not-done .task:last-child') == parent) {
                parent.classList.remove('fadeIn');
            }
            else {
                parent.classList.add('fadeIn');
            }
            tasksDone.prepend(parent);
        }
        window.localStorage.setItem('tasks-notDone', getValueOfNotDoneTasks());
        window.localStorage.setItem('tasks-Done', getValueOfDoneTasks());
        description.innerHTML = `Выполнено ${tasksInfo.done} / ${tasksInfo.total}`;
    }
});

document.addEventListener('click', (e) => {
    // Disable an active task
    if (e.target.classList[0] !== 'text') {
        const anotherTasks = tasks.querySelectorAll(".task");
        for (let i = 0; i < anotherTasks.length; i++) {
                anotherTasks[i].querySelector("input").readOnly = true;
        }
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = input.value;
    
    if (task) {
        addTask(task, false);
        window.localStorage.setItem('tasks-notDone', getValueOfNotDoneTasks());
        input.value = "";
    }
});

function getValueOfNotDoneTasks() {
    const inputElements = document.querySelectorAll('.task input[class="text"]');
    let values = [];
    inputElements.forEach(val => values.push(val.value));
    return values;
}

function getValueOfDoneTasks() {
    const inputElements = document.querySelectorAll('input.text.checked');
    let values = [];
    inputElements.forEach(val => values.push(val.value));
    return values;
}

function addTask(value, isDone) {
    tasksInfo.total++; 

    if (tasksInfo.total === 1) {
        menu.style.display = 'flex';
    }

    const newTask = document.createElement('div');
    newTask.className = 'task fadeIn';
    
    
    const newTaskCheckbox = document.createElement('button');
    newTaskCheckbox.className = 'checkbox fa-solid';

    const newTaskInput = document.createElement('input');
    newTaskInput.className = 'text';
    newTaskInput.type = 'text';
    newTaskInput.value = value;
    newTaskInput.readOnly = true;

    const newTaskButtonDelete = document.createElement('button');
    newTaskButtonDelete.className = 'delete fa-solid fa-minus';

    const newTaskMover = document.createElement('button');
    newTaskMover.classList.add('mover', 'fa-solid', 'fa-bars');

    if (isDone) {
        newTaskCheckbox.classList.add('fa-check');
        newTaskInput.classList.add('checked');
        tasksInfo.done++;
        tasksDone.prepend(newTask);
    } 
    else {
        tasksNotDone.prepend(newTask);
    }
    description.textContent = `Выполнено ${tasksInfo.done} / ${tasksInfo.total}`;

    newTask.append(newTaskMover,newTaskCheckbox, newTaskInput, newTaskButtonDelete);

    newTask.addEventListener('transitionend', (e) => {
        if (e.propertyName == 'scale') {
            newTask.remove();
            window.localStorage.setItem('tasks-notDone', getValueOfNotDoneTasks());
            window.localStorage.setItem('tasks-Done', getValueOfDoneTasks());
        }
    })
    newTaskInput.addEventListener('change', (e) => {
        if (e.target.value == '') {
            const parent = e.target.parentElement;
            tasksInfo.total--;
            parent.classList.add('fadeOut');
            if (parent.querySelector('.checkbox').classList[2] === 'fa-check') {
                tasksInfo.done--;
            }
            if (tasksInfo.total === 0) {
                header.style.display = "none";
                description.style.display = "none";
            }
            else {
                description.innerHTML = `Выполнено ${tasksInfo.done} / ${tasksInfo.total}`;
            }
        }
        else {
            window.localStorage.setItem('tasks-notDone', getValueOfNotDoneTasks());
            window.localStorage.setItem('tasks-Done', getValueOfDoneTasks());
        }
    })

    newTaskInput.addEventListener('focus', e => {   
        const anotherTasks = tasks.querySelectorAll(".task");
        for (let i = 0; i < anotherTasks.length; i++) {
                anotherTasks[i].querySelector("input").readOnly = true;
        }
        newTaskInput.readOnly = false;
    })

    newTaskInput.addEventListener('blur', e => {
        newTaskInput.readOnly = true;
    })
    
    newTaskInput.addEventListener('keydown', e => {
        if (e.key == 'Enter' || e.key == 'Escape') {
            newTaskInput.blur();
        }
    })
}

new Sortable(tasksNotDone, {
    animation: 300,
    handle: '.mover',
    ghostClass: 'mover-task'
});

new Sortable(tasksDone, {
    animation: 300,
    handle: '.mover',
    ghostClass: 'mover-task'
});