import './LigneBus.css';
function LigneBus({ numero, depart, arrivee, arrets, estSelectionnee, onClick }) {
  return (
    <div
      className={estSelectionnee ? "ligne-bus ligne-bus-active" : "ligne-bus"}
      onClick={onClick}
    >
      <div className="ligne-numero">{numero}</div>
      <div className="ligne-info">
        <span className="ligne-trajet">{depart} &rarr; {arrivee}</span>
        <span className="ligne-arrets">{arrets} arrets</span>
      </div>
    </div>
  );
}
export default LigneBus;