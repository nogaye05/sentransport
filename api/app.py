import json
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request


# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)

# Charger les données depuis le fichier JSON
with open("ligne_ddd.json", "r") as f:
    lignes = json.load(f)

# --- ROUTES ---

@app.route("/")
def accueil():
    #Endpoint d'accueil : liste les endpoints disponibles
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    #Retourne toutes les lignes
    return jsonify(lignes)

@app.route("/lignes/recherche")
def rechercher_lignes():
    #Filtre les lignes dont le départ ou l'arrivée contient le paramètre q.
    q = request.args.get("q", "").lower()
    resultats = [
        l for l in lignes
        if q in l["depart"].lower() or q in l["arrivee"].lower()
    ]
    return jsonify(resultats)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )

    if ligne is None:
      return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)
if __name__ == "__main__":
    app.run(debug=True, port=5000)

# EXERCICE 1

@app.route("/arrets")
def get_arrets():
    #retourne tous les arrêts uniques de toutes les lignes.
    tous_les_arrets = set()
    for ligne in lignes:
        for arret in ligne["listeArrets"]:
            tous_les_arrets.add(arret)
    return jsonify(sorted(list(tous_les_arrets)))

# Exercice 2

@app.route("/stats")
def get_stats():
    #Retourne des statistiques globales sur les lignes.
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    return jsonify({
        "nombre_lignes":      len(lignes),
        "total_arrets":       sum(l["arrets"] for l in lignes),
        "ligne_plus_darrets": ligne_max["numero"],
    })



if __name__ == "__main__":
    app.run(debug=True, port=5000)



