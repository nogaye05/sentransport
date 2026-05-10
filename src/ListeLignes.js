import React, { useState } from "react";
import LigneBus from "./LigneBus";
import "./ListeLignes.css";

function ListeLignes({ lignes }) {
  const [selectedLine, setSelectedLine] = useState(null);

  return (
    <div className="liste-lignes">
      <h2 className="liste-titre">Lignes Dakar Dem Dikk</h2>
      <p className="liste-description">
        {lignes.length} lignes disponibles
      </p>

      {lignes.map((ligne) => (
        <div
          key={ligne.id}
          className={`ligne-bus ${selectedLine === ligne.id ? "ligne-bus-active" : ""}`}
          onClick={() => setSelectedLine(ligne.id)}
        >
          <LigneBus
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            color={ligne.color}
          />
        </div>
      ))}
    </div>
  );
}

export default ListeLignes;
