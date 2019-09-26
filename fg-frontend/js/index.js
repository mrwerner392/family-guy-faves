const wrapper = document.querySelector(".wrapper");
let draggedEl = {};

fetch("http://localhost:3000/users")
.then(res => res.json())
.then(usersObj => {usersObj.forEach(user => makeUserDiv(user))});

// Helper to make div for each user and fill it with appropriate info
function makeUserDiv(user) {

  // Create user div
  let userDiv = document.createElement("div");
  userDiv.classList.add("user", "draggable");
  userDiv.dataset.userId = user.id;
  userDiv.draggable = true;

  addDragAndDropEvents(userDiv);

  // Create and add a header to the user div
  let userDivHeader = makeHeader(user.name, "h2", "user-head");
  userDivHeader.dataset.id = user.id;
  userDiv.append(userDivHeader);

  // Create a container for favorite characters and quotes
  let favoritesContainer = document.createElement("div");
  favoritesContainer.classList.add("favs-container");
  favoritesContainer.dataset.id = user.id;

  // Create div for favorite characters
  let favoriteCharsDiv = document.createElement("div");
  favoriteCharsDiv.classList.add("fav-chars");
  favoriteCharsDiv.dataset.id = user.id;

  // Create and add a header to the favorite characters div
  let charsDivHeader = makeHeader("Favorite Characters", "h3", "fav-chars-head");
  charsDivHeader.dataset.id = user.id;
  favoriteCharsDiv.append(charsDivHeader);

  // Create a ul for favorite characters
  let charsList = document.createElement("ul");
  charsList.dataset.id = user.id;
  charsList.classList.add("fav-chars-list");

  // Create li's for each character and add them to the ul
  addToCharsList(charsList, user);

  // Create div for favorite quotes
  let favoriteQuotesDiv = document.createElement("div");
  favoriteQuotesDiv.classList.add("fav-quotes");
  favoriteQuotesDiv.dataset.id = user.id;

  // Create and add a header to the favorite quotes div
  let quotesDivHeader = makeHeader("Favorite Quotes", "h3", "fav-quotes-head");
  quotesDivHeader.dataset.id = user.id;
  favoriteQuotesDiv.append(quotesDivHeader);

  // Create a ul for favorite quotes
  let quotesList = document.createElement("ul");
  quotesList.classList.add("fav-quotes-list");
  quotesList.dataset.userId = user.id

  // Create li's for each quote and add them to the ul
  addToQuotesList(quotesList, user);

  // Add ul's to respective divs, and add divs to favs container
  favoriteCharsDiv.append(charsList);
  favoriteQuotesDiv.append(quotesList);
  favoritesContainer.append(favoriteCharsDiv, favoriteQuotesDiv);

  // Create and add form for new character
  newForm("character", user, charsList)

  // Create and add form for new quote
  newForm("quote", user, quotesList);

  // Add favorites container to user div
  userDiv.append(favoritesContainer);

  // Add user div to wrapper
  wrapper.append(userDiv);

}

function makeHeader(headerText, headerType, className) {
  let newHeader = document.createElement(headerType);
  newHeader.innerText = headerText;
  newHeader.classList.add(className);
  return newHeader;
}

function addToCharsList(charsList, user) {
  user.characters.forEach(char => {
    let li = document.createElement("li")
    li.innerText = `${char.name} `;
    li.classList.add("character");
    li.dataset.id = user.id;
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "x";
    deleteButton.dataset.id = user.id;
    deleteButton.addEventListener("click", () => {
      fetch(`http://localhost:3000/characters/${char.id}`, {
        method: "DELETE"
      }).then(res => res.json())
      .then(json => {
        json.error ? alert(json.error) : li.remove();
      })
    })
    li.append(deleteButton);
    charsList.append(li);
  })
}

function addToQuotesList(quotesList, user) {
  user.quotes.forEach(quote => {
    let li = document.createElement("li")
    li.innerText = `${quote.content} `;
    li.classList.add("quote");
    li.dataset.id = user.id;
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "x";
    deleteButton.dataset.id = user.id;
    deleteButton.addEventListener("click", () => {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
      }).then(res => res.json())
      .then(json => {
        json.error ? alert(json.error) : li.remove();
      })
    })
    li.append(deleteButton);
    quotesList.append(li);
  })
}

function makeSingleLi(obj, liForThis, user) {
  let li = document.createElement("li");
  obj.content ? li.innerText = `${obj.content} ` : li.innerText = `${obj.name} `;
  li.classList.add(liForThis);
  li.dataset.id = user.id;

  let deleteButton = document.createElement("button");
  deleteButton.innerText = "x";
  deleteButton.dataset.id = user.id;
  deleteButton.addEventListener("click", () => {
    fetch(`http://localhost:3000/${liForThis}s/${obj.id}`, {
      method: "DELETE"
    }).then(res => res.json())
    .then(json => {
      json.error ? alert(json.error) : li.remove();
    })
  })
  li.append(deleteButton);

  return li;
}

function newForm(objectOfForm, user, list) {
  let form = document.createElement("form");
  form.dataset.id = user.id;
  let formContentInput = document.createElement("input");
  formContentInput.type = "text";
  formContentInput.name = objectOfForm;
  formContentInput.placeholder = `New fav ${objectOfForm} here...`;
  formContentInput.dataset.id = user.id;
  let formSubmit = document.createElement("input");
  formSubmit.type = "submit";
  formSubmit.value = "add";
  formSubmit.dataset.id = user.id;
  form.append(formContentInput, formSubmit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let input = e.target.querySelector(`input[name="${objectOfForm}"]`);
    let content = input.value
    fetch(`http://localhost:3000/${objectOfForm}s`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "content": content,
        "user_id": user.id
      })
    }).then(res => res.json())
    .then(newObj => {
      if (!newObj.error) {
        let li = makeSingleLi(newObj, objectOfForm, user)
        list.append(li);
        form.reset();
      } else {
        alert(newObj.error);
      };
    })
  })


  list.parentNode.append(form);
}

function addDragAndDropEvents(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
};

function dragStart(e) {
  draggedEl = e.target;
  draggedEl.style.opacity = '0.5';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData("text/html", draggedEl.innerHTML);
};

function dragEnter(e) {
  e.target.classList.add("over");
  // Add styling when something is being dragged
};

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

function dragLeave(e) {
  e.stopPropagation();
  e.target.classList.remove("over");
};

function dragDrop(e) {
  let draggedUserId = draggedEl.dataset.userId;
  let droppedOnUserId = e.target.dataset.id;
  let droppedOn = document.querySelector(`div[data-user-id='${droppedOnUserId}']`)
  if (draggedEl != droppedOn) {
    draggedEl.innerHTML = droppedOn.innerHTML;
    droppedOn.innerHTML = e.dataTransfer.getData('text/html');
    draggedEl.dataset.userId = droppedOnUserId;
    droppedOn.dataset.userId = draggedUserId;
  };
  return false;
};

function dragEnd(e) {
  let draggables = document.querySelectorAll(".draggable");
  draggables.forEach(draggable => {
    draggable.classList.remove("over");
    draggable.style.opacity = 1;
  });
};
