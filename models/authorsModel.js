const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    nationality: { type: String, required: true },
    birthYear: { type: Number, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Relation to books
  },
  { versionKey: false }
);

module.exports = mongoose.model('Author', AuthorSchema);
