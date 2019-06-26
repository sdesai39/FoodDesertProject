var url = "/api/counties";
d3.json(url, function(error, data) {
    data = JSON.parse(data)
    console.log(data[0]["features"]);
})