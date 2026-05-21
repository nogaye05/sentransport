import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
function App() {
  // 1. Trois etats
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [nbRecherches, setNbRecherches]           = useState(0);  

  // 2. Charger les donnees au demarrage
  function chargerLignes() {
    setChargement(true);
    setErreur(null);

    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  // Charger au démarrage
  useEffect(() => {
    chargerLignes();
  }, []);
  // Filtrer les lignes selon le texte tapé
  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      // ── Exo 3 : fetch les détails au clic ──
      fetch(`http://localhost:5000/lignes/${ligne.id}`)
        .then(r => r.json())
        .then(detail => setLigneSelectionnee(detail));
    }
  }

  function handleRecherche(texte) {
    setRecherche(texte);
    setNbRecherches(nbRecherches + 1);
      
  }

// Écran de chargement
if (chargement) {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p className="message-chargement">
          Chargement des lignes...
        </p>
      </main>
    </div>
  );
}

// Écran d'erreur
if (erreur) {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <div className="message-erreur">
          <p>Impossible de charger les lignes.</p>
          <p className="erreur-detail">{erreur}</p>
          <p>
            Vérifiez que le serveur Flask est lancé
            (python api/app.py).
          </p>
        </div>
      </main>
    </div>
  );
}



  return (
    <div className="App">
      <Header />
      <main className="contenu">
         {/* Exo 1 : bouton Recharger */}
        <div className="barre-top">
          <button className="btn-recharger" onClick={chargerLignes}>
            Recharger
          </button>
        </div>

        {/* Exo 3 : compteur de recherches */}
        {nbRecherches > 0 && (
          <p className="compteur-recherche">
            Vous avez effectué <strong>{nbRecherches}</strong> recherche
            {nbRecherches > 1 ? 's' : ''}
          </p>
        )}

        {/* Exo 1 : champ de recherche avec bouton Effacer */}
        <Recherche valeur={recherche} onChange={handleRecherche} />

        {/* Compteur de lignes */}
        <p className="resultat-recherche">
          <span>
            {lignesFiltrees.length} ligne
            {lignesFiltrees.length > 1 ? 's' : ''} trouvée
            {lignesFiltrees.length > 1 ? 's' : ''}
          </span>
        </p>

        {/* Exo 2 : message si aucune ligne trouvée */}
        {lignesFiltrees.length === 0 && (
          <div className="aucune-ligne">
            <p>Aucune ligne trouvée pour "<strong>{recherche}</strong>"</p>
            <p className="aucune-ligne-sub">
              Essayez un autre quartier ou numéro de ligne.
            </p>
          </div>
        )}

        {/* Liste des lignes filtrées */}
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee !== null && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}

        {/* Détail de la ligne sélectionnée */}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}

      </main>
      <Footer />
    </div>
  );
}

export default App;