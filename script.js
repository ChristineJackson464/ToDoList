const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// ITEMS
let updatedOnLoad = false;

// INITIALIZE ARRAYS
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// DRAG FUNCTIONALITY
let draggedItem;
let dragging = false;
let currentColumn;

// GET ARRAYS FROM localStorage IF AVAILABLE, SET DEFAULT VALUES IF NOT
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
arrayNames.forEach((arrayName, index) => {
  localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
});
}

// FILTER ARRAYS TO REMOVE EMPTY VALUES
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}


// CREATE DOM ELEMENTS FOR EACH LIST ITEM
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // APPEND
  columnEl.appendChild(listEl);
}

// UPDATE COLUMNS IN DOM - RESET HTML, FILTER ARRAY, UPDATE localStorage
function updateDOM() {
  // CHECK localStorage ONCE
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // BACKLOG COLUMN
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // PROGRESS COLUMN
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // COMPLETE COLUMN
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // ON HOLD COLUMN
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // RUN savedColumns ONLY ONCE, UPDATE localStorage
  updatedOnLoad = true;
  updateSavedColumns();
}

// UPDATE ITEM- DELETE IF NECESSARY, OR UPDATE ARRAY VALUE
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[i].textContent;
    }
    updateDOM();
  }
}

// ADD TO COLUMN LIST, RESET TEXT-BOX
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// SHOW ADD ITEM INPUT BOX
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// HIDE ADD ITEM INPUT BOX
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// ALLOWS ARRAYS TO REFLECT DRAG & DROP ITEMS
function rebuildArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
    }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
    }
  completeListArray = [];  
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
    }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
    }
    updateDOM();
}

// WHEN ITEM ENTERS COLUMN AREA
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// WHEN ITEM STARTS DRAGGING
function drag (e) {
  draggedItem = e.target;
  dragging = true;
}

// COLUMNS ALLOWS FOR ITEM TO DROP
function allowDrop(e) {
  e.preventDefault();
}

// DROP ITEM IN COLUMN
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  // REMOVE BCKGRD-COLOR/PADDING
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // ADD ITEM TO COLUMN
  parent.appendChild(draggedItem);
  rebuildArrays();
  // DRAGGING COMPLETE
  dragging = false;
  rebuildArrays();
}

// ON LOAD
updateDOM();

