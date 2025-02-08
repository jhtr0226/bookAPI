const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');
const isAuthenticated = require('../middleware/authenticate');

router.get('/authors', authorsController.getAllAuthors);
router.get('/authors/:id', authorsController.getAuthorById);
router.post('/authors', isAuthenticated, authorsController.validateAuthor,
    authorsController.checkValidation, authorsController.createAuthor);

router.put('/authors/:id', isAuthenticated, authorsController.validateAuthorForUpdate,
    authorsController.checkValidation, authorsController.updateAuthor);
    
router.delete('/authors/:id', isAuthenticated, authorsController.deleteAuthor);

module.exports = router;
