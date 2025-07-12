import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../App.css";

const Profil = () => {
  const [profil, setProfil] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    console.log("⚠️ useEffect Profil.jsx executat");

    const fetchProfil = async () => {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    // 2. Fetch utilizator
    const resUser = await fetch(`http://localhost:4848/utilizatori/${decoded.id}`);
    const user = await resUser.json();

    // 3. Fetch recompensa actualizată
    const resRecomp = await fetch("http://localhost:4848/recompensa/verifica", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ utilizator_id: decoded.id })
    });
    const recompensa = await resRecomp.json();

    // 4. Combinare
    const profilComplet = {
      ...user,
      puncte: recompensa?.puncte || 0,
    };

    setProfil(profilComplet);
    // // 1. Fetch utilizator
    // const resUser = await fetch(`http://localhost:4848/utilizatori/${decoded.id}`);
    // const user = await resUser.json(); 

    // // 2. Fetch recompensa
    // const resRecomp = await fetch(`http://localhost:4848/recompense/utilizator/${decoded.id}`);
    // const recompensa = await resRecomp.json();

    // // 3. Combinare puncte + utilizator
    // const profilComplet = {
    //   ...user,
    //   puncte: recompensa?.puncte || 0
    // };

    // setProfil(profilComplet); 
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
  if (puncte >= 150) urlInsigna = "/insigne/seed5.png";
  else if (puncte >= 100) urlInsigna = "/insigne/seed4.png";
  else if (puncte >= 50) urlInsigna = "/insigne/seed3.png";
  else if (puncte >= 10) urlInsigna = "/insigne/seed2.png";
  else urlInsigna = "/insigne/seed1.png";

  const getMesajInsigna = (puncte) => {
  if (puncte >= 150) return "Felicitări! Ai o grădină plină de flori care simbolizează realizările tale financiare.";
  else if (puncte >= 100) return "Munca ta dă roade! Tocmai a înflorit planta pe care ai crescut-o.";
  else if (puncte >= 50) return "Încă puțină disciplină ca să înflorească planta, dar și modul tău de gestionare al finanțelor!";
  else if (puncte >= 10) return "Ești pe drumul cel bun! Planta ta a început să încolțească.";
  else return "Așa cum o sămânță devine floare, așa și tu poți crește în finanțe!";
};

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

{/* 
            {urlInsigna && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <img src={urlInsigna} alt="Insignă obținută" style={{ width: "100px", height: "auto" }} />
              </div>
            )}
             */}

            {urlInsigna && (
  <div style={{ textAlign: "center", marginTop: "10px" }}>
    <img src={urlInsigna} alt="Insignă obținută" style={{ width: "100px", height: "auto" }} />
<p style={{
  fontSize: "18px",
  marginTop: "20px",
  marginBottom: "0",
  color: "#333",
  textAlign: "center",
  fontWeight: "bold"
}}>
  ★ {getMesajInsigna(puncte)}
</p>

  </div>
)}

          </div>

          {/* Dreapta: detalii utilizator */}
<div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <h2>Profilul tău</h2>
  <p style={{ color: "#333" }}><strong>Nume:</strong> {profil.nume}</p>
  <p style={{ color: "#333" }}><strong>Email:</strong> {profil.email}</p>
  <p style={{ color: "#333" }}><strong>Puncte:</strong> {profil.puncte}</p>

  <div style={{ marginTop: "40px", textAlign: "center", color: "#333" }}>
    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Cum obți puncte?</p>
    <p style={{ fontSize: "14px", margin: 0 }}>★ 10 puncte pentru fiecare buget respectat</p>
    <p style={{ fontSize: "14px", margin: 0 }}>★ ajută-ți planta să crească acumulând cât mai multe puncte</p>

  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default Profil;
