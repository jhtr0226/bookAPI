const Book = require('../models/booksModel');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// Validation
exports.validateBook = [
  body('title').isString().withMessage('Title must be a string').notEmpty().withMessage('Title is required'),
  body('author').isString().withMessage('Author must be a string').notEmpty().withMessage('Author is required'),
  body('genre').isString().withMessage('Genre must be a string').notEmpty().withMessage('Genre is required'),
  body('publishedYear').isInt().withMessage('Published Year must be a number'),
  body('ISBN').isString().withMessage('ISBN must be a string').notEmpty().withMessage('ISBN is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

exports.validateBookForUpdate = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('author').optional().isString().withMessage('Author must be a string'),
  body('genre').optional().isString().withMessage('Genre must be a string'),
  body('publishedYear').optional().isInt().withMessage('Published Year must be a number'),
  body('ISBN').optional().isString().withMessage('ISBN must be a string'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};




// Get all contacts
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single contact by ID
exports.getBookById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new contact
exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate ISBN detected.' });
    }
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a contact
exports.updateBook = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate ISBN detected.' });
    }
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a contact
exports.deleteBook = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
