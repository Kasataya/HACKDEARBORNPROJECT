import json
import openai
from config import GPT_API_KEY
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load cases from a JSON file
with open('cases.json', 'r') as f:
    cases = json.load(f)

# Set the OpenAI API key
openai.api_key = GPT_API_KEY

# In-memory storage for sessions and games
player_sessions = {}
games = {}

# Endpoint to get available cases
@app.route('/api/cases', methods=['GET'])
def get_available_cases():
    available_cases = [{"name": case["case_name"], "description": case["description"]} for case in cases]
    return jsonify(available_cases)

# Endpoint to register a player
@app.route('/api/register_player', methods=['POST'])
def register_player():
    data = request.json
    player_id = data.get("player_id")
    player_name = data.get("player_name")

    if not player_id or not player_name:
        return jsonify({"error": "Player ID and name are required"}), 400

    player_sessions[player_id] = {"name": player_name}
    return jsonify({"message": "Player registered successfully", "player_id": player_id})

# Endpoint to assign a case to players
@app.route('/api/assign_case', methods=['POST'])
def assign_case():
    data = request.json
    case_name = data.get("case_name")
    player1 = data.get("player1")
    player2 = data.get("player2")

    if not case_name or not player1 or not player2:
        return jsonify({"error": "Invalid input"}), 400

    selected_case = next((case for case in cases if case["case_name"] == case_name), None)

    if not selected_case:
        return jsonify({"error": "Case not found"}), 404

    player1_data = {
        "role": "Plaintiff",
        "case_file": selected_case["plaintiff_file"]
    }

    player2_data = {
        "role": "Defendant",
        "case_file": selected_case["defendant_file"]
    }

    return jsonify({"player1": player1_data, "player2": player2_data})

# Endpoint to start a game
@app.route('/api/start_game', methods=['POST'])
def start_game():
    data = request.json
    game_id = data.get("game_id")
    case_name = data.get("case_name")
    player1_id = data.get("player1_id")
    player2_id = data.get("player2_id")

    if not game_id or not case_name or not player1_id or not player2_id:
        return jsonify({"error": "All game parameters are required"}), 400

    selected_case = next((case for case in cases if case["case_name"] == case_name), None)

    if not selected_case:
        return jsonify({"error": "Case not found"}), 404

    games[game_id] = {
        "case": selected_case,
        "turn": player1_id,
        "player1": {"id": player1_id, "role": "Plaintiff", "case_file": selected_case["plaintiff_file"], "arguments": []},
        "player2": {"id": player2_id, "role": "Defendant", "case_file": selected_case["defendant_file"], "arguments": []}
    }

    return jsonify({"message": "Game started successfully", "game_id": game_id})

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

    if game["turn"] != player_id:
        return jsonify({"error": "Not your turn"}), 403

    if player_id == game["player1"]["id"]:
        game["player1"]["arguments"].append(argument)
        game["turn"] = game["player2"]["id"]
    else:
        game["player2"]["arguments"].append(argument)
        game["turn"] = game["player1"]["id"]

    return jsonify({"message": "Argument submitted successfully"})

# Endpoint to get the verdict using GPT API
@app.route('/api/verdict', methods=['POST'])
def get_verdict():
    data = request.json
    game_id = data.get("game_id")

    game = games.get(game_id)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    plaintiff_args = " ".join(game["player1"]["arguments"])
    defendant_args = " ".join(game["player2"]["arguments"])

    # Prepare the prompt for GPT
    prompt = f"""
    Case: {game['case']['case_name']}
    Description: {game['case']['description']}

    Plaintiff's Arguments: {plaintiff_args}
    Defendant's Arguments: {defendant_args}

    Based on the arguments presented by both the plaintiff and the defendant, determine who should win the case and explain the reasoning behind your verdict.
    """

    try:
        # Call GPT API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a judge evaluating a legal case. You are also a grumpy judge"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )

        verdict = response.choices[0].message['content']
        return jsonify({"verdict": verdict})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
