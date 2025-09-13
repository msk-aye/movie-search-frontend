import { Button, Input, Form, FormGroup, FormFeedback, FormText,  Row, Col } from "reactstrap";
import { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = `http://4.237.58.241:3000`;

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (loginSuccess) {
      const timeout = setTimeout(() => navigate("/"), 1300);
      return () => clearTimeout(timeout);
    }
  }, [loginSuccess, navigate]);

  const loginn = () => {
    const url = `${API_URL}/user/login`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password, longExpiry: false }),
    })
      .then((res) =>
        res.json().then((res) => {
          if (res.error) {
            setLoginFailed(true);
            throw new Error(res.message);
          }
          localStorage.setItem("token", res.bearerToken.token);
          localStorage.setItem("refreshToken", res.refreshToken.token);
          localStorage.setItem("tokenExpiry", Date.now() + (res.bearerToken.expires_in - 10) * 1000);
          localStorage.setItem("refreshTokenExpiry", Date.now() + (res.refreshToken.expire_in - 10) * 1000);
          localStorage.setItem("username", username);
          setToken(res.bearerToken.token);
          console.error(localStorage.getItem("refreshTokenExpiry"));
        })
      )
      .then(() => {
        setLoginSuccess(true)
      })
      .catch((error) => console.error(error));

    return loginSuccess
  };

  if (loginSuccess) {
    return (
      <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }} >
        <h1> Login Success! </h1>
        <p> Navigating you to home page... </p>
      </div>
    );
  } else {
  return (
    <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }} >
      <h1>Login</h1>
      <Form onSubmit={loginn} onChange={(e) => {
        if (e.target.id === 'username') {
          setUsername(e.target.value);
        } else if (e.target.id === 'password') {
          setPassword(e.target.value);
        }
      }}>
        <Row>
          <Col md={5}>
          <FormGroup>
            <Input placeholder="Username"  id='username' invalid={loginFailed} style={{ marginTop: '5px', marginBottom: '5px' }}/>
            <Input placeholder="Password" id='password' type='password' invalid={loginFailed} style={{ marginTop: '5px', marginBottom: '5px' }}/>
            { loginFailed && (
              <FormFeedback style={{ color: 'red' }}>
                Invalid username or password
              </FormFeedback>
            )}
            <FormText>
              <a href="/register" style={{ textDecoration: 'None'}}>Forgot Password?</a>
            </FormText>
          </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={5} style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '5px' }}>
            <Button onClick={loginn} style={{ width: '100%' }}>Login</Button>
          </Col>
          <p style={{ justifyContent: 'center' }}>
            Dont have an account? <a href="/register" style={{ textDecoration: 'None' }}>Sign Up</a>
          </p>
        </Row>
      </Form>
    </div>
  );
  }
}
