const todoThemeIcon = document.querySelector(".todo-theme-icon");
const todoContainer = document.querySelector(".todo-container");
const input = document.querySelector("input");
const todoItemList = document.querySelector(".todo-item-list");
const todoItemCircles = document.querySelectorAll(".todo-item .circle");
const leftItems = document.querySelector(".left-items");
const clearCompletedBtn = document.querySelector(".clear-completed-btn");
const btnAll = document.querySelector(".btn-all");
const btnActive = document.querySelector(".btn-active");
const btnCompleted = document.querySelector(".btn-completed");

const localStorageKey = "fuhuahu-todolist-javascript";
let data = [];

window.addEventListener("load", getData);

input.addEventListener("keydown", (e) => addNewTodo(e));

todoThemeIcon.addEventListener("click", toggleTheme);

clearCompletedBtn.addEventListener("click", clearCompleted);

btnAll.addEventListener("click", () => {
  btnActive.classList.remove("active");
  btnCompleted.classList.remove("active");
  btnAll.classList.add("active");
  const todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach((todoItem) => (todoItem.style.display = "flex"));
});

btnActive.addEventListener("click", () => {
  btnAll.classList.remove("active");
  btnCompleted.classList.remove("active");
  btnActive.classList.add("active");
  const todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach(
    (todoItem) =>
      (todoItem.style.display = todoItem.classList.contains("completed")
        ? "none"
        : "flex")
  );
});

btnCompleted.addEventListener("click", () => {
  btnAll.classList.remove("active");
  btnActive.classList.remove("active");
  btnCompleted.classList.add("active");
  const todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach(
    (todoItem) =>
      (todoItem.style.display = todoItem.classList.contains("completed")
        ? "flex"
        : "none")
  );
});

function clearCompleted() {
  data = data.filter((todoItem) => !todoItem.completed);
  setData();
}

function activeTotal() {
  return data.reduce((total, item) => total + !item.completed, 0);
}

function toggleTheme() {
  if (todoContainer.classList.contains("light")) {
    todoContainer.classList.remove("light");
    todoContainer.classList.add("dark");
  } else {
    todoContainer.classList.remove("dark");
    todoContainer.classList.add("light");
  }
}

function getData() {
  data = JSON.parse(localStorage.getItem(localStorageKey));
  insertDataToTodo(data);

  leftItems.innerText = activeTotal();
}
function setData() {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
  getData();
}
function addNewTodo(e) {
  if (e.key === "Enter" && e.target.value.trim().length > 0) {
    if (data === null) data = [];
    data.push({
      content: e.target.value.trim(),
      completed: false,
      id: Date.now(),
    });

    e.target.value = "";
    setData();
  }
}

function toggleComplete(element, id) {
  element.classList.toggle("completed");
  const completed = element.classList.contains("completed");
  data.forEach((item) => {
    if (item.id === id) {
      item.completed = completed;
    }
    return item;
  });
  setData();
}

function deleteTodo(id) {
  data = data.filter((item) => item.id !== id);
  setData();
}
let dragableWarppers = [];

function insertDataToTodo(data) {
  todoItemList.innerHTML = "";
  dragableWarppers = [];
  data?.forEach((todo, i) => {
    const dragableWarpper = document.createElement("div");
    dragableWarpper.classList.add("dragable-warpper");
    const element = document.createElement("div");
    dragableWarpper.appendChild(element);

    element.setAttribute("data-index", i);
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("drop", handleDrop);
    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("dragleave", handleDragLeave);

    element.draggable = true;
    element.classList.add("todo-block");
    element.classList.add("todo-item");
    if (todo.completed) {
      element.classList.add("completed");
    }
    const todoItemLeftElement = document.createElement("div");
    todoItemLeftElement.classList.add("todo-item-left");

    const circleElement = document.createElement("div");
    circleElement.classList.add("circle");
    circleElement.innerHTML =
      '<img src="./images/icon-check.svg" alt="icon-check" />';
    circleElement.addEventListener("click", () =>
      toggleComplete(element, todo.id)
    );

    const contentElement = document.createElement("p");
    contentElement.innerText = todo.content;

    todoItemLeftElement.appendChild(circleElement);
    todoItemLeftElement.appendChild(contentElement);

    const iconCrossElement = document.createElement("img");
    iconCrossElement.src = "./images/icon-cross.svg";
    iconCrossElement.alt = "icon-cross";
    iconCrossElement.addEventListener("click", () => deleteTodo(todo.id));

    element.appendChild(todoItemLeftElement);
    element.appendChild(iconCrossElement);
    todoItemList.appendChild(dragableWarpper);

    dragableWarppers.push(dragableWarpper);
  });
}
let drapStartIndex;
function handleDragStart(e) {
  drapStartIndex = this.getAttribute("data-index");
}
function handleDrop() {
  const drapEndIndex = this.getAttribute("data-index");

  swapItems(drapStartIndex, drapEndIndex);
  this.classList.remove("dragging");
}

function handleDragEnter() {
  this.classList.add("dragging");
}

function handleDragLeave() {
  this.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
}

function swapItems(fromIndex, toIndex) {
  const itemOne = dragableWarppers[fromIndex].querySelector(".todo-item");
  const itemTwo = dragableWarppers[toIndex].querySelector(".todo-item");

  const mid = data[fromIndex];
  data[fromIndex] = data[toIndex];
  data[toIndex] = mid;
  setData();
}
