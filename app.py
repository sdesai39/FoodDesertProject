import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect,
    current_app
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
    filename = os.path.join(app.static_folder,'data/FDIdb.json')
    print(filename)
    with open(filename) as json_file:
        data = json.load(json_file)
        return jsonify(data)
        
    

if __name__=="__main__":
    app.debug = True
    app.run()
