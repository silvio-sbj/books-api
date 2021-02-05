require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

(async () => {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;

  const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

  const client = await MongoClient.connect(url, { useUnifiedTopology: true });

  const db = client.db(dbName);

  const app = express();

  app.use(bodyParser.json());

  const port = process.env.PORT || 3000;

  /*
  Create, Read All/Single, Update & Delete
  */

  const books = db.collection("books");

  app.get("/", (req, res) => {
    res.send("BOOKS-API is running...");
  });

  //Create --
  app.post("/books", async (req, res) => {
    const book = req.body;
    await books.insertOne(book);
    res.status(201).send(book);
  });

  //Read All --
  app.get("/books", async (req, res) => {
    res.send(await books.find().toArray());
  });

  //Read Single --
  app.get("/books/:id", async (req, res) => {
    const { id } = req.params;
    const book = await books.findOne({ _id: ObjectId(id) });
    res.send(book);
  });

  //Update --
  app.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const book = req.body;
    await books.updateOne({ _id: ObjectId(id) }, { $set: book });
    res.json({ message: "Book updated!" });
  });

  //Delete --
  app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;
    await books.deleteOne({ _id: ObjectId(id) });
    res.json({ message: "Book deleted!" });
  });

  app.listen(port);
})();
