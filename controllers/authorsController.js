const Author = require('../models/authorsModel');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// Validation
exports.validateAuthor = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('nationality').isString().withMessage('Nationality must be a string').notEmpty().withMessage('Nationality is required'),
  body('birthYear').isInt().withMessage('Birth year must be a number'),
];

exports.validateAuthorForUpdate = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('nationality').optional().isString().withMessage('Nationality must be a string'),
  body('birthYear').optional().isInt().withMessage('Birth year must be a number'),
  body('books').optional().isArray().withMessage('Books must be an array'),
];

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get an author by ID
exports.getAuthorById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const author = await Author.findById(id).populate('books');
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new author
exports.createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an author
exports.updateAuthor = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const author = await Author.findByIdAndUpdate(id, req.body, { new: true });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
