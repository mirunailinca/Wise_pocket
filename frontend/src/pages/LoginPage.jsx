import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4848/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, parola: password }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Eroare: " + err.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      const userData = jwtDecode(data.token);

      //aici logez
      console.log("DECODED:", jwtDecode(data.token));
      console.log("USER DATA:", userData);
      console.log("ROL:", userData.role);

      if (userData.role === "admin") {
        console.log("Navigare către admin");
        navigate("/admin");
      } else {
        console.log("Navigare către general");
        navigate("/general");
      }
    } catch (err) {
      console.error("Eroare login:", err);
      alert("Eroare la conectare cu serverul.");
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
  <div className="login-container">
    <div className="login-box">
      <h1>Autentificare</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Parola"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="primary-button" onClick={handleLogin}>Conectează-te</button>
      <p>Nu ai cont?</p>
      <button className="secondary-button" onClick={handleSignUpRedirect}>Creează cont nou</button>
    </div>
  </div>
);

};

export default LoginPage;
