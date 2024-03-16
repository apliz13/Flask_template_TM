const inputs = document.querySelectorAll("input");
const todosHtml = initializeTodosHtml();
let todosJson = {"sets": [], "sauts": [], "pirouettes": [], "moitie_de_programme": [], "programmes": []};
const deleteAllButton = document.querySelectorAll(".delete-all");
const selects = document.querySelectorAll("select");
const changePageButton = document.querySelectorAll(".change-page-button");
const PAGE = document.querySelectorAll(".container_prof, .container_rose")
const validationButton = document.querySelector(".validation-button");
const TEAMS = document.querySelectorAll(".teamCard_big2");
const STUDENTS = document.querySelectorAll(".studentCard");
const stsqchsq = Array.from(document.querySelectorAll("input#StSq, input#ChSq"));
let selected_teams = [];
let selected_users = [];

for (const listName in todosJson) {
showTodos(listName);
}

inputs.forEach(input => {
  input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  e.target.value = "";
  addTodo(todo, e.target.id);
});})

deleteAllButton.forEach(button => {button.addEventListener("click", () => {
  const listName = button.parentElement.parentElement.childNodes[3].childNodes[1].id;
  todosJson[listName] = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos(listName);
})});

selects.forEach(select => {select.addEventListener("change", e => {
    let todo = select.value;
    if (!todo) {
      return;
    }
    e.target.value = "";
    addTodo(todo, e.target.id);
  
})});

changePageButton.forEach(button => {button.addEventListener("click", e => {
  PAGE.forEach(page => {
    if (e.currentTarget.id.includes(page.id)) {
    page.classList.remove("hide")}
    else {
      page.classList.add("hide")
    };})})});

validationButton.addEventListener("click", () => {
  temp_elements = {}
  let i = 0;
  Object.values(todosJson).forEach(elem => {
    temp_elements[i] = elem.map(input => input.name);
    i++;
  });
  temp_elements[i] = stsqchsq.filter((input) => input.checked).map(input => input.value);
  day = new Date().getDate()
  if (day < 10) {day = "0" + day}
  month = new Date().getMonth() + 1
  if (month < 10) {month = "0" + month}
  fetch(window.location.href, 
    {method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
      date: day + '-' + month + '-' + new Date().getFullYear(),
      elements: temp_elements,
      id_teams: selected_teams,
      id_users: selected_users
      }
      )
    })});

  TEAMS.forEach(team => {team.addEventListener("click", e => {
    if (e.currentTarget.classList.contains("selected")) {
      e.currentTarget.classList.remove("selected");
      selected_teams = selected_teams.filter(team => team != e.currentTarget.getAttribute("teamid"));
    } else {
      e.currentTarget.classList.add("selected");
      selected_teams.push(e.currentTarget.getAttribute("teamid"));
    }
  })});

  STUDENTS.forEach(student => {student.addEventListener("click", e => {
    if (e.currentTarget.classList.contains("selected")) {
      e.currentTarget.classList.remove("selected");
      selected_users = selected_users.filter(user => user != e.currentTarget.getAttribute("studentid"));
    } else {
      e.currentTarget.classList.add("selected");
      selected_users.push(e.currentTarget.getAttribute("studentid"));
    }
  })});

function initializeTodosHtml() {
  let todosHtml = document.querySelectorAll(".todos");
  return {"sets": todosHtml[0], "sauts": todosHtml[1], "pirouettes": todosHtml[2], "moitie_de_programme": todosHtml[3], "programmes": todosHtml[4]};
}

function getTodoHtml(todo, index) {
  return /* html */ `
    <li class="todo">
      <span>${todo.name}</span>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i style="font-style:normal;">x</i></button>
    </li>
  `; 
}

function showTodos(listName) {
  if (todosJson[listName].length == 0) {
    todosHtml[listName].innerHTML = '';
  } else {
    todosHtml[listName].innerHTML = todosJson[listName].map(getTodoHtml).join('');
  }
}

function addTodo(todo, listName)  {
  todosJson[listName].unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson[listName]));
  showTodos(listName);
}

function remove(todo, listName="pirouettes") {
  try {
    listName = todo.parentElement.parentElement.parentElement.parentElement.childNodes[3].childNodes[1].id;
  }
  catch {}
  const index = todo.dataset.index;
  todosJson[listName].splice(index, 1);
  showTodos(listName);
  localStorage.setItem("todos", JSON.stringify(todosJson[listName]));
}


