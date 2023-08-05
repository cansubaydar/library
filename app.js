const bookForm = document.querySelector('.form'); 
const book_title = document.querySelector('#title');
const book_author = document.querySelector('#author');
const book_pages = document.querySelector('#pages');
const book_status = document.querySelector('.status-button input[name=status]'); 
const bookContainer = document.querySelector('.book-container'); 
const addBooks = document.querySelectorAll('.add-book'); 
const formContainer = document.querySelector('.form-container'); 
let myLibrary = []; 

// book object constructor 
function Book (title, author, pages, status) {
    this.title = title; 
    this.author = author;
    this.pages = pages;
    this.status = status; 
  }

// add book to library with form input
function addBookToLibrary() {
  const readOrUnread = document.getElementsByName('status');
  let bookStatus; 

  for(let i = 0; i < readOrUnread.length; i++) {
    if(readOrUnread[i].checked) {
      bookStatus = readOrUnread[i].value;
    }
  }
  // create new object
  let newBook = new Book(book_title.value, book_author.value, book_pages.value, bookStatus); 
  newBook.id = Math.floor(Math.random() * 1000); 
  myLibrary.push(newBook); 
  createBookCards(newBook); 
  clearForm(); 
}

// create book cards 
const createBookCards = (book) => {
  const bookCards = document.createElement('div');
  bookCards.classList.add('book-cards'); 
  bookCards.dataset.id = book.id;

  const bookInfo = document.createElement('div'); 
  bookInfo.classList.add('book-info');

  const title = document.createElement('p'); 
  title.classList.add('title'); 
  title.textContent = book.title; 

  const author = document.createElement('p'); 
  author.classList.add('author'); 
  author.textContent = book.author;

  const pages = document.createElement('p');
  pages.classList.add('pages');
  pages.textContent = `${book.pages} pages`; 

  const deleteButton = document.createElement('div');
  deleteButton.classList.add('delete-button'); 

  const deleteIcon = document.createElement('img'); 
  deleteIcon.classList.add('delete');
  deleteIcon.src = 'assets/x-bold.svg'; 
  deleteIcon.alt = 'delete-icon';

  const switchButton = document.createElement('div');
  switchButton.classList.add('switch-button');

  const readButton = document.createElement('button'); 
  readButton.textContent = book.status;
  if(book.status == 'unread') { 
    readButton.classList.add('unread');
  }else if(book.status == 'read') { 
    readButton.classList.add('read');
  };

  switchButton.append(readButton); 
  bookInfo.append(title, author, pages);
  bookCards.append(bookInfo, switchButton, deleteButton); 
  deleteButton.append(deleteIcon); 
  bookContainer.append(bookCards); 

  // change read status
  readButton.addEventListener('click', (e) => {
    let cardId = e.target.closest('.book-cards').dataset.id;
    let obj = myLibrary[myLibrary.findIndex(x => x.id == cardId)];

    if(e.target.textContent == 'read') { 
      e.target.classList.remove('read');
      e.target.classList.add('unread');
      e.target.textContent = 'unread';
      obj.status = 'unread';
    } else if (e.target.textContent == 'unread') { 
      e.target.classList.remove('unread');
      e.target.classList.add('read');
      e.target.textContent = 'read';
      obj.status = 'read';
    }
    localStorage.setItem('books', JSON.stringify(myLibrary));
  })  
  // save book cards to local storage 
  localStorage.setItem('books', JSON.stringify(myLibrary));
  listeners();
}

// clear form input
const clearForm = () => {
  book_title.value = '';
  book_author.value = '';
  book_pages.value = '';
}

// event listeners for buttons
const listeners = () => {
  const deleteButton = document.querySelectorAll('.delete'); 
  const cancelButton = document.querySelectorAll('.cancel-button');

  // cancel form input
  cancelButton.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); 
      formContainer.style.display = 'none'; 
    })
  })
  
  // delete book card 
  deleteButton.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let card = e.target.closest('.book-cards');
      let bookId = card.dataset.id;
      let bookIndex = myLibrary[myLibrary.findIndex(b => b.id == bookId)];
      myLibrary = myLibrary.filter(e => e !== bookIndex);
      card.remove();
      localStorage.setItem('books', JSON.stringify(myLibrary));
    }) 
  })
}

// get books from local storage 
if(localStorage.getItem('books') !== null) {
  myLibrary = JSON.parse(localStorage.getItem('books'));
  myLibrary.forEach(createBookCards);
} else {
  myLibrary = []; 
}

// open form modal 
addBooks.forEach(addBook => {
  addBook.addEventListener('click', () => {
    formContainer.style.display = 'inline-flex';
    clearForm();
    book_status.checked = 'read';
  }) 
}) 

// submit form entries to add book
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addBookToLibrary(); 
  formContainer.style.display = 'none';
})

listeners();