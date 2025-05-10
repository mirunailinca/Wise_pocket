import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Asta e nouă

const SignupPage = () => {
  const navigate = useNavigate(); // 👈 Inițializezi navigatorul

  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [rol, setRol] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4848/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nume, prenume, email, parola, rol }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Eroare: " + data.message);
        return;
      }

      alert("Cont creat cu succes!");
      navigate("/"); // 👈 Redirecționează către pagina de login
    } catch (err) {
      alert("Eroare la trimiterea formularului: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Creare cont nou</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nume"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          required
        /><br />

        <input
          type="text"
          placeholder="Prenume"
          value={prenume}
          onChange={(e) => setPrenume(e.target.value)}
          required
        /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />

        <input
          type="password"
          placeholder="Parolă"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          required
        /><br />

        <div style={{ margin: "10px 0" }}>
          <label>
            <input
              type="radio"
              value="user"
              checked={rol === "user"}
              onChange={() => setRol("user")}
            /> Utilizator
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              value="admin"
              checked={rol === "admin"}
              onChange={() => setRol("admin")}
            /> Admin
          </label>
        </div>

        <button type="submit">Creează cont</button>
      </form>
    </div>
  );
};

export default SignupPage;
