import React, {useContext, useEffect, useState} from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./views/Home";
import {Container, Nav, Navbar} from "react-bootstrap";
import Login from "./views/Login";
import {
    AuthenticationContext,
    getAuthentication,
    getAuthenticationHeader,
    setAuthentication
} from "./util/authentication";
import Feed from "./views/Feed";
import axios from "axios";
import {ErrorType} from "./util/errorHandling";
import LoadingPage from "./components/loading/LoadingPage";

const UnauthenticatedNav = () => {
    const authentication = useContext(AuthenticationContext);

    return (
        <Nav className={"ms-auto"}>
            <Nav.Link href={"/about"}>Login</Nav.Link>
        </Nav>
    );
}

const AuthenticatedNav = () => {
    const authentication = useContext(AuthenticationContext);

    return (
        <>
            <Nav className={"me-auto"}>
                <Nav.Link href={"/feed"}>Feed</Nav.Link>
            </Nav>
            <Nav>
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
        <Navbar bg={"dark"} variant={"dark"}>
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
        return <h1 className={"text-center mt-5"}>Server error occurred</h1>
    if (loading)
        return <LoadingPage/>
    return (
        <AuthenticationContext.Provider value={authentication}>
            <Layout>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/feed"} element={<PrivateRoute><Feed/></PrivateRoute>}/>
                    </Routes>
                </BrowserRouter>
            </Layout>
        </AuthenticationContext.Provider>
    )
}

export default App;
