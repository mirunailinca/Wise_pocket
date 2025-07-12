import React, { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";


const Sfaturi = () => {
 const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const [sfaturiPersonalizate, setSfaturiPersonalizate] = useState([]);
    useEffect(() => {
    const fetchSfaturi = async () => {
      try {
        const response = await axios.get("http://localhost:4848/sfaturi/personalizate/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSfaturiPersonalizate(response.data.sfaturi);
      } catch (error) {
        console.error("Eroare la preluarea sfaturilor:", error);
      }
    };

    fetchSfaturi();
  }, [location]);

  // const sfaturiGenerale = [
  //   "Notează fiecare cheltuială, oricât de mică, pentru a avea control complet.",
  //   "Creează un buget periodic și respectă-l.",
  //   "Evită cheltuielile impulsive printr-o listă de priorități.",
  //   "Regula 50/30/20: 50% din venituri pentru necesități, 30% pentru dorințe, 20% pentru economii.",
  //   "Evaluează lunar cheltuielile și ajustează bugetul în funcție de nevoi.",
  //   "Stabilește un fond de urgență pentru cheltuieli neprevăzute.",  
  // ];

  const iconiteSugestive = new Map();

sfaturiPersonalizate.forEach((sfat) => {
  const lower = sfat.toLowerCase();

  if (lower.includes("alimentară") && !iconiteSugestive.has("alimente")) {
    iconiteSugestive.set("alimente", { src: "/sfaturi/alimente.png" });
  }
  if (lower.includes("felicitări") && !iconiteSugestive.has("felicitari")) {
    iconiteSugestive.set("felicitari", { src: "/sfaturi/congratulation.png" });
  }
  if (lower.includes("casă") && !iconiteSugestive.has("casa")) {
    iconiteSugestive.set("casa", { src: "/sfaturi/casa.png" });
  }
  if ((lower.includes("crescut") || lower.includes("impulsive")) && !iconiteSugestive.has("crestere")) {
    iconiteSugestive.set("crestere", { src: "/sfaturi/crestere.png" });
  }
  if (lower.includes("călătorii") && !iconiteSugestive.has("calatorii")) {
    iconiteSugestive.set("calatorii", { src: "/sfaturi/travel.png" });
  }
  if (lower.includes("îmbrăcăminte") && !iconiteSugestive.has("imbracaminte")) {
    iconiteSugestive.set("imbracaminte", { src: "/sfaturi/imbracaminte.png" });
  }
  if (lower.includes("sănătate") && !iconiteSugestive.has("sanatate")) {
    iconiteSugestive.set("sanatate", { src: "/sfaturi/sanatate.png" });
  }
  if (lower.includes("transport") && !iconiteSugestive.has("transport")) {
    iconiteSugestive.set("transport", { src: "/sfaturi/transport.png" });
  }
  if (lower.includes("divertisment") && !iconiteSugestive.has("divertisment")) {
    iconiteSugestive.set("divertisment", { src: "/sfaturi/distractie.png" });
  }
  if (lower.includes("cadouri") && !iconiteSugestive.has("cadouri")) {
    iconiteSugestive.set("cadouri", { src: "/sfaturi/cadou.png" });
  }
});


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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
  <img src="/sfaturi/financial-advisor.png" alt="Iconiță sfaturi personalizate" style={{ width: "50px", height: "50px" }} />
  <h2 style={{ margin: 0 }}>Sfaturi personalizate</h2>
  </div>

    <ul style={{ paddingLeft: "20px" }}>
      {sfaturiPersonalizate.map((sfat, index) => (
        <li key={index} style={{ marginBottom: "10px", color: "#333", fontSize: "16px" }}>
          <ReactMarkdown >{sfat}</ReactMarkdown>
        </li>
      ))}
    </ul>
    {iconiteSugestive.size > 0 && (
      <div style={{ marginTop: "20px", display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
        {[...iconiteSugestive.values()].map((icon, index) => (
          <img key={index} src={icon.src} alt={icon.alt} style={{ width: "80px", height: "80px" }} />
        ))}
      </div>
    )}


          </div>

          <div className="card card-sfaturi">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
  <img src="/sfaturi/sfaturi-dreapta.png" alt="Iconiță sfat" style={{ width: "50px", height: "50px" }} />
  <h2 style={{ margin: 0 }}>Sfaturi generale</h2>
  </div>

            <ul>
              <ul style={{ paddingLeft: "20px" }}>
  <li style={{ marginBottom: "10px" }}>
    Notează <strong>fiecare cheltuială</strong>, oricât de mică, pentru a avea control complet.
  </li>
  <li style={{ marginBottom: "10px" }}>
    Creează un buget periodic și respectă-l.
  </li>
  <li style={{ marginBottom: "10px" }}>
    Evită cheltuielile impulsive printr-o listă de priorități.
  </li>
  <li style={{ marginBottom: "10px" }}>
    Regula <strong>50/30/20</strong>: 50% din venituri pentru necesități, 30% pentru dorințe, 20% pentru economii.
  </li>
  <li style={{ marginBottom: "10px" }}>
    <strong>Evaluează</strong> lunar cheltuielile și <strong>ajustează</strong> bugetul în funcție de nevoi.
  </li>
  <li style={{ marginBottom: "10px" }}>
    Stabilește un fond de urgență pentru cheltuieli neprevăzute.
  </li>
</ul>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sfaturi;
