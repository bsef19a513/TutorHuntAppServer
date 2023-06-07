const express = require("express");
const User = require("./Model/users.js");
const app = express();
require("./db/conn.js");
const multer = require("multer");
const sharp = require("sharp");

// middleware

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Root endpoint for the api 

app.get("/", (req, res) => {
    res.send("Hello from the server side !")
})

// Create a user 
app.post("/users/", (req, res) => {

    const doc = new User(req.body);

    // Saving document in the db 

    doc.save().then(() => {
        res.status(201).send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

// Get the users

app.get("/users", async (req, res) => {

    try {
        const docs = await User.find();

        if (docs) {
            res.status(200).send(docs)
        }
        else {
            res.status(400).send("No users are registered yet !")
        }
    } catch (error) {
        res.status(404).send("Page not found !")
    }
})

// Get the user by ID

app.get("/users/:mail", async (req, res) => {

    const email = req.params.mail;
    try {
        const doc = await User.findOne({ email });

        if (doc) {
            res.status(200).send(doc)
        }
        else {
            res.status(400).send("No such user found !")
        }
    } catch (error) {
        res.status(404).send("Page not found !")
    }
})

// Delete a user by mail

app.delete("/users/:mail", async (req, res) => {

    const email = req.params.mail;
    try {
        const doc = await User.findOneAndDelete({ email });

        if (doc) {
            res.status(200).send(doc)
        }
        else {
            res.status(400).send("No such user found !")
        }
    } catch (error) {
        res.status(404).send("Page not found !")
    }
})

// Update user by mail using patch method

app.patch("/users/:mail", async (req, res) => {
    const email = req.params.mail;
    const updation = req.body;
    try {
        const doc = await User.findOneAndUpdate({ email }, updation, { new: true });

        if (doc) {
            res.status(200).send(doc)
        }
        else {
            res.status(400).send("No such user found !")
        }
    } catch (error) {
        res.status(404).send("Page not found !")
    }
})

// Update user by mail using put method

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb('Invalid media file !', false);
    }
}

const upload = multer({ storage, fileFilter });

app.patch("/users/:mail", upload.single('profilePic'), async (req, res) => {
    const email = req.params.mail;
    const updation = req.body;

    try {


        const profileBuffer = req.file.buffer;
        const { width, height } = await sharp(profileBuffer).metadata();
        const finalProfileBuffer = await sharp(profileBuffer).resize(Math.round(width * 0.5), Math.round(height * 0.5)).toBuffer();
        const finalUpdation = { ...updation, avatar: finalProfileBuffer }


        const doc = await User.findOneAndUpdate({ email }, finalUpdation, { new: true });

        if (doc) {
            res.status(200).send(doc)
        }
        else {
            res.status(400).send("No such user found !")
        }

    } catch (error) {
        res.status(400).send("Error while updating the profile data !")
    }
})

app.listen(PORT, () => {
    console.log(`Sever connection is listening at port ${PORT}`)
})