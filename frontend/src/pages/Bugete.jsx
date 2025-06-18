import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../App.css";

const Bugete = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [suma, setSuma] = useState("");
  const [perioada, setPerioada] = useState("");
  const [denumire, setDenumire] = useState("");
  const [dataInceput, setDataInceput] = useState("");
  const [bugete, setBugete] = useState([]);
  const [selectedBuget, setSelectedBuget] = useState(null);
  const [progres, setProgres] = useState(null);

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

  const handleSelectBuget = async (buget) => {
    setSelectedBuget(buget);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4848/bugete/${buget.id}/progres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProgres({ sumaAlocata: data.sumaAlocata, totalCheltuit: data.totalCheltuit });
    } catch (err) {
      console.error("Eroare la obținerea progresului bugetului:", err);
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
          denumire
        }),
      });

      if (!response.ok) throw new Error("Eroare la adăugarea bugetului");
      const bugetNou = await response.json();

      bugetNou.denumire = denumire;

      setBugete((prev) => [bugetNou, ...prev]);
      setSuma("");
      setPerioada("");
      setDenumire("");
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
                    <li
                      key={item.id}
                      className="cheltuiala-item"
                      onClick={() => handleSelectBuget(item)}
                      style={{ cursor: "pointer" }}
                    >
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

          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Progres buget</h2>
            {selectedBuget && progres ? (
              <div>
                <p><strong>{selectedBuget.denumire}</strong></p>
                <p style={{ fontSize: "13px", color: "#555", marginBottom: "5px" }}>
                  {new Date(selectedBuget.data_inceput).toLocaleDateString()} – {(() => {
                    const sf = new Date(selectedBuget.data_inceput);
                    if (selectedBuget.perioada === "saptamana") sf.setDate(sf.getDate() + 7);
                    else if (selectedBuget.perioada === "luna") sf.setDate(sf.getDate() + 30);
                    else sf.setDate(sf.getDate() + 365);
                    return sf.toLocaleDateString();
                  })()}
                </p>
                {(() => {
                  const procent = (progres.totalCheltuit / progres.sumaAlocata) * 100;
                  let culoare = "#6A3937";
                  if (procent < 70) culoare = "#4CAF50";
                  else if (procent < 100) culoare = "#FFA500";
                  else culoare = "#B00020";
                  return (
                    <>
                      <div style={{ background: "#eee", borderRadius: "10px", height: "20px", width: "100%" }}>
                        <div
                          style={{
                            width: `${Math.min(procent, 100)}%`,
                            background: culoare,
                            height: "100%",
                            borderRadius: "10px"
                          }}
                        />
                      </div>
                      <p style={{ marginTop: "15px", color: culoare }}>
                        {Math.round(procent)}% din buget utilizat
                      </p>
                      {procent > 100 && (
                        <p style={{ color: culoare, fontWeight: "bold" }}>
                          ⚠️ Ai depășit bugetul cu {(progres.totalCheltuit - progres.sumaAlocata).toFixed(2)} RON!
                        </p>
                      )}
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        📉 Cheltuit: <strong>{progres.totalCheltuit} RON</strong> din {progres.sumaAlocata} RON
                      </p>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#888" }}>Selectează un buget pentru a vedea progresul.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bugete;
