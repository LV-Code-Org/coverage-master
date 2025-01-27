from pymongo import MongoClient
from utils import Teacher, Interval, format_name
from algorithms import assign_subs_full_day, fill_teachers
from datetime import datetime
import os
import pandas as pd

MONGO_URI = os.environ.get("DATABASE_URL")

client = MongoClient(MONGO_URI)

db = client.coveragedb
users = db.User

requestDB = client.requestsdb
requests = requestDB.requests


def update_user_schedule(email, ap, bp, al, bl) -> None:
    """
    Update the schedule for a user based on their email.

    :param email: The unique email of the user.
    :param ap: Prep A value.
    :param bp: Prep B value.
    :param al: Lunch A value.
    :param bl: Lunch B value.
    """
    query = {"email": email}
    update = {
        "$set": {
            "prepA": ap,
            "prepB": bp,
            "lunchA": al,
            "lunchB": bl
        }
    }

    result = users.update_one(query, update)

    if result.matched_count > 0:
        print("Successfully updated the user's schedule.")
    else:
        print("User not found or no updates made.")


def find_schedule(email: str) -> dict:
    """
    Fetch the user's schedule based on their email.

    :param email: The unique email of the user.
    """

    user = users.find_one({"email": email})

    if not user:
        return {"message": "User not found"}

    user_schedule = {
        "prepA": user.get("prepA", 1),
        "prepB": user.get("prepB", 2),
        "lunchA": user.get("lunchA", 1),
        "lunchB": user.get("lunchB", 1)
    }

    return user_schedule


def is_admin(email: str) -> bool:
    """
    Check if a user is an admin based on their email.

    :param email: The unique email of the user.
    """
    user = users.find_one({"email": email})

    if not user:
        return False

    return user.get("role") == "ADMIN"


