from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import openai
import uuid  # For generating unique IDs
import logging  # Add this import
from config import GPT_API_KEY  # Make sure you have a config.py file with your GPT API key

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React frontend

# Set the OpenAI API key
openai.api_key = GPT_API_KEY

# Load cases from the JSON file
with open('cases.json', 'r') as f:
    cases = json.load(f)

# In-memory storage for game data
games = {}
waiting_games = []

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
    player_role = data.get('player_role')  # Get player role from the client

    # Find the selected case by case_name
    selected_case = next((case for case in cases if case['case_name'] == case_name), None)

    if not selected_case:
        return jsonify({"error": "Case not found"}), 404

    # Check if there is a waiting game for this case and role
    for game in waiting_games:
        if game['case']['case_name'] == case_name and game['player_role'] != player_role:
            game_id = game['game_id']
            player_id = str(uuid.uuid4())
            opponent_id = game['player_id']

            # Assign roles
            if player_role == 'Plaintiff':
                player1_id = player_id
                player2_id = opponent_id
            else:
                player1_id = opponent_id
                player2_id = player_id

            # Create the game
            games[game_id] = {
                "case": selected_case,
                "turn": player1_id,  # Start with player 1 (Plaintiff)
                "player1": {"id": player1_id, "role": "Plaintiff", "arguments": []},
                "player2": {"id": player2_id, "role": "Defendant", "arguments": []}
            }

            waiting_games.remove(game)

            response_data = {
                "game_id": game_id,
                "player_id": player_id,
                "case_description": selected_case["description"],
                "case_file": selected_case["plaintiff_file"] if player_role == "Plaintiff" else selected_case["defendant_file"]
            }

            return jsonify(response_data)

    # No waiting game found, create a new one
    game_id = str(uuid.uuid4())
    player_id = str(uuid.uuid4())

    waiting_games.append({
        "game_id": game_id,
        "player_id": player_id,
        "case": selected_case,
        "player_role": player_role
    })

    response_data = {
        "message": "Waiting for an opponent to join...",
        "game_id": game_id,
        "player_id": player_id,
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

# Endpoint to get the game state
@app.route('/api/game_state', methods=['POST'])
def get_game_state():
    data = request.json
    game_id = data.get("game_id")

    game = games.get(game_id)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    response_data = {
        "turn": game["turn"],
        "arguments": {
            "plaintiff": game["player1"]["arguments"],
            "defendant": game["player2"]["arguments"]
        },
        "case_description": game["case"]["description"]
    }

    return jsonify(response_data)

# Endpoint to get the verdict using GPT API
@app.route('/api/verdict', methods=['POST'])
def get_verdict():
    data = request.json
    game_id = data.get("game_id")

    logging.debug(f"Received verdict request for game_id: {game_id}")

    game = games.get(game_id)

    if not game:
        logging.error("Game not found")
        return jsonify({"error": "Game not found"}), 404

    # Ensure both players have submitted their arguments before proceeding
    if not game["player1"]["arguments"] or not game["player2"]["arguments"]:
        logging.error("Both players must submit their arguments before getting a verdict")
        return jsonify({"error": "Both players must submit their arguments before getting a verdict"}), 400

    # Fetch the arguments and case files
    plaintiff_args = " ".join(game["player1"]["arguments"])
    defendant_args = " ".join(game["player2"]["arguments"])
    plaintiff_file = game['case'].get('plaintiff_file', '')
    defendant_file = game['case'].get('defendant_file', '')

    # Prepare the prompt for GPT
    prompt = f"""
Case: {game['case']['case_name']}
Description: {game['case']['description']}

Plaintiff's File: {plaintiff_file}
Defendant's File: {defendant_file}

Plaintiff's Arguments: {plaintiff_args}
Defendant's Arguments: {defendant_args}

As a fair and impartial judge, determine who should win the case and explain the reasoning behind your verdict.
"""

    logging.debug("Prompt prepared for OpenAI API.")
    logging.debug(f"Prompt length: {len(prompt)} characters")

    try:
        # Call OpenAI API to generate the verdict
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a fair and impartial judge deciding this case based on the arguments presented."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=500,
            temperature=0.7
        )

        verdict = response['choices'][0]['message']['content']
        logging.debug(f"Verdict received: {verdict}")
        return jsonify({"verdict": verdict})

    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error: {e}")
        return jsonify({"error": f"OpenAI API error: {e}"}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {e}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
