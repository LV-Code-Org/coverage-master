
class Interval:
    """Class representing an interval of time."""

    def __init__(self, start: str, end: str) -> None:
        """Initialize the interval with start and end times in HH:MM format."""
        self.start = start
        self.end = end

    def __str__(self) -> str:
        return f"{self.start} - {self.end}"

    @staticmethod
    def time_to_minutes(time: str) -> int:
        """Convert time in HH:MM format to the total number of minutes since 00:00."""
        hours, minutes = map(int, time.split(':'))
        return hours * 60 + minutes

    @staticmethod
    def minutes_to_time(minutes: int) -> str:
        """Convert total minutes since 00:00 to time in HH:MM format."""
        hours = minutes // 60
        mins = minutes % 60
        return f"{hours:02}:{mins:02}"

    def contains(self, other: 'Interval') -> bool:
        """Check whether this Interval contains another Interval."""
        start_self = Interval.time_to_minutes(self.start)
        end_self = Interval.time_to_minutes(self.end)
        start_other = Interval.time_to_minutes(other.start)
        end_other = Interval.time_to_minutes(other.end)

        return start_self <= start_other and end_self >= end_other

    def overlap(self, other: 'Interval') -> 'Interval':
        """Returns the overlapping interval between two intervals, or None if there is no overlap."""
        start_self = Interval.time_to_minutes(self.start)
        end_self = Interval.time_to_minutes(self.end)
        start_other = Interval.time_to_minutes(other.start)
        end_other = Interval.time_to_minutes(other.end)

        if end_self <= start_other or end_other <= start_self:
            return None

        overlap_start = max(start_self, start_other)
        overlap_end = min(end_self, end_other)

        return Interval(Interval.minutes_to_time(overlap_start), Interval.minutes_to_time(overlap_end))


class Teacher:
    """Class representing a teacher."""

    def __init__(self, name: str, email: str, prep: int, lunch: int) -> None:
        """Initialize the teacher with a name and a schedule based on their prep period and lunch."""
        self.name = name
        self.email = email
        self.lunch = lunch
        self.prep = prep
        self.schedule = self._create_schedule(prep, lunch)

    def __str__(self):
        return self.name

    def _create_schedule(self, prep: int, lunch: int) -> dict:
        """Creates a schedule based on a prep period (1-4) and a lunch (1-3)."""
        schedule = {
            Interval("8:00", "9:30"): 1,
            Interval("9:30", "11:00"): 2,
        }
        if lunch == 1:
            schedule[Interval("11:00", "11:35")] = "Lunch"
            schedule[Interval("11:35", "13:10")] = 3
        elif lunch == 2:
            schedule[Interval("11:00", "11:50")] = 3
            schedule[Interval("11:50", "12:25")] = "Lunch"
            schedule[Interval("12:25", "13:10")] = 3
        else:
            schedule[Interval("11:00", "12:35")] = 3
            schedule[Interval("12:35", "13:10")] = "Lunch"

        schedule[Interval("13:10", "14:45")] = 4

        for time in schedule.keys():
            if schedule[time] == prep:
                schedule[time] = "Prep"
            else:
                if schedule[time] != "Lunch":
                    schedule[time] = "Class"

        return schedule

    def find_location(self, time: 'Interval') -> dict:
        """
        Find what the teacher is doing during the specified interval.
        Returns a dictionary with Interval objects as keys and their corresponding activities as values.
        """
        activities = {}
        for interval, activity in self.schedule.items():
            if overlap := interval.overlap(time):
                end = ""
                if Interval.time_to_minutes(overlap.end) > Interval.time_to_minutes(interval.end):
                    end = interval.end
                else:
                    end = overlap.end

                start = ""
                if Interval.time_to_minutes(overlap.start) > Interval.time_to_minutes(interval.start):
                    start = interval.start
                else:
                    start = overlap.start

                activities[Interval(start, end)] = activity

        return activities

    def print_schedule(self) -> None:
        """Prints the teacher's schedule to the console."""
        print(self.name)
        for time in self.schedule.keys():
            print(f"{time}: {self.schedule[time]}")


def format_name(full_name):
    """
    Converts a name from 'First Middle(s) Last' format to 'Last, First Middle(s)'.

    Parameters:
        full_name (str): The name in 'First Middle(s) Last' format.

    Returns:
        str: The name in 'Last, First Middle(s)' format.
    """
    parts = full_name.split()  # Split the name into parts
    if len(parts) < 2:
        raise ValueError("Name must contain at least a first and last name.")
    
    first = parts[0]
    last = parts[-1]
    middle = " ".join(parts[1:-1])  # Combine any middle name(s) into a single string

    if middle:
        return f"{last}, {first} {middle}"
    else:
        return f"{last}, {first}"


def unformat_name(name):
    """
    Converts a name from 'Last, First Middle(s)' to 'First Middle(s) Last'.

    Parameters:
        name (str): The name in 'Last, First Middle(s)' format.

    Returns:
        str: The name in 'First Middle(s) Last' format.
    """
    if "," not in name:
        raise ValueError("Name must be in 'Last, First Middle(s)' format.")
    
    last, rest = name.split(",", 1)
    parts = rest.strip().split()
    if len(parts) < 1:
        raise ValueError("Name must contain at least a first name.")
    
    first = parts[0]
    middle = " ".join(parts[1:])  # Combine any middle names
    return f"{first} {middle} {last}".strip()
