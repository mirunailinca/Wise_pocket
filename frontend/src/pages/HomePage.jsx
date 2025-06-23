import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Plot from 'react-plotly.js';
import * as d3 from 'd3-scale-chromatic';
import '../App.css';

const HomePage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [suma, setSuma] = useState("");
  const [data, setData] = useState("");
  const [detalii, setDetalii] = useState("");
  const [idCategorie, setIdCategorie] = useState("");
  const [categorii, setCategorii] = useState([]);
  const [cheltuieli, setCheltuieli] = useState([]);
  const [plotData, setPlotData] = useState(null);


  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleForm = () => setShowForm(!showForm);

  const fetchCheltuieli = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://localhost:4848/cheltuieli/ultimele/${userId}`);
      const data = await response.json();
      console.log(data);//////////
      setCheltuieli(data);

      // Pregătim datele pentru grafic
      const categorii = {};
    data.forEach(item => {
      const denumire = item.categorie_cheltuiala?.denumire || "Necunoscut";
      categorii[denumire] = (categorii[denumire] || 0) + item.suma;
    });

    const labels = Object.keys(categorii);
    const values = Object.values(categorii);

    const palette = d3.schemeSet3; // conține 12 culori
    const colors = palette.slice(0, labels.length); // folosește doar câte ai nevoie
    
    setPlotData({
      labels,
      values,
      type: 'pie',
      textinfo: 'label+percent',
      hole: 0.4,
      marker: {
        colors: colors,
      }
    });
    } catch (err) {
      console.error("Eroare la preluarea cheltuielilor:", err);
    }
  };

  const fetchCategorii = async () => {
    try {
      const response = await fetch("http://localhost:4848/categorii");
      const data = await response.json();
      setCategorii(data);
    } catch (err) {
      console.error("Eroare la preluarea categoriilor:", err);
    }
  };

  useEffect(() => {
    fetchCheltuieli();
    fetchCategorii();
  }, []);

  const handleAdaugaCheltuiala = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch("http://localhost:4848/cheltuieli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suma,
          data,
          detalii,
          id_utilizator: userId,
          id_categorie: idCategorie,
        }),
      });

      if (!response.ok) throw new Error("Eroare la adăugarea cheltuielii");

      setSuma("");
      setData("");
      setDetalii("");
      setIdCategorie("");
      setShowForm(false);
      fetchCheltuieli(); // reîncarcă lista
    } catch (err) {
      console.error(err.message);
    }
  };

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

      {/* Continut principal */}
      <div className="main-content">
        {/* <h1>Bine ai venit la WisePocket!</h1>
        <p>Administrează-ți bugetul într-un mod simplu și eficient</p> */}

        <div className="dashboard-container">
          {/* Istoric Cheltuieli */}
          <div className="card">
            <div className="card-header">
              <h2>Istoric Cheltuieli</h2>
              <button className="add-button" onClick={toggleForm}>+</button>
            </div>

            {showForm && (
              <div className="modal-overlay" onClick={() => setShowForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="close-button" onClick={() => setShowForm(false)}>×</button>
                  <h3>Adaugă Cheltuială</h3>
                  <form onSubmit={handleAdaugaCheltuiala} className="form-adaugare">
                    <input
                      type="number"
                      placeholder="Suma"
                      value={suma}
                      onChange={(e) => setSuma(e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Detalii"
                      value={detalii}
                      onChange={(e) => setDetalii(e.target.value)}
                    />
                    <select
                      value={idCategorie}
                      onChange={(e) => setIdCategorie(e.target.value)}
                      required
                    >
                      <option value="">Selectează categorie</option>
                      {categorii.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.denumire}
                        </option>
                      ))}
                    </select>
                    <button type="submit">Adaugă</button>
                  </form>
                </div>
              </div>
            )}

            <ul className="cheltuieli-list">
              {cheltuieli.length === 0 ? (
                <p style={{ textAlign: "center", color: "#888" }}>
                  Nu au fost adăugate cheltuieli
                </p>
              ) : (
                cheltuieli.map((item) => (
                  <li key={item.id} className="cheltuiala-item">
                    <div className="left">
                    <strong>{item.categorie_cheltuiala?.denumire || "Fără categorie"}</strong>
                    </div>
                    <div className="right">{item.suma} RON</div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Al doilea cadran */}
<div className="card">
  <h2>Distribuția cheltuielilor pe categorii</h2>
  {plotData ? (
    <Plot
      data={[plotData]}
      layout={{
        title: 'Distribuția cheltuielilor pe categorii',
        height: 400,
        width: 400,
        showlegend: true,
        paper_bgcolor: "#d6c8b9",  // fundalul cadranului
        plot_bgcolor: "#d6c8b9"  // fundalul graficului
      }}
    />
  ) : (
    <p style={{ textAlign: "center", color: "#888" }}>
      Nu există date pentru grafic
    </p>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
