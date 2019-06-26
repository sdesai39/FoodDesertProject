import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect
)
import pymongo
import json
from bson.json_util import dumps

app = Flask(__name__)



@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/counties")
def counties():
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)

    db = client.FDI_db

    results = db.Counties.find()
    l = list(results)
    x = dumps(l)
    return jsonify(x)
    

if __name__=="__main__":
    app.debug = True
    app.run()
