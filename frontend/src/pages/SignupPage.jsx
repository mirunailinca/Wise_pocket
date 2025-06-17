import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4848/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nume, prenume, email, parola, rol: "user" }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Eroare: " + data.message);
        return;
      }

      alert("Cont creat cu succes!");
      navigate("/"); // Redirecționează către login
    } catch (err) {
      alert("Eroare la trimiterea formularului: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Creare cont nou</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nume"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Prenume"
            value={prenume}
            onChange={(e) => setPrenume(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            required
          />
          <button type="submit" className="primary-button">Creează cont</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
