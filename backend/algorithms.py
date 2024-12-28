import pandas as pd
from random import sample


def assign_subs_full_day(df: pd.DataFrame, available_subs=["Sub A", "Sub B", "Sub C", "Sub D", "Sub E"]) -> pd.DataFrame:
    """
    Assigns substitute teachers to cover individual teachers for the full day. 
    Populates the `Assigned Sub` DataFrame column.
    """

    value_counts = df["Needs Coverage"].value_counts()
    frequencies = dict(value_counts.reset_index().values.tolist())

    need_subs = []
    for teacher in frequencies.keys():
        if frequencies[teacher] >= 6:
            need_subs.append(teacher)

    still_needs_subs = need_subs.copy()

    for teacher_needing_sub in need_subs:
        if len(available_subs) > 0:
            s = available_subs.pop()
            df.loc[df["Needs Coverage"] ==
                   teacher_needing_sub, 'Assigned Sub'] = s
            still_needs_subs.remove(teacher_needing_sub)

    return df


def fill_teachers(df: pd.DataFrame, teachers: list) -> pd.DataFrame:
    """Uses teachers to fill the remaining coverages to the best of their ability."""

    def pick_unique_values(data):
        picked_values = set()
        selected_values = {}

        for key, values in data.items():
            available_values = [v for v in values if v not in picked_values]

            if len(available_values) >= 2:
                selected_pair = sample(available_values, 2)
                picked_values.update(selected_pair)
                selected_values[key] = selected_pair
            elif len(available_values) == 1:
                selected_values[key] = available_values
                picked_values.add(available_values[0])
            else:
                selected_values[key] = []

        return selected_values

    available = {n: [] for n in range(df.shape[0])}
    for idx, row in df.iterrows():
        if row["Assigned Sub"] == "None":
            for teacher in teachers:
                teacher_activities = teacher.find_location(row["Time"])
                if "Prep" in teacher_activities.values() and len(teacher_activities) == 1:
                    if row["Email"] != teacher.email:
                        available[idx].append(teacher)

    picked_values = pick_unique_values(
        {x: [y.email for y in y] for x, y in available.items() if df.loc[x]["Assigned Sub"] == "None"})
    for idx, values in picked_values.items():
        if len(values) > 0:
            df.loc[idx, "Teacher 1"] = values[0]
        if len(values) > 1:
            df.loc[idx, "Teacher 2"] = values[1]

    pd.set_option('display.max_rows', None)
    return df
