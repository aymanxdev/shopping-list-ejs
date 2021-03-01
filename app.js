//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//create database schema using mongoose

//establish connection to the database
mongoose.connect("mongodb://localhost:27017/shoppingDB", {
  useNewUrlParser: true,
});

//create database schema
const itemsSchema = mongoose.Schema({
  name: String,
});

//create a model using mongoose
const Item = mongoose.model("Item", itemsSchema);

//create a new document

const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: "Start adding more items, hit the + button",
});

// create an array for all the doucments

const defaultItems = [item1, item2];

Item.insertMany(defaultItems, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully created the documents");
  }
});

//listing all items

////////////-------------------------------routes-------------------------------//////////
app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({}, (err, foundItems) => {
    res.render("list", { listTitle: day, newListItems: foundItems });
  });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
