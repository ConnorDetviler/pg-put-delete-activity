$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  $('#bookShelf').on('click', '.delete-btn', deleteBook);

  $('#bookShelf').on('click', '.book-read-btn', markAsRead);

  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

function deleteBook() {
  const id = $(this).closest('tr').data('id');
  console.log(id);
  $.ajax({
    type: 'DELETE',
    url: `/books/${id}`
  }).then(function(response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function(error) {
    console.log('Error in DELETE', error)
  });
}

function markAsRead() {
  console.log('clicked');
  const id = $(this).closest('tr').data('id');
  console.log(id);
  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    data: {status: 'read'}
  }).then(function(response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function(error) {
    console.log('Error in PUT', error);
  });
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr data-id=${book.id}></tr>`);
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td><button class="delete-btn">Delete</button></td>`)
    $tr.append(`<td>${book.status}<button class="book-read-btn">mark as read</button></td>`);
    $('#bookShelf').append($tr);
  }
}
