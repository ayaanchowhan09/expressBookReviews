const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const publicUsers = express.Router();

const findBooks = (predicate) => Object.entries(books).reduce((matches, [isbn, book]) => {
  if (predicate(book)) matches[isbn] = book;
  return matches;
}, {});

// Register a new customer.
publicUsers.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
  if (!isValid(username)) return res.status(409).json({ message: "Username already exists" });
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop.
publicUsers.get("/", (req, res) => res.status(200).json(books));

// Get book details based on ISBN.
publicUsers.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json({ [req.params.isbn]: book });
});

// Get book details based on author.
publicUsers.get("/author/:author", (req, res) => {
  const author = req.params.author.toLocaleLowerCase();
  return res.status(200).json(findBooks((book) => book.author.toLocaleLowerCase() === author));
});

// Get book details based on title.
publicUsers.get("/title/:title", (req, res) => {
  const title = req.params.title.toLocaleLowerCase();
  return res.status(200).json(findBooks((book) => book.title.toLocaleLowerCase() === title));
});

// Get a book's reviews.
publicUsers.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = publicUsers;

// Axios-based asynchronous client helpers for the public catalogue endpoints.
// They can be called by a Node.js client without blocking the event loop.
const API_BASE_URL = process.env.BOOKSTORE_BASE_URL || "http://127.0.0.1:5000";

const getAllBooksAsync = () =>
  axios.get(`${API_BASE_URL}/`).then((response) => response.data);

const getBookByIsbnAsync = async (isbn) => {
  const response = await axios.get(`${API_BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
};

const getBooksByAuthorAsync = async (author) => {
  const response = await axios.get(`${API_BASE_URL}/author/${encodeURIComponent(author)}`);
  return response.data;
};

const getBooksByTitleAsync = async (title) => {
  const response = await axios.get(`${API_BASE_URL}/title/${encodeURIComponent(title)}`);
  return response.data;
};

module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByIsbnAsync = getBookByIsbnAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
