import os
from datetime import datetime

def get_today_count():
    today = datetime.now().strftime("%Y-%m-%d")
    filename = f"visits_{today}.txt"
    
    if not os.path.exists(filename):
        with open(filename, 'w') as f:
            f.write("1")
        return 1
    else:
        with open(filename, 'r+') as f:
            try:
                count = int(f.read())
            except ValueError:
                count = 0
            count += 1
            f.seek(0)
            f.write(str(count))
        return count
