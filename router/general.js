const express = require('express');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // get book info
  const book = Object.values(books)
  return res.status(200).json({books:book});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const id = Object.keys(books)
  // check for id checking
  const filteredID = id.filter(item=>item==req.params.isbn)
  const book = books[filteredID]?books[filteredID]:null
  return res.status(300).json({book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const book = Object.values(books)
  const filteredBook = book.filter(item=>item.author==req.params.author)
  return res.status(300).json({book:filteredBook});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const book = Object.values(books)
  const filteredBook = book.filter(item=>item.title==req.params.title)
  return res.status(300).json({book:filteredBook});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const id = Object.keys(books)
  // check for id checking
  const filteredID = id.filter(item=>item==req.params.isbn)
  const book = books[filteredID]?books[filteredID]:null
  let reviews;
  if(book!=null) reviews = book.reviews;
  else reviews = null; 
  return res.status(300).json(reviews);
});

module.exports.general = public_users;