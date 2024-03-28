import React from "react";
import UsersList from "../components/UsersList/UsersList";
const Users = () => {
    const USERS = [
        {
            id: "u1",
            name: "Daisy Nguyen",
            image: "https://m.media-amazon.com/images/I/71JL3KxqHlL.jpg",
            places: 3,
        },
    ];
    return <UsersList items={USERS} />;
};
export default Users;
