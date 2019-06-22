import json
import csv
import pymongo

with open ('../data/County GeoJSON.json') as json_file:
    countydata = json.load(json_file)
    newjson = {"type": "FeatureCollection","features": []}
    for x in countydata["features"]:
        fips=int(x["properties"]["STATE"]+x["properties"]["COUNTY"])
        with open ('../data/FIP_FDI_percentage.csv') as csv_file:
            next(csv_file)
            csv_reader = csv.reader(csv_file, delimiter=',')
            for row in csv_reader:
                if int(row[3]) == int(fips):
                    x["properties"]["FD%"]=row[8]
                    x["properties"]["Median Icome"] = row[6]
                    x["properties"]["% White"]=row[9]
                    x["properties"]["% Minority"]=row[10]
                    newjson["features"].append(x)
print(newjson["features"][3])