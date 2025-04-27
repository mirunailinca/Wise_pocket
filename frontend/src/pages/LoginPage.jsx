import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login încercat cu', email, password);
    navigate('/general');
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="email"
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
      <button onClick={handleLogin}>Conectează-te</button>

      {/* Buton de redirect către Sign Up */}
      <p>Nu ai cont?</p>
      <button onClick={handleSignUpRedirect} className="secondary-button">
        Creează cont nou
      </button>
    </div>
  );
};

export default LoginPage;
