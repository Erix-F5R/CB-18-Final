"use strict";

//MongoDB Setup
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const { v4: uuidv4 } = require("uuid");

//200 OK
//201 Created
//400 Bad request
//404 not found
//500 server error

const postTrip = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const trip = req.body;
  const tripId = uuidv4();

  try {
    await client.connect();
    const db = client.db("db-name");

    const exists = await db
      .collection("trips")
      .findOne({ imgName: req.body.imgName });

    if (!exists) {
      const result = await db
        .collection("trips")
        .insertOne({ _id: tripId, ...trip, favoritedBy: [] });

      res.status(201).json({ status: 201, data: result });
    } else {
      res.status(500).json({ status: 500, message: "Trip exists" });
    }
  } catch (e) {
    res.status(500).json({ status: 500, Error: e });
  }

  client.close();
};

const getAllTrips = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("db-name");
    const result = await db.collection("trips").find().toArray();
    res.status(200).json({ status: 200, data: result });
  } catch (e) {
    res.status(500).json({ status: 500, Error: e });
  }
};

const getTripsByAuthor = async (req, res) => {

  const client = new MongoClient(MONGO_URI, options);
  const author = req.params.authorId;
  console.log(author)
  try {
    await client.connect();
    const db = client.db("db-name");
    const result = await db.collection("trips").find({author : author}).toArray();
    res.status(200).json({ status: 200, data: result });
  } catch (e) {
    res.status(500).json({ status: 500, Error: e });
  }

};

const getFavoriteTrips = async (req, res) => {

  const client = new MongoClient(MONGO_URI, options);
  const user = req.params.userId;
  try {
    await client.connect();
    const db = client.db("db-name");
    const result = await db.collection("trips").find({favoritedBy : user}).toArray();
    res.status(200).json({ status: 200, data: result });
  } catch (e) {
    res.status(500).json({ status: 500, Error: e });
  }

};

const getTrip = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const trip = ObjectId(req.params.tripId);

  try {
    await client.connect();
    const db = client.db("db-name");
    const result = await db.collection("trips").findOne({ _id: trip });

    result
      ? res.status(200).json({ status: 200, data: result })
      : res
          .status(400)
          .json({ status: 400, Error: "Trip not found.", data: trip });
  } catch (e) {
    res.status(500).json({ status: 500, Error: e });
  }

  client.close();
};

module.exports = {
  postTrip,
  getAllTrips,
  getTrip,
  getTripsByAuthor,
  getFavoriteTrips
};
