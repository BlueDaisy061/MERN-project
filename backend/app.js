const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,PATCH,DELETE,OPTIONS"
    );
    // Set custom headers for CORS
    res.header(
        "Access-Control-Allow-Headers",
        "Content-type, Accept, X-Custom-Header, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => console.log(err));
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});
mongoose
    .connect(
        "mongodb+srv://daisynguyen:Tbiytc1109@cluster0.awzmcpj.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        app.listen(5000, () => {
            console.log("Listening on port 5000!");
        });
    })
    .catch((error) => {
        console.log(error);
    });
