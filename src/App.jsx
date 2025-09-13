import './App.css';
import React from 'react';
import Footer from './components/Footer'
import Header from './components/Header'
import Movies from './pages/Movies';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movie from './pages/Movie';
import People from './pages/People';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const[token, setToken] = useState(localStorage.getItem("token"));

  return (
      <BrowserRouter className="App">
      <Header token={token} setToken={setToken} />
        <div style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<Movie />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/people/:id" element={<People />} />
              <Route path="/account" element={<Account setToken={setToken}/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
      <Footer />
      </BrowserRouter>
  );
}

export default App;
