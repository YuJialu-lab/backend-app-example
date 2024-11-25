const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const existBook = books[req.params.isbn]
  console.log(books[req.params.isbn])
  if (existBook) {
    const {review} = req.body;
    const lenght = Object.keys(books[req.params.isbn].reviews).length;
    books[req.params.isbn].reviews[lenght + 1] = review;
    return res.status(300).send("The review for the book with ISBN "+ req.params.isbn+ " has been added/updated.");
  } else {
    return res
      .status(300)
      .send("book with this isbn number is not exist!");
  }
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const existBook=books[req.params.isbn];
  if(!existBook){
    delete books[req.params.isbn].review
  }
  res.send(`Reviews for the ISBN ${req.params.isbn} posted by the user ${req.name} deleted.`);
})
module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
