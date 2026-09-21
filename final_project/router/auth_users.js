const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");

const registeredUsers = express.Router();
const users = [];

const isValid = (username) => !users.some((user) => user.username === username);
const authenticatedUser = (username, password) =>
  users.some((user) => user.username === username && user.password === password);

// Only registered users can log in.
registeredUsers.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add or update a book review for the logged-in user.
registeredUsers.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const review = req.body?.review || req.query.review;
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!review) return res.status(400).json({ message: "A review is required" });
  book.reviews[req.user.username] = review;
  return res.status(200).json({ message: "Review added or updated successfully", reviews: book.reviews });
});

// Delete the logged-in user's review.
registeredUsers.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!book.reviews[req.user.username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }
  delete book.reviews[req.user.username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = registeredUsers;
module.exports.isValid = isValid;
module.exports.users = users;
