import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../App.css';

const HomePage = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const cheltuieli = [
    { id: 1, categorie: "Alimente & bauturi", suma: -9 },
    { id: 2, categorie: "Masina", suma: -6 },
    { id: 3, categorie: "Altele", suma: -100 },
    { id: 4, categorie: "Cumparaturi", suma: -200 },
    { id: 5, categorie: "Cumparaturi", suma: -35 },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="left-logo">WisePocket</div>
        <div className="center-links">
          <Link to="/">General</Link>
          <Link to="/bugete">Bugete</Link>
        </div>
        <div className="right-menu">
          <button onClick={toggleMenu} className="menu-button">
            ☰
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <Link to="/profil">Profil</Link>
              <Link to="/sfaturi">Sfaturi</Link>
              <Link to="/login">Deconectare</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Continut principal */}
      <div className="main-content">
        <h1>Bine ai venit la WisePocket!</h1>
        <p>Administrează-ți bugetul într-un mod simplu și eficient</p>

        {/* Cadrane */}
        <div className="dashboard-container">
          {/* Primul cadran - Istoric Cheltuieli */}
          <div className="card">
            <div className="card-header">
              <h2>Istoric Cheltuieli</h2>
              <button className="add-button">+</button>
            </div>
            <ul className="cheltuieli-list">
              {cheltuieli.map((item) => (
                <li key={item.id} className="cheltuiala-item">
                  <div className="left">
                    <strong>{item.categorie}</strong>
                  </div>
                  <div className="right">
                    {item.suma} RON
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Al doilea cadran */}
          <div className="card">
            <h2>Al doilea cadran</h2>
            {/* Adaug mai târziu */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
