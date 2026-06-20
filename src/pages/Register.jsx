import { Button, Input, Form, FormGroup, FormFeedback, Row, Col } from "reactstrap";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from "../config/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const navigate = useNavigate();

  const registerr = () => {
    const url = `${API_URL}/user/register`;

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then((res) =>
        res.json().then((res) => {
          if (res.error) {
            setRegisterSuccess(false);
            if (res.message === "User already exists") {
              setUserExists(true);
            }
            throw new Error(res.message);
          }
        })
      )
      .then(() => {
        setRegisterSuccess(true)
      })
      .catch((error) => console.error(error));
  };

  if (registerSuccess) {
    return (
      <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }} >
        <h1> Registered Successfully! </h1>
        <p> You can now log in. </p>
        <Button onClick={() => navigate("/login")} style={{  }}>Log in</Button>
      </div>
    );
  } else {
  return (
    <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }} >
      <h1>Register</h1>
      <Form onSubmit={registerr} onChange={(e) => {
        if (e.target.id === 'username') {
          setUsername(e.target.value);
        } else if (e.target.id === 'password') {
          setPassword(e.target.value);
        } else if (e.target.id === 'confirm-password') {
          setConfirmPassword(e.target.value);
        }
      }}>
        <Row>
          <Col md={5}>
          <FormGroup>
            <Input placeholder="Username"  id='username' invalid={userExists} style={{ marginTop: '5px', marginBottom: '5px' }}/>
              {userExists && (
                <FormFeedback>User already exists</FormFeedback>
              )}
            <Input placeholder="Password" id='password' type='password' style={{ marginTop: '5px', marginBottom: '5px' }}/>
              <Input placeholder="Confirm Password" id='confirm-password' type='password' invalid={passwordMismatch} style={{ marginTop: '5px', marginBottom: '5px' }}/>
            {passwordMismatch && (
              <FormFeedback>Password does not match</FormFeedback>
            )}
          </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={5} style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '5px' }}>
            <Button onClick={registerr} style={{ width: '100%' }}>Login</Button>
          </Col>
          <p style={{ justifyContent: 'center' }}>
            Already have an account? <a href="/login" style={{ textDecoration: 'None' }}>Log in</a>
          </p>
        </Row>
      </Form>
    </div>
  );
  }
}
