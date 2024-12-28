from flask import Flask, request, jsonify
from flask_cors import CORS
from db import update_user_schedule, find_schedule, add_request, assign_coverages, find_outgoing_requests, is_admin

app = Flask(__name__)
CORS(app)


@app.route('/api/update-schedule', methods=['POST'])
def update_schedule():
    data = request.json
    ap = data.get('ap')
    bp = data.get('bp')
    al = data.get('al')
    bl = data.get('bl')
    email = data.get('email')

    print(f"Received: ap={ap}, bp={bp}, al={al}, bl={bl}, email={email}")
    update_user_schedule(email, ap, bp, al, bl)

    return jsonify({"success": True, "message": "Schedule updated successfully"})


@app.route('/api/submit-request', methods=['POST'])
def submit_request():
    data = request.json
    date = data.get('date')
    startTime = data.get('startTime')
    endTime = data.get('endTime')
    name = data.get('name')
    email = data.get('email')

    print(
        f"Received: date={date}, startTime={startTime}, endTime={endTime}, name={name}, email={email}")

    add_request(date, startTime, endTime, name, email)

    print(assign_coverages("2024-12-25", "A"))

    return jsonify({"success": True, "message": "Request submitted successfully"})


@app.route('/api/assign-coverages', methods=['POST'])
def assign_coverages_route():
    data = request.json
    date = data.get('date')
    day = data.get('day')

    print(f"Received: date={date}, day={day}")

    assign_coverages(date, day)

    return jsonify({"success": True, "message": "Coverages assigned successfully"})


@app.route('/api/get-schedule', methods=['GET'])
def get_schedule():
    email = request.args.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user_schedule = find_schedule(email)

    if len(user_schedule.keys()) == 1:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({"success": True, "data": user_schedule})


@app.route('/api/is-admin', methods=['GET'])
def check_admin():
    email = request.args.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    # print(f"[check_admin] Received: email={email}, result={is_admin(email)}")
    return jsonify({"success": True, "data": is_admin(email)})


@app.route('/api/get-outgoing-requests', methods=['GET'])
def get_outgoing_requests():
    email = request.args.get("email")

    print(f"[get_outgoing_requests] Received: email={email}")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user_requests = find_outgoing_requests(email)

    return jsonify({"success": True, "data": user_requests})


if __name__ == '__main__':
    app.run(debug=True)
