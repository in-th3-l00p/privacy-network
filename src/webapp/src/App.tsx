import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {Container, Navbar} from "react-bootstrap";
import Login from "./pages/Login";

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

const Layout: React.FC<{children: JSX.Element}> = ({ children }) => {
    return (
        <div>
            <NavbarLayout />
            {children}
            <NavbarFooter />
        </div>
    )
}

function App() {
    return (
        <Layout>
          <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path={"/login"} element={<Login />} />
            </Routes>
          </BrowserRouter>
        </Layout>
    )
}

export default App;
