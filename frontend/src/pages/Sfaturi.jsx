import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Sfaturi = () => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const sfaturiPersonalizate = [
    "Conform comportamentului tău financiar, categoria de cheltuieli cu cea mai mare pondere este cea alimentară.",
  <>
    Când cheltuielile pe alimente depășesc 60% din total, e semn că:
    <ul className="sublista">
      <li>fie se cumpără prea des,</li>
      <li>fie se aruncă mâncare,</li>
      <li>fie nu există un plan de mese clar.</li>
    </ul>
    
  </>,
  "Planifică mesele săptămânal și încearcă să faci cumpărături o singură dată pe săptămână, cu listă.",

    
  ];

  const sfaturiGenerale = [
    "Notează fiecare cheltuială, oricât de mică, pentru a avea control complet.",
    "Creează un buget periodic și respectă-l.",
    "Evită cheltuielile impulsive printr-o listă de priorități.",
    "Regula 50/30/20: 50% din venituri pentru necesități, 30% pentru dorințe, 20% pentru economii.",
    "Evaluează lunar cheltuielile și ajustează bugetul în funcție de nevoi.",
    "Stabilește un fond de urgență pentru cheltuieli neprevăzute.",  
  ];

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

      {/* Conținut principal */}
      <div className="main-content">
        <div className="dashboard-container two-column">
          <div className="card card-sfaturi">
            <h2 style={{ textAlign: "center" }}>Sfaturi personalizate</h2>
            <ul>
              {sfaturiPersonalizate.map((sfat, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>{sfat}</li>
              ))}
            </ul>
          </div>

          <div className="card card-sfaturi">
            <h2 style={{ textAlign: "center" }}>Sfaturi generale</h2>
            <ul>
              {sfaturiGenerale.map((sfat, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>{sfat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sfaturi;
