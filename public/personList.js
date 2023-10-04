const results = document.querySelector('.results');

const fetchPeople = async () => {
  try {
    const { data } = await axios.get('/api/people');
    console.log(data);

    const people = data.map((person) => {
      return `<option value="${person.name}">${person.name}</option>`;
    });

    results.innerHTML = people.join('');

    newName.value = '';
    newAge.value = '';
    newAssign.value = '';
    change();
  } catch (e) {
    // formAlert.textContent = e.response.data.msg;
  }
};
fetchPeople();

const btn = document.querySelector('.submit-btn');
const input = document.querySelector('.form-input');
const input2 = document.querySelector('#age');

const newName = document.querySelector('#newName');
const newAge = document.querySelector('#newAge');
const newAssign = document.querySelector('#newAssign');

const formAlert = document.querySelector('.form-alert');

const names = document.querySelector('.name');
const age = document.querySelector('.age');
const assignment = document.querySelector('.task');

let chosenName = '';
let chosenAge = '';
let chosenID;
let newTask = '';

async function change() {
  let { data } = await axios.get('/api/people');
  names.innerHTML = results.value;
  data.find((person) => {
    if (person.name == results.value) {
      age.innerHTML = `Age: ${person.age}`;
      assignment.innerHTML = `Task: ${person.task}`;
      sessionStorage.setItem('chosenName', results.value);
      sessionStorage.setItem('chosenAge', person.age);
      sessionStorage.setItem('chosenID', person.userID);
      sessionStorage.setItem('task', person.task);
      chosenID = person.userID;
    }
  });
}

function inputs() {
  newName.value = sessionStorage.getItem('chosenName');
  newAge.value = sessionStorage.getItem('chosenAge');
  newAssign.value = sessionStorage.getItem('task');
  chosenID = sessionStorage.getItem('chosenID');
  editMode = true;
}

btn.addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    if (!editMode) {
      let nameValue = input.value;
      let ageValue = input2.value;
      const { data } = await axios.post('/api/people', {
        name: nameValue,
        age: ageValue,
      });
      const h5 = document.createElement('h5');
      h5.textContent = data.person;
      results.appendChild(h5);
      fetchPeople();
      input.value = '';
      input2.value = '';
    } else {
      let nameChange = newName.value;
      let ageChange = newAge.value;

      let personTask = '';

      if (true) {
        const { data } = await axios.get('/api/people');
        data.map((person) => {
          if (person.name == nameChange) {
            personTask += person.task;
          }
        });
      }

      const { data } = await axios.get('/api/task');
      console.log(data);

      data.map((task) => {
        console.log(task);
        if (task.name == newAssign.value) {
          if (task.assigned == 'unassigned' && personTask == 'none') {
            newTask = task.name;
            fetch(`/api/task/${task.taskID}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ assigned: nameChange }),
            });
          } else if (personTask != 'unassigned') {
            newPerson = personTask;
          }
        }
      });

      if (newAssign.value == '') {
        newTask = 'none';
      }

      fetch(`/api/people/${chosenID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameChange,
          age: ageChange,
          task: newTask,
        }),
      });

      window.location.href = './people.html';
      fetchPeople();
      editMode = false;
    }
  } catch (e) {
    console.log(e);
  }
});

var editMode = false;
var currentId = '';

function nameAlter() {
  editMode = true;
  newName.value = chosenName;
  newAge.value = chosenAge;
}

let deleteThis = async (event) => {
  fetch(`/api/people/${chosenID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  fetchPeople();
};

async function infoPerson() {
  let { data } = await axios.get('/api/people');
  names.innerHTML = data[0].name;
  age.innerHTML = data[0].age;
  assignment.innerHTML = `Task: ${data[0].task}`;
}

async function checkInfo() {
  let person;
  let allPeople;

  if (true) {
    const { data } = await axios.get('/api/people');

    person = data.map((person) => {
      if (person.task == 'none') {
        return person.name;
      }
    });

    allPeople = data.map((person) => {
      return person.name;
    });
  }

  if (true) {
    let { data } = await axios.get('/api/task');
    data.map((task) => {
      for (let i = 0; i < person.length; i++) {
        if (task.assigned == person[i]) {
          fetch(`/api/task/${task.taskID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assigned: 'unassigned' }),
          });
        }
      }

      let find = false;
      for (let i = 0; i < allPeople.length; i++) {
        if (allPeople[i] == task.assigned) {
          find = true;
        }
      }
      if (find == false) {
        fetch(`/api/task/${task.taskID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assigned: 'unassigned' }),
        });
      }
    });
  }
}
