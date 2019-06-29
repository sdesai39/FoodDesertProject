import json
import csv
import pymongo
from bson import json_util


with open ('../static/data/County GeoJSON.json') as json_file:
    countydata = json.load(json_file)
    newjson = {"type": "FeatureCollection","features": []}
    for x in countydata["features"]:
        fips=int(x["properties"]["STATE"]+x["properties"]["COUNTY"])
        with open ('../static/data/FIP_FDI_percentage.csv') as csv_file:
            next(csv_file)
            csv_reader = csv.reader(csv_file, delimiter=',')
            for row in csv_reader:
                if int(row[3]) == int(fips):
                    x["properties"]["FD%"]=row[8]
                    x["properties"]["Median Icome"] = row[6]
                    x["properties"]["% White"]=row[9]
                    x["properties"]["% Minority"]=row[10]
                    newjson["features"].append(x)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)


db = client.FDI_db
if('Counties' in db.list_collection_names()):
    collection = db.Counties
    collection.drop()

collection = db.Counties


collection.insert_one(newjson)
cursor = collection.find({})
file = open("collection.json", "w")
file.write('[')

qnt_cursor = 0
for document in cursor:
    qnt_cursor += 1
    num_max = cursor.count()
    if (num_max == 1):
        file.write(json.dumps(document, indent=4, default=json_util.default))
    elif (num_max >= 1 and qnt_cursor <= num_max-1):
        file.write(json.dumps(document, indent=4, default=json_util.default))
        file.write(',')
    elif (qnt_cursor == num_max):
        file.write(json.dumps(document, indent=4, default=json_util.default))
file.write(']')

client.close()