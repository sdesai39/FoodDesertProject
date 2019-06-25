import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect
)
import pymongo

app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db = client.FDI_db

@app.route("/")
def home():
    return render_template("../Homepage.html")
