import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = {
    isLoading: false,
    isAuthenticated: false,
    isAuthenticating: true
  };

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async e => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating && (
        <>
          <div className="App container">
            <Navbar
              bg="light"
              fluid
              collapseOnSelect
              className="justify-content-between"
            >
              <Navbar.Brand>
                <Link to="/">Anotar</Link>
              </Navbar.Brand>
              <Nav className="justify-content-end">
                {this.state.isAuthenticated ? (
                  <Nav.Item onClick={this.handleLogout}>
                    <span className="nav-link">Logout</span>
                  </Nav.Item>
                ) : (
                  <>
                    <LinkContainer to="/signup">
                      <Nav.Item>
                        <span className="nav-link">Signup</span>
                      </Nav.Item>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Nav.Item>
                        <span className="nav-link">Login</span>
                      </Nav.Item>
                    </LinkContainer>
                  </>
                )}
              </Nav>
            </Navbar>
            <Routes childProps={childProps} />
          </div>
          <footer class="footer mt-auto py-3">
            <div class="container">
              <span class="text-muted">
                Isso aqui é realmente útil? <a rel="noopener noreferrer" href="http://instagram.com/uaileleu" target="_blank">@uaileleu</a>
              </span>
            </div>
          </footer>
        </>
      )
    );
  }
}

export default withRouter(App);
