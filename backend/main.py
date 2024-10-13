from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React frontend

# Load cases from the JSON file
with open('cases.json', 'r') as f:
    cases = json.load(f)

# In-memory storage for game data
games = {}

# Endpoint to get available cases
@app.route('/api/cases', methods=['GET'])
def get_available_cases():
    available_cases = [{"name": case["case_name"], "description": case["description"]} for case in cases]
    return jsonify(available_cases)

# Endpoint to start a game and return case details
@app.route('/api/start_game', methods=['POST'])
def start_game():
    data = request.json
    case_name = data.get('case_name')
    player1_id = data.get('player1_id')
    player2_id = data.get('player2_id')

    # Find the selected case by case_name
    selected_case = next((case for case in cases if case['case_name'] == case_name), None)

    if not selected_case:
        return jsonify({"error": "Case not found"}), 404

    # Create the game
    game_id = "game1"  # Static game_id for now, can be dynamic
    games[game_id] = {
        "case": selected_case,
        "turn": player1_id,  # Start with player 1 (Plaintiff)
        "player1": {"id": player1_id, "role": "Plaintiff", "arguments": []},
        "player2": {"id": player2_id, "role": "Defendant", "arguments": []}
    }

    # Send the case details and role-specific file
    response_data = {
        "case_description": selected_case["description"],
        "plaintiff_file": selected_case["plaintiff_file"],
        "defendant_file": selected_case["defendant_file"]
    }

    return jsonify(response_data)

# Endpoint to submit an argument
@app.route('/api/submit_argument', methods=['POST'])
def submit_argument():
    data = request.json
    game_id = data.get("game_id")
    player_id = data.get("player_id")
    argument = data.get("argument")

    if not game_id or not player_id or not argument:
        return jsonify({"error": "Game ID, player ID, and argument are required"}), 400

    game = games.get(game_id)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    # Check whose turn it is
    if game["turn"] != player_id:
        return jsonify({"error": "Not your turn"}), 403

    # Append the argument to the corresponding player
    if player_id == game["player1"]["id"]:
        game["player1"]["arguments"].append(argument)
        game["turn"] = game["player2"]["id"]  # Switch to the other player's turn
    else:
        game["player2"]["arguments"].append(argument)
        game["turn"] = game["player1"]["id"]

    return jsonify({"message": "Argument submitted successfully"})

# Endpoint to get the verdict
@app.route('/api/verdict', methods=['POST'])
def get_verdict():
    data = request.json
    game_id = data.get("game_id")

    game = games.get(game_id)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    # Ensure both players have submitted their arguments before proceeding
    if not game["player1"]["arguments"] or not game["player2"]["arguments"]:
        return jsonify({"error": "Both players must submit their arguments before getting a verdict"}), 400

    # Fetch the arguments from both players
    plaintiff_args = " ".join(game["player1"]["arguments"])
    defendant_args = " ".join(game["player2"]["arguments"])

    # Generate the verdict based on the arguments (for now, let's make it simple)
    verdict = f"The plaintiff argued: {plaintiff_args}. The defendant argued: {defendant_args}. Verdict: Based on these arguments, the judge rules in favor of the {'Plaintiff' if len(plaintiff_args) > len(defendant_args) else 'Defendant'}."

    return jsonify({"verdict": verdict})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
