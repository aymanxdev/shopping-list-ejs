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
  useUnifiedTopology: true,
});

//create database schema
const itemsSchema = mongoose.Schema({
  name: {
    type: String,
    required: (true, "This field cannot be empty"),
  },
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

//create custom lists

const listSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

////////////-------------------------------routes-------------------------------//////////
app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully created the documents");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, (err, foundLists) => {
    if (err) {
      console.log(err);
    } else if (!foundLists) {
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", {
        listTitle: foundLists.name,
        newListItems: foundLists.items,
      });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const dynamicItem = new Item({
    name: itemName,
  });

  dynamicItem.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkedbox;

  console.log(checkedItem);

  Item.findByIdAndRemove(checkedItem, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted the item");
      res.redirect("/");
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
