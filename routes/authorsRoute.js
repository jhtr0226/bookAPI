const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');

router.get('/authors', authorsController.getAllAuthors);
router.get('/authors/:id', authorsController.getAuthorById);
router.post('/authors', authorsController.validateAuthor,
    authorsController.checkValidation, authorsController.createAuthor);

router.put('/authors/:id', authorsController.validateAuthorForUpdate,
    authorsController.checkValidation, authorsController.updateAuthor);
    
router.delete('/authors/:id', authorsController.deleteAuthor);

module.exports = router;
