import { Button } from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = `http://4.237.58.241:3000`;

const checkAndRefreshToken = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry");

  if (Date.now() > tokenExpiry) {
    if (Date.now() > refreshTokenExpiry) {
      localStorage.clear();
      return Promise.resolve(false);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    return fetch(`${API_URL}/user/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to refresh token");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.bearerToken.token);
        localStorage.setItem("refreshToken", data.refreshToken.token);
        localStorage.setItem("tokenExpiry", Date.now() + (data.bearerToken.expires_in - 10) * 1000);
        localStorage.setItem("refreshTokenExpiry", Date.now() + (data.refreshToken.expire_in - 10) * 1000);
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.error("Error refreshing token:", error);
        localStorage.clear();
        return Promise.resolve(false);
      });
  }

  return Promise.resolve(true);
};


export default function Account({ setToken }) {
  const [loggedIn, setLoggedIn] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAndRefreshToken().then((result) => {
      setLoggedIn(result);
    });
  }, []);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");

    fetch(`${API_URL}/user/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then((res) => {
        if (res.ok) {
          setLoggedIn(false);
          setLogoutSuccess(true);
        }
      })
      .catch((error) => console.error("Error during logout:", error));

    localStorage.clear();
    setToken(null);
    setTimeout(() => navigate("/"), 1300);
  };

  if (loggedIn === null) {
    return <p>Loading...</p>; // While checking login state
  }

  if (logoutSuccess) {
    return (
      <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h1>Logout Successful!</h1>
        <p>Navigating you to home page...</p>
      </div>
    );
  }

  if (loggedIn) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Account</h1>
        <p>Logged in as <strong>{localStorage.getItem('username')}</strong></p>
        <Button onClick={handleLogout}>Log out</Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }}>
      <h1>Account</h1>
      <p>You are not logged in to any account.</p>
      <Button onClick={() => navigate("/login")}>Log in</Button>
    </div>
  );
}
