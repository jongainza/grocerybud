// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
//load items
window.addEventListener("DOMContentLoaded", loadItems());
// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearList);
// edit or delate item
list.addEventListener("click", editItem);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createItem(id, value);
    displayAlert("Item added to the list", "success");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("item updated", "success");
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    displayAlert("empty value", "danger");
  }
}

function displayAlert(text, action) {
  alert.classList.add(`alert-${action}`);
  alert.textContent = text;

  setTimeout(function () {
    alert.classList.remove(`alert-${action}`);
    alert.textContent = "";
  }, 1000);
}
// clear list
function clearList() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  localStorage.removeItem("list");
  displayAlert("all items delated from the list", "danger");
  setBackToDefault();
}
// edit item
function editItem(e) {
  let btn = e.target.parentElement;
  let item = btn.parentElement.parentElement;
  let itemId = item.dataset.id;

  if (btn.classList.contains("delete-btn")) {
    if (item) {
      list.removeChild(item);
      if (list.children.length === 0) {
        container.classList.remove("show-container");
      }
      displayAlert("item delated", "danger");
      setBackToDefault();
      // remove from local storage
      removeFromLocalStorage(itemId);
    } else {
      console.log("item not found");
    }
  } else if (btn.classList.contains("edit-btn")) {
    editElement = btn.parentElement.previousElementSibling;
    editFlag = true;
    editId = itemId;
    grocery.value = editElement.textContent;
    submitBtn.textContent = "edit";
  }
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const item = { id, value };
  const list = getLocalStorage();
  list.push(item);
  localStorage.setItem("list", JSON.stringify(list));
}
function removeFromLocalStorage(id) {
  const list = getLocalStorage();
  const newList = list.filter(function (item) {
    return item.id !== id;
  });
  localStorage.setItem("list", JSON.stringify(newList));
}
function editLocalStorage(id, value) {
  let list = getLocalStorage();
  list = list.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(list));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// ****** SETUP ITEMS **********
function loadItems() {
  const items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items.forEach(function (item) {
    createItem(item.id, item.value);
  });
}
function createItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  element.setAttribute("data-id", id);
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  list.appendChild(element);
  container.classList.add("show-container");
}
