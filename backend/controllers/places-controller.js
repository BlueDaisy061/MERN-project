const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

let DUMMY_PLACES = [
    {
        id: "p1",
        title: "Empire State Building",
        description: "One of the most famous skyscrapers in the world!",
        location: {
            lat: 40.7484405,
            lng: -73.9882393,
        },
        address: "20 W 34th St., New York, NY 10001, United States",
        creator: "u1",
    },
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find a place", 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find a place for provided id.", 404);
        return next(error);
    }
    res.json({ place: place.toObject({ getter: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError("Fetching places failed, please try again later.", 500);
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(new HttpError("Could not find a places for provided user id.", 404));
    }
    res.json({ places: places.map((place) => place.toObject({ getter: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs passed, please check your data.", 422));
    }
    const { title, description, address, creator } = req.body;
    let coordinates;
    try {
        coordinates = getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: "https://images.barrons.com/im-86071?width=1280&size=1.77777778",
        creator,
    });

    let user;

    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError("Creating place failed, please try again later.", 500);
        return next(error);
    }

    if (!user) {
        return next(new HttpError("Could not find the user for provided id, please try a gain.", 404));
    }

    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError("Creating place failed, please try again.", 500);
        return next(error);
    }

    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError("Creating place failed, please try again.", 500);
        return next(error);
    }
    res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs passed, please check your data.", 422));
    }

    const { title, description } = req.body;

    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not update place.", 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError("Something went wrong, could not update place.", 500);
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId).populate("creator");
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete place.", 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find place for this id.", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete place.", 500);
        return next(error);
    }

    res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;