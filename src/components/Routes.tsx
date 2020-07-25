import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export function Routes() {
  return (
    <header>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand>
          <NavLink to="/okr-board" className="navbar-brand">
            OKR++
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" as="ul">
            <Nav.Item as="li">
              <NavLink to="/create-department" className="nav-link">
                Create Department
              </NavLink>
            </Nav.Item>
            <Nav.Item as="li">
              <NavLink to="/create-user" className="nav-link">
                Create User
              </NavLink>
            </Nav.Item>
            <Nav.Item as="li">
              <NavLink to="/create-objective" className="nav-link">
                Create Objective
              </NavLink>
            </Nav.Item>
            <Nav.Item as="li">
              <NavLink to="/create-keyresult" className="nav-link">
                Create Key Result
              </NavLink>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item as="li">
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
