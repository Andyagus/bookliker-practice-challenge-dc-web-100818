document.addEventListener("DOMContentLoaded", function() {
  fetchAllBooks()
});

// FETCH
function fetchAllBooks() {
  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => data.forEach(renderBookList))
}

function showBook(e) {
  e.preventDefault()
  let id = e.target.id.split('-')[1]
  fetch(`http://localhost:3000/books/${id}`)
    .then(res => res.json())
    .then(data => renderBookInfo(data))
}

function addLike(e, book) {
  e.preventDefault()
  let users = book.users
  let obj = {users: [{id: 1, username: "pouros"}, ...users]}
  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(data => {renderBookInfo(data)})
}

function unlike(e, book) {
  e.preventDefault()
  let obj = findEl(book.users)
  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({users: obj})
  })
    .then(res => res.json())
    .then(data => renderBookInfo(data))
}

// RENDER
function renderBookList(book) {
  let li = document.createElement('li')
  li.id = `list-${book.id}`
  li.innerText = book.title
  li.addEventListener('click', showBook)
  getList().append(li)
}

function renderBookInfo(book) {
  getShowPanel().innerHTML = ""
  let div = document.createElement('div')
  div.id = `card-${book.id}`

  let title = document.createElement('h2')
  title.innerText = book.title

  let description = document.createElement('p')
  description.innerText = book.description

  let img = document.createElement('img')
  img.src = book.img_url

  let likeBtn = document.createElement('button')
  likeBtn.id = 'like-btn'
  likeBtn.dataset.id = book.id
  likeBtn.addEventListener('click', (e) => {likeUnlike(e, book)})

  let h4 = document.createElement('h4')
  h4.innerHTML = 'Liked by:'

  let likesList = document.createElement('ul')
  likesList.id = 'likes-list'

  getShowPanel().appendChild(div)
  div.append(title, description, img, likeBtn, h4, likesList)
  renderLikes(book)
  likeBtnText(book)
}

function renderLikes(book) {
  getLikesList().innerHTML = ""
  likeBtnText(book)
  book.users.forEach(function(user){
    let li = document.createElement('li')
    li.innerText = user.username
    li.id = `user-${user.id}`
    getLikesList().appendChild(li)
  })
}

function likeUnlike(e, book) {
  e.preventDefault()
  if (book.users.some((b) => {return b.id===1})) {
    getLikeBtn().innerText = 'Unlike'
    unlike(e, book)
  } else {
    getLikeBtn().innerText = 'Like'
    addLike(e, book)
  }
}

function likeBtnText(book) {
  if (book.users.some((e) => {return e.id ===1})) {
    getLikeBtn().innerText = 'Unlike'
  } else {
    getLikeBtn().innerText = 'Like'
  }
}

function findEl(arr) {
  for(i=0; i < (arr.length); i++) {
	   if (arr[i].id === 1) {
	      arr.splice(i, 1)
      }
      return arr
    }
}

// GET ELEMENT
function getList() {
  return document.querySelector('#list')
}

function getShowPanel() {
  return document.querySelector('#show-panel')
}

function getLikeBtn() {
  return document.querySelector('#like-btn')
}

function getLikesList() {
  return document.querySelector('#likes-list')
}
