import React, {useContext, useEffect, useState} from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./views/Home";
import {Button, Container, Form, Nav, Navbar} from "react-bootstrap";
import Login from "./views/Login";
import {
    AuthenticationContext,
    getAuthentication,
    getAuthenticationHeader,
    setAuthentication
} from "./util/authentication";
import {SearchContext} from "./util/search";
import Feed from "./views/Feed";
import axios from "axios";
import {ErrorType} from "./util/errorHandling";
import LoadingPage from "./components/LoadingPage";
import Search from "./views/Search";

const UnauthenticatedNav = () => {
    const authentication = useContext(AuthenticationContext);

    return (
        <Nav className={"ms-auto"}>
            <Nav.Link href={"/login"}>Login</Nav.Link>
        </Nav>
    );
}

const AuthenticatedNav = () => {
    const authentication = useContext(AuthenticationContext);
    const search = useContext(SearchContext);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        if (search.query)
            setQuery(search.query);
    }, [search])

    return (
        <>
            <Nav className={"me-auto"}>
                <Nav.Link href={"/feed"}>Feed</Nav.Link>
            </Nav>
            <Nav>
                <Form
                    className={"d-flex"}
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (query === "")
                            return;
                        window.location.href = `/search/${query}`;
                    }}
                >
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Button
                        type={"submit"}
                        variant={"dark"}>
                        🔍
                    </Button>
                </Form>
            </Nav>
            <Nav className="ms-auto">
                <Nav.Link href={`/profile/${authentication.userId}`}>{authentication.username}</Nav.Link>
                <Nav.Link onClick={() => {
                    setAuthentication(false, null);
                    window.location.href = "/";
                }}>Log out</Nav.Link>
            </Nav>
        </>
    );
}

const NavbarLayout = () => {
    const authentication = useContext(AuthenticationContext);

    return (
        <Navbar bg={"dark"} variant={"dark"} expand={"md"}>
            <Container>
                <Navbar.Brand href={"/"}>Privacy network</Navbar.Brand>
                <Navbar.Toggle aria-controls={"navbar-toggle"}/>
                <Navbar.Collapse id={"navbar-toggle"}>
                    {authentication.authenticated ?
                        <AuthenticatedNav/> :
                        <UnauthenticatedNav/>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

const NavbarFooter = () => {
    return <></>;
}

const Layout: React.FC<{ children: JSX.Element }> = ({children}) => {
    return (
        <div>
            <NavbarLayout/>
            {children}
            <NavbarFooter/>
        </div>
    )
}

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({children}) => {
    const authentication = useContext(AuthenticationContext);
    if (authentication.authenticated)
        return children;
    return <Navigate to={"/login"}/>
}

function App() {
    const authentication = getAuthentication();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>();

    // used for searching
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        if (authentication.token)
            axios.get("/api/auth/valid", {
                headers: getAuthenticationHeader(authentication.token)
            })
                .then(resp => {
                    if (!resp.data)
                        setAuthentication(false, null);
                })
                .catch(err => setError(err))
                .finally(() => setLoading(false));
        else {
            setAuthentication(false, null);
            setLoading(false);
        }
    }, [])

    if (error)
        return <h1 className={"text-center mt-5"}>Server side error. Contact the administrator.</h1>
    if (loading)
        return <LoadingPage/>
    return (
        <AuthenticationContext.Provider value={authentication}>
            <SearchContext.Provider value={{query: query, setQuery: setQuery}}>
                <Layout>
                    <BrowserRouter>
                        <Routes>
                            <Route index element={<Home/>}/>
                            <Route path={"/login"} element={<Login/>}/>
                            <Route path={"/feed"} element={<PrivateRoute><Feed/></PrivateRoute>}/>
                            <Route path={"/search/:query"} element={<PrivateRoute><Search/></PrivateRoute>}/>
                        </Routes>
                    </BrowserRouter>
                </Layout>
            </SearchContext.Provider>
        </AuthenticationContext.Provider>
    )
}

export default App;
