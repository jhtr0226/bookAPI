const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const isAuthenticated = require('../middleware/authenticate');

router.get('/books', booksController.getAllBooks);
router.get('/books/:id', booksController.getBookById);
router.post('/books',isAuthenticated, booksController.validateBook,
    booksController.checkValidation, booksController.createBook);

router.put('/books/:id', isAuthenticated, booksController.validateBookForUpdate,
    booksController.checkValidation, booksController.updateBook);
    
router.delete('/books/:id',isAuthenticated, booksController.deleteBook);

module.exports = router;
