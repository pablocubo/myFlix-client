import React, { useState } from "react";
import { Col, Form, Button, Container, Row, Card } from 'react-bootstrap';

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch("https://letflix-0d183cd4a94e.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          onLoggedIn(data.user, data.token);
        } else {
          alert("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        // Handle the error as needed
      });
  };

  return (

       <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card style={{ marginTop: 100, marginBottom: 50 }}>
              <Card.Body>
                <Card.Title style={{ textAlign: "left", fontSize: "2rem" }}>
                  Login
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formGroupUsername">
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength="3"
                      placeholder="Username"
                    />
                  </Form.Group>
  
                  <Form.Group controlId="formPassword">
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" onClick={handleSubmit} block style={{ width: "100%" }}>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};
