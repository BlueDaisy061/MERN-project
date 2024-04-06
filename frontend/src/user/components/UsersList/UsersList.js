import React from "react";
import UserItem from "../UserItem/UserItem";
import Card from "../../../shared/components/UIElements/Card";
import "./UsersList.css";
const UsersList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h1>No users found.</h1>
                </Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {props.items.map((user) => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    placeCount={user.places.length}
                />
            ))}
        </ul>
    );
};
export default UsersList;
