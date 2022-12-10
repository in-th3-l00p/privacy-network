import React, {useContext} from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./views/Home";
import {Container, Navbar} from "react-bootstrap";
import Login from "./views/Login";
import {AuthenticationContext, getAuthentication} from "./util/authentication";
import Feed from "./views/Feed";

const NavbarLayout = () => {
    return (
        <Navbar bg={"dark"} variant={"dark"}>
            <Container>
                <Navbar.Brand>Privacy network</Navbar.Brand>
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
    return (
        <AuthenticationContext.Provider value={getAuthentication()}>
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
