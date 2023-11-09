import sqlite3
import pathlib

conn = sqlite3.connect('local.sqlite3')


def migrate():
    cursor = conn.cursor()
    files = ["usersTable.sql"]
    for fil in files:
        file_ = pathlib.Path(__file__).parent.joinpath('migration').joinpath(fil)
        with open(file_) as file:
            try:
                sql_queries = file.read()
                cursor.executescript(sql_queries)
                conn.commit()
            except sqlite3.Error as error:
                print(error)
    cursor.close()