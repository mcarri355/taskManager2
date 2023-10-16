const results = document.querySelector('.results');
const btn = document.querySelector('.submit-btn');
const input = document.querySelector('.form-input');
const input2 = document.querySelector('#description');
const newTask = document.querySelector('#newName');
const newDesc = document.querySelector('#newDescription');
let newAssign = document.querySelector('#newAssign');
const formAlert = document.querySelector('.form-alert');
const task = document.querySelector('.task');
const description = document.querySelector('.description');
const assignment = document.querySelector('.assignment');
let chosenTask = '';
let chosenDescription = '';
let chosenID;
let newPerson = '';

var editMode = false;
var currentId = '';

async function change() {
  let { data } = await axios.get('/api/task');
  task.innerHTML = results.value;
  data.find((task) => {
    if (task.name == results.value) {
      description.innerHTML = task.description;
      assignment.innerHTML = `Assigned: ${task.assigned}`;
      sessionStorage.setItem('chosenTask', results.value);
      sessionStorage.setItem('chosenDescription', task.description);
      sessionStorage.setItem('chosenID', task.taskID);
      sessionStorage.setItem('assigned', task.assigned);
      chosenID = task.taskID;
    }
  });
}

function inputs() {
  newTask.value = sessionStorage.getItem('chosenTask');
  newDesc.value = sessionStorage.getItem('chosenDescription');
  newAssign.value = sessionStorage.getItem('assigned');
  chosenID = sessionStorage.getItem('chosenID');
  editMode = true;
}

btn.addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    if (!editMode) {
      let nameValue = input.value;
      let descValue = input2.value;
      const { data } = await axios.post('/api/task', {
        name: nameValue,
        description: descValue,
      });
      const h5 = document.createElement('h5');
      h5.textContent = data.tasks;
      results.appendChild(h5);
      fetchTask();
      input.value = '';
      input2.value = '';
    } else {
      let taskChange = newTask.value;
      let descriptionChange = newDesc.value;
      let taskAssign = '';

      if (true) {
        const { data } = await axios.get('/api/task');
        data.map((task) => {
          if (task.name == taskChange) {
            taskAssign += task.assigned;
          }
        });
      }

      const { data } = await axios.get('/api/people');
      console.log(data);

      data.map((person) => {
        if (person.name == newAssign.value) {
          if (person.task == 'none' && taskAssign == 'unassigned') {
            newPerson = person.name;
            fetch(`/api/people/${person.userID}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ task: taskChange }),
            });
          } else if (taskAssign != 'unassigned') {
            newPerson = taskAssign;
          }
        }
      });

      if (newAssign.value == '') {
        newPerson = 'unassigned';
      }

      fetch(`/api/task/${chosenID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taskChange,
          description: descriptionChange,
          assigned: newPerson,
        }),
      });

      fetchTask();
      editMode = false;
      window.location.href = './task.html';
    }
  } catch (e) {
    console.log(e);
  }
});

function nameAlter() {
  editMode = true;
  newTask.value = chosenTask;
  newDesc.value = chosenDescription;
}

function deleteThis() {
  fetch(`/api/task/${chosenID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  fetchTask();
}

async function checkInfo() {
  let task;
  let allTask;

  if (true) {
    const { data } = await axios.get('/api/task');

    task = data.map((task) => {
      if (task.assigned == 'unassigned') {
        return task.name;
      }
    });

    allTask = data.map((task) => {
      return task.name;
    });
  }

  if (true) {
    let { data } = await axios.get('/api/people');
    data.map((person) => {
      for (let i = 0; i < task.length; i++) {
        if (person.task == task[i]) {
          fetch(`/api/people/${person.userID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: 'none' }),
          });
        }
      }

      let find = false;
      for (let i = 0; i < allTask.length; i++) {
        if (allTask[i] == person.task) {
          find = true;
        }
      }
      if (find == false) {
        fetch(`/api/people/${person.userID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'none' }),
        });
      }
    });
  }
}

const fetchTask = async () => {
  try {
    const { data } = await axios.get('/api/task');
    console.log(data);

    const task = data.map((tasks) => {
      return `<option value="${tasks.name}">${tasks.name}</option>`;
    });

    results.innerHTML = task.join('');

    change();
    newTask.value = '';
    newDesc.value = '';
    newAssign.value = '';
  } catch (e) {
    // formAlert.textContent = e.response.data.msg;
  }
};

fetchTask();
