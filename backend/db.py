from pymongo import MongoClient
from utils import Teacher, Interval
from algorithms import assign_subs_full_day, fill_teachers
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
        "email": email
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
            "Assigned Sub": "None",
            "Teacher 1": "None",
            "Teacher 2": "None"
        })

    df = pd.DataFrame(df_rows)

    return teacher_list, df


def assign_coverages(date: str, day: str):
    """
    Assigns coverages for a given date and day.

    :param date (str): The date to assign coverages for.
    :param day (str): The day (A or B) that the coverage is on.
    """
    teacher_list, df = init_request_information(date, day)

    print("\nTEACHERS:")
    for teacher in teacher_list:
        teacher.print_schedule()
    print('\n"NEEDS COVERAGE" DATAFRAME:')
    df = assign_subs_full_day(df)
    df = fill_teachers(df, teacher_list)

    return df

    