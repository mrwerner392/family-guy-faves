const wrapper = document.querySelector(".wrapper");

fetch("http://localhost:3000/users")
.then(res => res.json())
.then(usersObj => {usersObj.forEach(user => makeUserDiv(user))});

// Helper to make div for each user and fill it with appropriate info
function makeUserDiv(user) {

  // Create user div
  let userDiv = document.createElement("div");
  userDiv.classList.add("user")

  // Create and add a header to the user div
  let userDivHeader = makeHeader(user.name, "h2", "user-head");
  userDiv.append(userDivHeader);

  // Create a container for favorite characters and quotes
  let favoritesContainer = document.createElement("div");
  favoritesContainer.classList.add("favs-container");

  // Create div for favorite characters
  let favoriteCharsDiv = document.createElement("div");
  favoriteCharsDiv.classList.add("fav-chars");

  // Create and add a header to the favorite characters div
  let charsDivHeader = makeHeader("Favorite Characters", "h4", "fav-chars-head");
  favoriteCharsDiv.append(charsDivHeader);

  // Create a ul for favorite characters
  let charsList = document.createElement("ul");
  charsList.classList.add("fav-chars-list");

  // Create li's for each character and add them to the ul
  addToCharsList(charsList, user.characters);

  // Create div for favorite quotes
  let favoriteQuotesDiv = document.createElement("div");
  favoriteQuotesDiv.classList.add("fav-quotes");

  // Create and add a header to the favorite quotes div
  let quotesDivHeader = makeHeader("Favorite Quotes", "h4", "fav-quotes-head");
  favoriteQuotesDiv.append(quotesDivHeader);

  // Create a ul for favorite quotes
  let quotesList = document.createElement("ul");
  quotesList.classList.add("fav-quotes-list");
  quotesList.dataset.userId = user.id

  // Create li's for each quote and add them to the ul
  addToQuotesList(quotesList, user.quotes);

  // Add ul's to respective divs, and add divs to favs container
  favoriteCharsDiv.append(charsList);
  favoriteQuotesDiv.append(quotesList);
  favoritesContainer.append(favoriteCharsDiv, favoriteQuotesDiv);

  // Create and add form for new character
  newForm("character", user, charsList)

  // Create and add form for new quote
  newForm("quote", user, quotesList)

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

function addToCharsList(charsList, characters) {
  characters.forEach(char => {
    let li = document.createElement("li")
    li.innerText = `${char.name} `;
    li.classList.add("character");
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "x";
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

function addToQuotesList(quotesList, quotes) {
  quotes.forEach(quote => {
    let li = document.createElement("li")
    li.innerText = `${quote.content} `;
    li.classList.add("quote");
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "x";
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

function makeSingleLi(obj, liForThis) {
  let li = document.createElement("li");
  obj.content ? li.innerText = obj.content : li.innerText = obj.name;
  li.classList.add(liForThis);

  let deleteButton = document.createElement("button");
  deleteButton.innerText = "x";
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
  let formContentInput = document.createElement("input");
  formContentInput.type = "text";
  formContentInput.name = objectOfForm;
  formContentInput.placeholder = `New fav ${objectOfForm} here...`;
  let formSubmit = document.createElement("input");
  formSubmit.type = "submit";
  formSubmit.value = "add";
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
        let li = makeSingleLi(newObj, objectOfForm)
        list.append(li);
        form.reset();
      } else {
        alert(newObj.error);
      };
    })
  })


  list.parentNode.append(form);
}
