import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../App.css";

const Bugete = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [suma, setSuma] = useState("");
  const [perioada, setPerioada] = useState("");
  const [denumire, setDenumire] = useState(""); // <-- NOU
  const [dataInceput, setDataInceput] = useState("");
  const [bugete, setBugete] = useState([]);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleForm = () => setShowForm(!showForm);

  const fetchBugete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://localhost:4848/bugete/user/${userId}`);
      const data = await response.json();
      setBugete(data);
    } catch (err) {
      console.error("Eroare la preluarea bugetelor:", err);
    }
  };

  const handleAdaugaBuget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch("http://localhost:4848/bugete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suma: parseFloat(suma),
          perioada,
          data_inceput: dataInceput,
          utilizator_id: userId,
        }),
      });

      if (!response.ok) throw new Error("Eroare la adăugarea bugetului");
      const bugetNou = await response.json();

      bugetNou.denumire = denumire; // <-- atașăm titlul local

      setBugete((prev) => [bugetNou, ...prev]);
      setSuma("");
      setPerioada("");
      setDenumire(""); // <-- resetăm titlul
      setDataInceput("");
      setShowForm(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchBugete();
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
        <h1>Secțiunea Bugete</h1>
        <p>Vizualizează și gestionează bugetele alocate pe categorii sau scopuri.</p>

        <div className="dashboard-container">
          {/* Cadran 1 – Bugete alocate */}
          <div className="card">
            <div className="card-header">
              <h2>Bugete Alocate</h2>
              <button className="add-button" onClick={toggleForm}>+</button>
            </div>

            {showForm && (
              <div className="modal-overlay" onClick={() => setShowForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="close-button" onClick={() => setShowForm(false)}>×</button>
                  <h3>Adaugă Buget</h3>
                  <form onSubmit={handleAdaugaBuget} className="form-adaugare">
                    <input
                      type="text"
                      placeholder="Titlul bugetului"
                      value={denumire}
                      onChange={(e) => setDenumire(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Suma"
                      value={suma}
                      onChange={(e) => setSuma(e.target.value)}
                      required
                    />
                    <select
                      value={perioada}
                      onChange={(e) => setPerioada(e.target.value)}
                      required
                    >
                      <option value="">Selectează perioada</option>
                      <option value="saptamana">Săptămână</option>
                      <option value="luna">Lună</option>
                      <option value="an">An</option>
                    </select>
                    <input
                      type="date"
                      value={dataInceput}
                      onChange={(e) => setDataInceput(e.target.value)}
                      required
                    />
                    <button type="submit">Adaugă</button>
                  </form>
                </div>
              </div>
            )}

            <ul className="cheltuieli-list">
              {bugete.length === 0 ? (
                <p style={{ textAlign: "center", color: "#888" }}>
                  Nu ai încă bugete salvate
                </p>
              ) : (
                bugete.map((item) => {
                  const inceput = new Date(item.data_inceput);
                  const sfarsit = new Date(inceput);
                  const durataZile =
                    item.perioada === "saptamana" ? 7 :
                    item.perioada === "luna" ? 30 : 365;
                  sfarsit.setDate(inceput.getDate() + durataZile);

                  return (
                    <li key={item.id} className="cheltuiala-item">
                      <div className="left">
                        <strong>{item.denumire || "Buget fără titlu"}</strong><br />
                        <small>
                          {inceput.toLocaleDateString()} - {sfarsit.toLocaleDateString()}
                        </small>
                      </div>
                      <div className="right">
                        {item.suma} RON
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Cadran 2 – temporar gol */}
          <div className="card">
            <h2>Vizualizări bugete</h2>
            <p style={{ textAlign: "center", color: "#888" }}>Conținutul va fi adăugat ulterior.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bugete;
