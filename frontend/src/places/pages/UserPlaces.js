import React from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
const DUMMY_PLACES = [
    {
        id: "p1",
        imageUrl: "https://a.cdn-hotels.com/gdcs/production176/d304/45e7e95a-6f5d-4f19-9479-1d3ddfee7e99.jpg",
        title: "Empire State Building",
        description: "One of the most famous skyscraper in the world!",
        address: "20 W 34th Stl, New York, NY 10001",
        creator: "u1",
        location: {
            lat: 40.7484445,
            lng: -73.9882393,
        },
    },
    {
        id: "p2",
        imageUrl: "https://a.cdn-hotels.com/gdcs/production176/d304/45e7e95a-6f5d-4f19-9479-1d3ddfee7e99.jpg",
        title: "Emp. State Building",
        description: "One of the most famous skyscraper in the world!",
        address: "20 W 34th Stl, New York, NY 10001",
        creator: "u2",
        location: {
            lat: 40.7484445,
            lng: -73.9882393,
        },
    },
];
const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
    return <PlaceList items={loadedPlaces} />;
};
export default UserPlaces;