def find_outgoing_requests(email: str) -> list:
    """
    Fetch all requests made by a user based on their email.

    :param email: The unique email of the user.
    """
    user_requests = requests.find({"email": email})
    if not user_requests:
        return []

    def is_today_before(date: str) -> bool:
        today = datetime.today().strftime("%Y-%m-%d")
        today_obj = datetime.strptime(today, "%Y-%m-%d")
        date2_obj = datetime.strptime(date, "%Y-%m-%d")

        return today_obj < date2_obj

    parsed = [{"date": item.get("date"), "startTime": item.get("startTime"), "endTime": item.get("endTime")}
              for item in list(user_requests)]

    parsed = [item for item in parsed if is_today_before(item.get("date"))]

    return sorted(parsed, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d"))


def add_request(date: str, startTime: str, endTime: str, name: str, email: str) -> None:
    """
    Add a request to the database.

    :param date: The date of the request.
    :param startTime: The start time of the request.
    :param endTime: The end time of the request.
    :param name: The name of the user.
    :param email: The unique email of the user.
    """
    request = {
        "date": date,
        "startTime": startTime,
        "endTime": endTime,
        "name": name,
        "email": email,
        "sub": None,
        "isSub": False,
        "teacher1": None,
        "teacher2": None
    }

    requests.insert_one(request)
    print("Request added successfully.")


def get_all_users() -> list:
    """
    Fetches all entries from the User collection.

    Returns:
        list: A list of all user documents from the collection.
    """
    try:
        user_documents = list(users.find({"role": "USER"}))
        return user_documents
    except Exception as e:
        print(f"An error occurred while fetching users: {e}")
        return []


def get_requests_by_date(date: str) -> list:
    """
    Fetches all entries from the Requests collection where the date matches the given date.

    :param date (str): The date to match as a string.

    Returns:
        list: A list of matching request documents from the collection.
    """
    try:
        matching_requests = list(requests.find({"date": date}))
        return matching_requests
    except Exception as e:
        print(f"An error occurred while fetching requests by date: {e}")
        return []


def get_teacher_involvements_for_date(email: str, date: str) -> dict:
    """
    Fetches all coverage requests involving a given teacher on a given date.

    :param email (str): The email of the teacher to match.
    :param date (str): The date, yyyy-mm-dd, to match.

    Returns:
        dict: { outgoing:  [...], covering:  [...] }
    """
    def convert_email_to_name(email: str) -> str:
        """Converts an email to a name."""
        user = users.find_one({"email": email})
        return user.get("name") if user else "Unknown"

    def format_output(documents: list) -> list:
        """Formats the output for the teacher involvements."""
        return [{
            "name": doc.get("name"),
            "startTime": doc.get("startTime"),
            "endTime": doc.get("endTime"),
            "sub": convert_email_to_name(doc.get("sub")) if doc.get("sub") else None,
            "teacher1": convert_email_to_name(doc.get("teacher1")) if doc.get("teacher1") else None,
            "teacher2": convert_email_to_name(doc.get("teacher2")) if doc.get("teacher2") else None,
            "teacher1Email": doc.get("teacher1"),
            "teacher2Email": doc.get("teacher2"),
        } for doc in documents]

    try:
        outgoing_requests = list(requests.find({"email": email, "date": date}))
        covering_requests = list(requests.find(
            {"$or": [{"teacher1": email}, {"teacher2": email}], "date": date}))
        return {"outgoing": format_output(outgoing_requests), "covering": format_output(covering_requests)}
    except Exception as e:
        print(
            f"An error occurred while fetching teacher involvements by date: {e}")
        return {}


def init_request_information(date: str, day: str) -> list:
    """
    Initializes a list of Teacher objects representing the teachers in the system as well as a 
    DataFrame with the requests for a given date and day.

    :param date (str): The date to assign coverages for.
    :param day (str): The day (A or B) that the coverage is on.
    """
    all_users = get_all_users()
    requests = get_requests_by_date(date)
    teacher_list = []
    df_rows = []

    def find_nth_even_odd(number: int) -> int:
        """[1,3,5,7,...] -> [1,2,3,4,...]; [2,4,6,8,...] -> [1,2,3,4,...]"""
        if number % 2 == 0:
            return number // 2
        else:
            return (number // 2) + 1

    for user in all_users:
        prep = find_nth_even_odd(user.get(f"prep{day}"))
        lunch = user.get(f"lunch{day}")
        teacher_list.append(Teacher(user["name"], user["email"], prep, lunch))

    for request in requests:
        interval = Interval(request["startTime"], request["endTime"])
        df_rows.append({
            "Needs Coverage": request.get("name"),
            "Email": request.get("email"),
            "Time": interval,
            "Assigned Sub": request.get("sub") if request.get("sub") else "None",
            "Teacher 1": request.get("teacher1") if request.get("teacher1") else "None",
            "Teacher 2": request.get("teacher2") if request.get("teacher2") else "None"
        })

    df = pd.DataFrame(df_rows)

    return teacher_list, df


def name_from_email(email: str):
    """Return an name from a user's email."""
    try:
        user = users.find_one({"role": "USER", "email": email})
        return user["name"]
    except Exception as e:
        print(f"Error finding user with email {email}: {e}")
        return {}
    

def get_all_coverages_for_date(date: str) -> list:
    """
    Fetches all coverages for a given date.

    :param date (str): The date to fetch coverages for.

    Returns:
        list: A list of coverages for the given date.
    """
    try:
        coverages = list(requests.find({"date": date}))
        return coverages
    except Exception as e:
        print(f"An error occurred while fetching coverages for date: {e}")
        return []


def assign_coverages(date: str, day: str, subs: dict):
    """
    Assigns coverages for a given date and day. Updates the requests collection with the assigned teachers.

    :param date (str): The date to assign coverages for.
    :param day (str): The day (A or B) that the coverage is on.
    """
    teacher_list, df = init_request_information(date, day)

    pd.set_option('display.max_rows', 500)
    pd.set_option('display.max_columns', 500)
    pd.set_option('display.width', 1000)

    for i in range(len(teacher_list)):
        teacher = teacher_list[i]
        name = format_name(teacher.name)
        if name in subs.keys():
            teacher_list.insert(i, Teacher(
                subs[name], f"{subs[name]}", teacher.prep, teacher.lunch))
            teacher_list.remove(teacher)

    # for t in teacher_list:
    #     print(t, end=", ")
    # print()

    df = assign_subs_full_day(df, subs)

    df = fill_teachers(df, teacher_list, subs)

    print(df)

    should_update_requests = False

    if not should_update_requests:
        return {}

    for index, row in df.iterrows():
        query = {
            "date": date,
            "startTime": row["Time"].start,
            "endTime": row["Time"].end,
            "name": row["Needs Coverage"],
            "email": row["Email"]
        }
        update = {
            "$set": {
                "teacher1": row["Teacher 1"] if row["Teacher 1"] != "None" else None,
                "teacher2": row["Teacher 2"] if row["Teacher 2"] != "None" else None,
                "sub": row["Assigned Sub"] if row["Assigned Sub"] != "None" else None,
                "isSub": row["Assigned Sub"] != "None"
            }
        }
        requests.update_one(query, update)

    return df
