from flask import Flask, request, jsonify
from flask_cors import CORS
from db import update_user_schedule, find_schedule, add_request, assign_coverages, find_outgoing_requests, is_admin, get_teacher_involvements_for_date, get_all_users, get_all_coverages_for_date, name_from_email
from utils import format_name

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

    return jsonify({"success": True, "message": "Request submitted successfully"})


@app.route('/api/assign-coverages', methods=['POST'])
def assign_coverages_route():
    data = request.json
    date = data.get('date')
    day = data.get('day')
    subs = data.get('substitutes')

    print(f"Received: date={date}, day={day}")

    parsedSubs = {}
    for sub in subs:
        if sub["teacher"] is not None:
            parsedSubs[sub["teacher"]] = sub["substitute"]

    assign_coverages(date, day, parsedSubs)

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


@app.route('/api/get-dashboard-info', methods=['GET'])
def get_dashboard_info():
    email = request.args.get("email")
    date = request.args.get("date")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    teacher_involvements = get_teacher_involvements_for_date(email, date)

    return jsonify({"success": True, "data": teacher_involvements})


@app.route('/api/is-admin', methods=['GET'])
def check_admin():
    email = request.args.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    return jsonify({"success": True, "data": is_admin(email)})


@app.route('/api/get-outgoing-requests', methods=['GET'])
def get_outgoing_requests():
    email = request.args.get("email")

    print(f"[get_outgoing_requests] Received: email={email}")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user_requests = find_outgoing_requests(email)

    return jsonify({"success": True, "data": user_requests})


@app.route('/api/get-all-teachers', methods=['GET'])
def get_all_teachers():
    all_users = get_all_users()
    new_dict = [{key: value for key, value in u.items() if key != "_id"}
                for u in all_users]

    for user in new_dict:
        user["name"] = format_name(user["name"])

    return jsonify({"success": True, "data": new_dict})


@app.route('/api/get-all-coverages-for-date', methods=['GET'])
def get_coverages_for_date():
    date = request.args.get("date")

    result = get_all_coverages_for_date(date)
    new_dict = [{key: value for key, value in u.items() if key != "_id"}
                for u in result]

    for cov_req in new_dict:
        if cov_req["teacher1"] is not None:
            cov_req["teacher1"] = name_from_email(cov_req["teacher1"])
        if cov_req["teacher2"] is not None:
            cov_req["teacher2"] = name_from_email(cov_req["teacher2"])

    return jsonify({"success": True, "data": new_dict})


if __name__ == '__main__':
    app.run(debug=True)
