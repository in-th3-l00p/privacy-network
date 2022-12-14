import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {SearchContext} from "../util/search";
import {User} from "../util/serverTypes";
import {Button, Container} from "react-bootstrap";
import userService from "../service/userService";
import {AuthenticationContext} from "../util/authentication";
import {ErrorType} from "../util/errorHandling";
import LoadingPage from "../components/LoadingPage";

const UserDisplay: React.FC<{ user: User }> = ({user}) => {
    return (
        <div className={"border p-3 bg-white d-flex"}>
            <div className={"me-3"}>
                <img
                    src={"/defaultProfilePicture.jpg"}
                    alt={"Profile"}
                    style={{
                        width: "100px",
                        borderRadius: "50%",
                        aspectRatio: "1/1"
                    }}
                />
            </div>
            <div className={"me-auto"}>
                <h4>{user.username}</h4>
                <p>{user.firstName} {user.lastName}</p>
            </div>
            <div className={"d-flex gap-3"}>
                <Button
                    variant={"dark"}
                    style={{aspectRatio: "1/1"}}
                >
                    View profile
                </Button>
                <Button
                    variant={"dark"}
                    style={{aspectRatio: "1/1"}}
                >
                    Add friend
                </Button>
            </div>
        </div>
    )
}

const Search = () => {
    const search = useContext(SearchContext);
    const params = useParams();
    const authentication = useContext(AuthenticationContext);
    const [results, setResults] = useState<User[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        if (!params["query"]) {
            setLoading(false);
            return;
        }

        search.setQuery(params["query"]);
        if (authentication.token)
            userService.searchUsers(authentication.token, params.query)
                .then(users => setResults(users.filter(user => user.username !== authentication.username)))
                .catch(setError)
                .finally(() => setLoading(false));
    }, [])

    if (error)
        return (
            <h1 className={"text-center mt-5"}>
                Server side error. Contact the administrator.
            </h1>
        );
    if (loading)
        return <LoadingPage/>
    return (
        <Container className={"pt-3 d-flex flex-column gap-3"}>
            {results?.length === 0 && <h1 className={"text-center"}>No results found.</h1>}
            {results?.map((user, index) => (
                <UserDisplay key={index} user={user}/>
            ))}
        </Container>
    );
}

export default Search;