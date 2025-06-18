import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../App.css";

const Profil = () => {
  const [profil, setProfil] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const fetchProfil = async () => {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    // 1. Fetch utilizator
    const resUser = await fetch(`http://localhost:4848/utilizatori/${decoded.id}`);
    const user = await resUser.json(); // ✅ lipsea

    // 2. Fetch recompensa
    const resRecomp = await fetch(`http://localhost:4848/recompense/utilizator/${decoded.id}`);
    const recompensa = await resRecomp.json();

    // 3. Combinare puncte + utilizator
    const profilComplet = {
      ...user,
      puncte: recompensa?.puncte || 0
    };

    setProfil(profilComplet); // ✅ setare profil
  } catch (err) {
    console.error("Eroare la preluarea profilului:", err);
  }
};

    fetchProfil();
  }, []);

  const getInsigne = (puncte) => {
    const insigne = [];
    if (puncte >= 10) insigne.push("Frugal");
    if (puncte >= 50) insigne.push("Expert în economii");
    if (puncte >= 100) insigne.push("Maestru al finanțelor");
    return insigne;
  };

  const insigneObtinute = getInsigne(profil.puncte || 0);
  const puncte = profil.puncte || 0;
  const praguri = [10, 50, 100];
  const pragCurent = praguri.find(p => p > puncte) || 100;
  const procent = Math.min((puncte / pragCurent) * 100, 100);

  let urlInsigna = null;
  if (puncte >= 100) urlInsigna = "/insigne/osuta.png";
  else if (puncte >= 50) urlInsigna = "/insigne/cincizeci.png";
  else if (puncte >= 10) urlInsigna = "/insigne/zece.png";

  return (
    <div>
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
        
        <div className="dashboard-container">
          {/* Stânga: recompense */}
          <div className="card">
            <h2>Recompense</h2>
            <div style={{ margin: "10px 0" }}>
              <div style={{ backgroundColor: "#eee", borderRadius: "10px", height: "20px", width: "100%" }}>
                <div style={{
                  width: `${procent}%`,
                  backgroundColor: "#6A3937",
                  height: "100%",
                  borderRadius: "10px"
                }} />
              </div>
              <p style={{ textAlign: "center", fontSize: "14px", color: "#555", marginTop: "5px" }}>
                {puncte} puncte din {pragCurent} pentru următoarea insignă
              </p>
            </div>

            <p><strong>Insigna actuală:</strong></p>
            {/* {insigneObtinute.length === 0 ? (
              <p>Momentan nu ai nicio insignă. Continuă să respecți bugetele! </p>
            ) : (
              <ul>
                {insigneObtinute.map((insigna, index) => (
                  <li key={index}>{insigna}</li>
                ))}
              </ul>
            )} */}
            {insigneObtinute.length === 0 && (
  <p>Momentan nu ai nicio insignă. Continuă să respecți bugetele! </p>
)}


            {urlInsigna && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <img src={urlInsigna} alt="Insignă obținută" style={{ width: "100px", height: "auto" }} />
              </div>
            )}
          </div>

          {/* Dreapta: detalii utilizator */}
          <div className="card">
            <h2>Profilul tău</h2>
            <p><strong>Nume:</strong> {profil.nume}</p>
            <p><strong>Email:</strong> {profil.email}</p>
            <p><strong>Puncte:</strong> {profil.puncte}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
