import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../App.css";

const Profil = () => {
  const [profil, setProfil] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const genereazaInsigne = (puncte) => {
    const insigne = [];
    if (puncte >= 10) insigne.push("🎯 Frugal");
    if (puncte >= 50) insigne.push("🏅 Econom Expert");
    if (puncte >= 100) insigne.push("👑 Master de Buget");
    return insigne;
  };

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(`http://localhost:4848/utilizatori/profil/${userId}`);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }

        const data = await res.json();
        setProfil(data);
      } catch (err) {
        console.error("Eroare profil:", err.message);
      }
    };

    fetchProfil();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="left-logo">WisePocket</div>
        <div className="center-links">
          <Link to="/general">General</Link>
          <Link to="/bugete">Bugete</Link>
        </div>
        <div className="right-menu">
          <button onClick={toggleMenu} className="menu-button">☰</button>
          {showMenu && (
            <div className="dropdown-menu">
              <Link to="/profil">Profil</Link>
              <Link to="/sfaturi">Sfaturi</Link>
              <Link to="/">Deconectare</Link>
            </div>
          )}
        </div>
      </nav>

      <div className="main-content">
        <h1>Profilul tău</h1>
        {profil ? (
          <div className="profil-container">
            <p><strong>Nume:</strong> {profil.nume} {profil.prenume}</p>
            <p><strong>Email:</strong> {profil.email}</p>
            <p><strong>Puncte:</strong> {profil.puncte}</p>

            <h3>Insigne obținute:</h3>
            {genereazaInsigne(profil.puncte).length > 0 ? (
              <ul>
                {genereazaInsigne(profil.puncte).map((insigna, index) => (
                  <li key={index}>{insigna}</li>
                ))}
              </ul>
            ) : (
              <p>Momentan nu ai nicio insignă. Continuă să respecți bugetele! 💰</p>
            )}
          </div>
        ) : (
          <p>Se încarcă datele utilizatorului...</p>
        )}
      </div>
    </div>
  );
};

export default Profil;
