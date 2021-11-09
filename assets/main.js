const inputField = document.querySelector(".todo-input");
const addButton = document.querySelector(".todo-input-button");
const todoList = document.querySelector(".todo-list");
const descriptionText = document.querySelector(".description-text");

const addTextDescription = "Just write your TO-DO and click on the ADD button";

class Todo {
  constructor(id, text, isdone) {
    this.id = id;
    this.text = text;
    this.isdone = isdone;
  }
}

class UI {
  static displayTodos() {
    const todos = Storage.getTodos();

    todos.forEach((todo) => {
      UI.addTodoToList(todo);
    });
  }

  static addTodoToList(todo) {
    const newLi = document.createElement("li");
    newLi.className = "todo-list-item grid grid-three-col text-white";
    newLi.innerHTML = `<input id="checkbox" type="checkbox" />${todo.text}<input class = "todo-list-button" type="button" value="X" />`;
    newLi.id = `todo-list-item=${todo.id}`;
    newLi.setAttribute(`${todo.isdone ? "isdone" : null}`, "");
    newLi.children[0].setAttribute(`${todo.isdone ? "checked" : null}`, null);
    todoList.appendChild(newLi);
  }

  static clearInputField() {
    inputField.value = "";
  }

  static deleteTodo(element) {
    const parentElement = element.target.parentElement;
    const elementId = parentElement.id.match(/\d+/g);
    if (element.target && element.target.className == "todo-list-button") {
      parentElement.remove();
      Storage.removeTodo(parseInt(elementId[0]));
    }
  }

  static isdoneTodoToggle(element) {
    const parentElement = element.target.parentElement;
    const elementId = parentElement.id.match(/\d+/g);
    if (element.target && element.target.id == "checkbox") {
      parentElement.toggleAttribute("isdone");
      Storage.isDoneToggle(
        parseInt(elementId[0]),
        parentElement.getAttribute("isdone")
      );
    }
  }

  static removeAll() {
    todoList.innerHTML = "";
    Storage.removeAll();
  }
}

class Storage {
  static setItem(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  static getTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
  }

  static setTodo(todo) {
    const todos = this.getTodos();
    todos.push(todo);
    Storage.setItem(todos);
  }

  static removeTodo(id) {
    const todos = this.getTodos();
    todos.forEach((todo, index) => {
      if (todo.id === id) {
        todos.splice(index, 1);
      }
    });
    Storage.setItem(todos);
  }

  static isDoneToggle(id, cond) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      if (todo.id === id) {
        if (cond === null || cond === false || cond !== "") {
          todo.isdone = false;
        } else {
          todo.isdone = true;
        }
      }
    });
    Storage.setItem(todos);
  }

  static removeAll() {
    const todos = [];
    Storage.setItem(todos);
  }
}

document.addEventListener("DOMContentLoaded", UI.displayTodos);

document.querySelector(".todo-input-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const textField = inputField.value;
  if (textField === "") return;
  descriptionText.remove();
  const today = new Date();
  const date =
    today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
  const randId = Math.floor(
    ((today.getTime() / today.getMilliseconds()) * today.getDate()) / 100
  );

  const todo = new Todo(randId, textField, false);
  UI.addTodoToList(todo);
  Storage.setTodo(todo);
  UI.clearInputField();
});

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("todo-list-button")) {
    UI.deleteTodo(e);
  }

  if (e.target.id === "checkbox") {
    UI.isdoneTodoToggle(e);
  }
});

document.querySelector("#remove-all-button").addEventListener("click", (e) => {
  e.preventDefault();
  UI.removeAll();
  descriptionText.textContent = addTextDescription;
});
