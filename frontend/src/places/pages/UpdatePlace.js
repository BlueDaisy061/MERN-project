import React, { useEffect, useState } from "react";
import "./PlaceForm.css";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";
import Button from "../../shared/components/FormElements/Button";
import useForm from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
const DUMMY_PLACES = [
    {
        id: "p1",
        imageUrl: "https://res.klook.com/.../Empire%20State%20Building...",
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
        imageUrl: "https://res.klook.com/.../Empire%20State%20Building...",
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
const UpdatePlace = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false
    );
    const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);
    useEffect(() => {
        if (identifiedPlace) {
            setFormData(
                {
                    title: {
                        value: identifiedPlace.title,
                        isValid: true,
                    },
                    description: {
                        value: identifiedPlace.description,
                        isValid: true,
                    },
                },
                true
            );
            setIsLoading(false);
        }
    }, [setFormData, identifiedPlace]);
    const placeUpdateSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
    };
    if (!identifiedPlace) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    }
    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValidity={formState.inputs.title.isValid}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (min. 5 characters)."
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValidity={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
        </form>
    );
};
export default UpdatePlace;
