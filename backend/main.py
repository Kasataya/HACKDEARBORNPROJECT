import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
import logging
from openai import OpenAI
from config import GPT_API_KEY

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load cases from the JSON file
with open('cases.json', 'r') as f:
    cases = json.load(f)

if not GPT_API_KEY:
    raise ValueError("No OpenAI API key found. Check your config.py file")

# Initialize OpenAI client
client = OpenAI(api_key=GPT_API_KEY)

# In-memory storage for game data
games = {}
waiting_games = []

MAX_TURNS = 6  # Maximum number of turns before forcing a verdict

@app.route('/api/cases', methods=['GET'])
def get_available_cases():
    available_cases = [{"name": case["case_name"], "description": case["description"]} for case in cases]
    return jsonify(available_cases)

@app.route('/api/start_game', methods=['POST'])
def start_game():
    data = request.json
    case_name = data.get('case_name')
    player_role = data.get('player_role')

    if not case_name or not player_role:
        return jsonify({"error": "Case name and player role are required"}), 400

    selected_case = next((case for case in cases if case['case_name'] == case_name), None)

    if not selected_case:
        return jsonify({"error": "Case not found"}), 404

    for game in waiting_games:
        if game['case']['case_name'] == case_name and game['player_role'] != player_role:
            game_id = game['game_id']
            player_id = str(uuid.uuid4())
            opponent_id = game['player_id']

            player1_id = player_id if player_role == 'Plaintiff' else opponent_id
            player2_id = opponent_id if player_role == 'Plaintiff' else player_id

            games[game_id] = {
                "case": selected_case,
                "turn": player1_id,
                "turn_count": 0,
                "player1": {"id": player1_id, "role": "Plaintiff", "arguments": []},
                "player2": {"id": player2_id, "role": "Defendant", "arguments": []}
            }

            waiting_games.remove(game)

            return jsonify({
                "game_id": game_id,
                "player_id": player_id,
                "case_description": selected_case["description"],
                "case_file": selected_case["plaintiff_file"] if player_role == "Plaintiff" else selected_case["defendant_file"]
            })

    game_id = str(uuid.uuid4())
    player_id = str(uuid.uuid4())

    waiting_games.append({
        "game_id": game_id,
        "player_id": player_id,
        "case": selected_case,
        "player_role": player_role
    })

    return jsonify({
        "message": "Waiting for an opponent to join...",
        "game_id": game_id,
        "player_id": player_id,
    })

@app.route('/api/submit_argument', methods=['POST'])
def submit_argument():
    data = request.json
    game_id = data.get("game_id")
    player_id = data.get("player_id")
    argument = data.get("argument")

    if not all([game_id, player_id, argument]):
        return jsonify({"error": "Game ID, player ID, and argument are required"}), 400

    game = games.get(game_id)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    if game["turn"] != player_id:
        return jsonify({"error": "Not your turn"}), 403

    if game["turn_count"] >= MAX_TURNS:
        return jsonify({"error": "Maximum turns reached"}), 400

    if player_id == game["player1"]["id"]:
        game["player1"]["arguments"].append(argument)
        game["turn"] = game["player2"]["id"]
    else:
        game["player2"]["arguments"].append(argument)
        game["turn"] = game["player1"]["id"]

    game["turn_count"] += 1

    return jsonify({"message": "Argument submitted successfully", "turn_count": game["turn_count"]})

@app.route('/api/game_state', methods=['POST'])
def get_game_state():
    data = request.json
    game_id = data.get("game_id")

    game = games.get(game_id)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    return jsonify({
        "turn": game["turn"],
        "turn_count": game["turn_count"],
        "arguments": {
            "plaintiff": game["player1"]["arguments"],
            "defendant": game["player2"]["arguments"]
        },
        "case_description": game["case"]["description"]
    })

@app.route('/api/verdict', methods=['POST'])
def get_verdict():
    data = request.json
    game_id = data.get("game_id")

    logger.debug(f"Received verdict request for game_id: {game_id}")

    game = games.get(game_id)

    if not game:
        logger.error("Game not found")
        return jsonify({"error": "Game not found"}), 404

    plaintiff_args = " ".join(game["player1"]["arguments"])
    defendant_args = " ".join(game["player2"]["arguments"])
    plaintiff_file = game['case'].get('plaintiff_file', '')
    defendant_file = game['case'].get('defendant_file', '')

    prompt = f"""
    Case: {game['case']['case_name']}
    Description: {game['case']['description']}

    Plaintiff's File: {plaintiff_file}
    Defendant's File: {defendant_file}

    Plaintiff's Arguments: {plaintiff_args}
    Defendant's Arguments: {defendant_args}

    As a fair and impartial judge, determine who should win the case and explain the reasoning behind your verdict.
    Please provide your verdict in the following format:
    Winner: [Plaintiff/Defendant]
    Reasoning: [Your detailed explanation]
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fair and impartial judge deciding this case based on the arguments presented."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )

        verdict = response.choices[0].message.content
        logger.debug(f"Verdict received: {verdict}")
        return jsonify({"verdict": verdict})

    except Exception as e:
        logger.error(f"Error generating verdict: {str(e)}")
        return jsonify({"error": f"Error generating verdict: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
