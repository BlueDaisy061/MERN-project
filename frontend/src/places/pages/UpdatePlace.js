import React, { useContext, useEffect, useState } from "react";
import "./PlaceForm.css";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";
import Button from "../../shared/components/FormElements/Button";
import useForm from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = (props) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const placeId = useParams().placeId;
    const [loadedPlace, setLoadedPlace] = useState();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

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

    useEffect(() => {
        const fecthPlace = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
                );
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (err) {}
        };
        fecthPlace();
    }, [sendRequest, placeId, setFormData]);

    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            navigate({ pathname: `/${auth.userId}/places` }, { replace: true });
        } catch (err) {}
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialValidity={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (min. 5 characters)."
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialValidity={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            )}
        </React.Fragment>
    );
};
export default UpdatePlace;
