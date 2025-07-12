import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Plot from 'react-plotly.js';
import "../App.css";
import * as d3 from 'd3-scale-chromatic';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [graficSelectat, setGraficSelectat] = useState("pie");
  const [dataGrafic, setDataGrafic] = useState(null);

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await axios.get("http://localhost:4848/admin/overview", { headers });
        setStats(res.data);

        const responseCheltuieli = await axios.get("http://localhost:4848/cheltuieli", { headers });
        const cheltuieli = responseCheltuieli.data;

        // PIE chart data
        const grouped = {};
        cheltuieli.forEach((c) => {
          const categorie = c.categorie_cheltuiala?.denumire || "Necunoscut";
          grouped[categorie] = (grouped[categorie] || 0) + c.suma;
        });
        const labels = Object.keys(grouped);
        const values = Object.values(grouped);
        const colors = d3.schemeSet3.slice(0, labels.length);
        const pieData = [{
          type: "pie",
          labels,
          values,
          textinfo: "label+percent",
          hole: 0.4,
          marker: { colors }
        }];

        // LINE chart data
        const lineData = [{
          type: "scatter",
          mode: "lines+markers",
          x: cheltuieli.map(c => c.data),
          y: cheltuieli.map(c => c.suma),
          line: { color: "#6A3937" },
        }];

        // BAR chart: medie pe lună
        const cheltuieliPeLuna = {};
        cheltuieli.forEach((c) => {
          const luna = new Date(c.data).toISOString().slice(0, 7); // YYYY-MM
          if (!cheltuieliPeLuna[luna]) cheltuieliPeLuna[luna] = { total: 0, count: 0 };
          cheltuieliPeLuna[luna].total += c.suma;
          cheltuieliPeLuna[luna].count += 1;
        });

        const luni = Object.keys(cheltuieliPeLuna).sort();
        const medii = luni.map(luna => (cheltuieliPeLuna[luna].total / cheltuieliPeLuna[luna].count).toFixed(2));

        const barData = [{
          type: 'bar',
          x: luni,
          y: medii,
          marker: { color: '#5e4630' }
        }];

        setDataGrafic({
          pie: pieData,
          line: lineData,
          bar: barData
        });

      } catch (err) {
        console.error("Eroare la fetch admin sau cheltuieli:", err);
      }
    };

    fetchData();
  }, []);

  if (!stats) return <p>Se încarcă datele...</p>;

  return (
    <div>
      <nav className="navbar">
        <div className="left-logo">WisePocket</div>
        <div className="right-menu">
          <button onClick={toggleMenu} className="menu-button">☰</button>
          {showMenu && (
            <div className="dropdown-menu">
              {/* <Link to="/profil">Profil</Link> */}
              <Link to="/">Deconectare</Link>
            </div>
          )}
        </div>
      </nav>

      <div className="main-content">
        
        <div className="dashboard-container">
          {/* Stânga */}
          <div className="card">
            <h2>Statistici Generale</h2>
            <p><strong>Total utilizatori:</strong> {stats.totalUtilizatori}</p>
            <p><strong>Total bugete setate:</strong> {stats.totalBugete}</p>
            <p><strong>Utilizatori cu bugete setate:</strong> {stats.utilizatoriCuBugete}</p>
            <p><strong>Total cheltuieli:</strong> {stats.totalCheltuieli} lei</p>
            <p><strong>Cheltuială medie:</strong> {stats.medieCheltuiala} lei</p>
            <p><strong>Cheltuieli medii per utilizator:</strong> {stats.medieCheltuieliPerUtilizator} lei</p>
          </div>

          {/* Dreapta */}
          <div className="card admin-wide">
            <h2>Vizualizare Grafică</h2>
            <select value={graficSelectat} onChange={e => setGraficSelectat(e.target.value)}>
              <option value="pie">Distribuție pe categorii (Pie Chart)</option>
              <option value="line">Evoluție în timp (Line Chart)</option>
              <option value="bar">Cheltuieli medii pe lună (Bar Chart)</option>
            </select>

            {dataGrafic && dataGrafic[graficSelectat] ? (
              <Plot
                data={dataGrafic[graficSelectat]}
                layout={{
                  title: '',
                  paper_bgcolor: '#d6c8b9',
                  plot_bgcolor: '#d6c8b9',
                  height: 300,
                  width: 440,
                  margin: { t: 30, l: 20, r: 20, b: 20 }
                }}
                config={{ responsive: true }}
              />
            ) : (
              <p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
                Nu există date pentru graficul selectat.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
