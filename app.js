class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {

        // const storageBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: '124125215'
        //     }, {
        //         title: 'Book Tow',
        //         author: 'Harry Doe',
        //         isbn: '12423520023'
        //     },
        // ];

        // GET FROM LOCAL STORAGE
        const books = Store.getBooks();

        books.forEach(book => {
            UI.addBookToList(book);
        });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {

        //create div
        const div = document.createElement('div');
        div.className = `alert - alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(function () {
            document.querySelector('.alert').remove()
        }, 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') == null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        let books = Store.getBooks();

        books.push(book);

        Store.storeBooks(books);
    }

    static deleteBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        Store.storeBooks(books);
    }

    static storeBooks(books) {
        localStorage.setItem('books', JSON.stringify(books));

    }
}

// DISPLAY BOOKS
document.addEventListener('DOMContentLoaded', function () {
    UI.displayBooks();
});

// Event - FORM
document.querySelector('#book-form').addEventListener('submit', function (e) {

    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    if (title === '' || author === '' || isbn === '') {

        UI.showAlert('Please fill all the required fields', 'danger');

    } else {

        const book = new Book(title, author, isbn);

        // add book to list
        UI.addBookToList(book);
        // Add book to store
        Store.addBook(book);

        UI.showAlert('New book has been added', 'success');
        UI.clearFields();

    }
});

// DELETE BOOK

document.querySelector('#book-list').addEventListener('click', function (e) {

    // remove book from uI
    UI.deleteBook(e.target);

    // remove book from store
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
    // show alert
    UI.showAlert('Book has been deleted', 'info');
});
