const inputs = document.querySelectorAll("input");
const todosHtml = initializeTodosHtml();
let todosJson = {"sets": [], "sauts": [], "programme": [], "moitie_de_programme": [], "pirouettes": []};
const deleteAllButton = document.querySelectorAll(".delete-all");
const selects = document.querySelectorAll("select");

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

function initializeTodosHtml() {
  let todosHtml = document.querySelectorAll(".todos");
  return {"sets": todosHtml[0], "sauts": todosHtml[1], "programme": todosHtml[2], "moitie_de_programme": todosHtml[3], "pirouettes": todosHtml[4]};
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


