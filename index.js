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
  let id = book.id
  let users = book.users
  let obj = {users: [{id: 1, username: "pouros"}, ...users]}
  fetch(`http://localhost:3000/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(data => renderLikes(data))
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
  likeBtn.addEventListener('click', (e) => {addLike(e, book)})
  likeBtn.innerText = 'Like'
  let h4 = document.createElement('h4')
  h4.innerHTML = 'Liked by:'
  let likesList = document.createElement('ul')
  likesList.id = 'likes-list'
  getShowPanel().appendChild(div)
  div.append(title, description, img, likeBtn, h4, likesList)
  renderLikes(book)
}

function renderLikes(book) {
  getLikesList().innerHTML = ""
  book.users.forEach(function(user){
    let li = document.createElement('li')
    li.innerText = user.username
    li.id = `user-${user.id}`
    getLikesList().appendChild(li)
  })
}

// GET ELEMENT
function getList() {
  return document.querySelector('#list')
}

function getShowPanel() {
  return document.querySelector('#show-panel')
}

function getLikesList() {
  return document.querySelector('#likes-list')
}
