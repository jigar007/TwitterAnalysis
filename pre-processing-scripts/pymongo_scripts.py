import pprint
from bson.code import Code

from pymongo import MongoClient

client = MongoClient('mongodb://smoky:sm0ky$@115.146.95.71:27017/rawtweetsdbLive?authSource=admin')
db = client['rawtweetsdbLive']

collection_raw_tweets = db.rawtweets2_pros
collection_polygons = db.polygons_rawtweets2
collection_suburban = db.suburban
collection_suburban_senti_count = db.suburban_senti_count


def insert_lat_senti():
    result_count = 0
    no_result_count = 0

    '''
    find in which SA2_NAME11 the lat lng of tweet lies in.
    1. From [processed tweet] collection find latlng and sentimental analysis
    2. From the latlng [processed tweet] use [polygon] to find SA2_NAME11
    3. Insert latlng, senti and SA2_NAME11 to [suburban]
    '''

    for post in collection_raw_tweets.find({}, {"_id": 0, "value.co.coordinates": 1, "tweet_sentiment": 1 , "value.text": 1}):

        try:
            coordinates = post['value']['co']['coordinates']
            sentiment_analysis = post['tweet_sentiment']
            text = post['value']['text']

        except:
            continue

        res = collection_polygons.find_one({"geometry": {
            "$geoNear": {"$geometry": {"type": "Point", "coordinates": coordinates}, "$maxDistance": 1000}}},
            {"properties": 1})
        try:
            suburban_name = res['properties']['SA2_NAME11']
            inserted_id = collection_suburban.insert_one(
                {"sub": suburban_name, "senti": sentiment_analysis, "latlng": coordinates , "text":text}).inserted_id
            result_count += 1

            print(inserted_id)

        except:
            no_result_count += 1


    print("Got sub name for ", result_count)
    print("No results for", no_result_count)
    print("done")

# A new collecti0n called [suburban] is created with senti, latlng, and sub

'''
2.

var map = function(){
	var output = {"senti" : this.senti , "latlng": this.latlng , "suburb":this.sub }
	emit(this.sub , output)
}

var reduce = function(suburb, value){
	var count = 0;
	var pos = 0;
	var neg = 0;
	var neu = 0;

	var outs = {pos:0 , neg:0 , neu :0};
	var latslngs = [];

	value.forEach(function(v)
	{
		if (v.senti == "positive") {
			outs.pos+=1;
			latslngs.push({"lat":v.latlng[1] , "lng":v.latlng[0]});
		}
		if (v.senti == "negative") {
			outs.neg+=1;
			latslngs.push({"lat":v.latlng[1] , "lng":v.latlng[0]});
		}
		if (v.senti == "neutral") {
			outs.neu+=1;
			latslngs.push({"lat":v.latlng[1] , "lng":v.latlng[0]});
		}
	})

	return (suburb , { "suburb":suburb, "senti" : outs , "latlng":latslngs });
}

db.suburban.mapReduce(map,reduce,{out:"suburban_senti_count"})


At this stage
'''

'''
3.

The [polygon] collection is then updated to include senti, latlng information
obtained from [suburban_senti_count].
'''

# then remove documents that contain only one sentiment count
# db.suburban_senti_count.remove({"value.senti.pos":null});

'''
SA2NAME11 from [senti sub] is searched in [polygons] to add sentiment
and latlng to it.
'''

def add_lat_senti_polygon():
    for documents_senti_sub in collection_suburban_senti_count.find({}, {"_id": 0}):
        SA2NAME11 = documents_senti_sub['value']['suburb']
        senti = documents_senti_sub['value']['senti']
        total_tweet_count = documents_senti_sub['value']['total_tweets']
        for documents_polygons in collection_polygons.find({"properties.SA2_NAME11": SA2NAME11},
                                                           {"properties.SA2_NAME11": 1, "properties.SA2_MAIN11": 1}):
            polygon_id = documents_polygons["_id"]

            latlng_from_senti_suburn = documents_senti_sub['value']['latlng']

            aa = collection_polygons.update({'_id': polygon_id},
                                            {'$set': {"senti": senti, "latlng": latlng_from_senti_suburn ,
                                                      "total_tweet":total_tweet_count}})
            pprint.pprint(aa)


'''
SA2 Name and SA2 Main are set to out level
Properties object is removed
Documents that don't have any sentiments are also removed
'''

def remove_unwanted_polygons():
    for documents_polygons in collection_polygons.find({}, {"properties.SA2_NAME11": 1, "properties.SA2_MAIN11": 1}):
        polygon_id = documents_polygons["_id"]
        sa2_name_from_polygon = documents_polygons["properties"]["SA2_NAME11"]
        sa2_main_from_polygon = documents_polygons["properties"]["SA2_MAIN11"]
        dd = collection_polygons.update({'_id': polygon_id}, {
            '$set': {"properties": {"SA2_NAME11": sa2_name_from_polygon, "SA2_MAIN11": sa2_main_from_polygon}}})
        print(dd)

# Documents that don't have sentiment analysis are removed
# db.polygons.remove({"senti":null});

# insert_lat_senti()
# call map reduce
# db.suburban_senti_count.remove({"value.senti.pos":null});
# add_lat_senti_polygon()
# remove_unwanted_polygons()
# db.polygons_rawtweets2.remove({"senti":null});


'''
2.

var map = function(){
	var output = {"senti" : this.senti , "latlng": this.latlng , "suburb":this.sub }
	emit(this.sub , output)
}

var reduce = function(suburb, value){
	var count = 0;
	var pos = 0;
	var neg = 0;
	var neu = 0;

	var outs = {pos:0 , neg:0 , neu :0};
	var latslngs = [];

	value.forEach(function(v)
	{
		if (v.senti == "positive") {
			outs.pos+=1;
			latslngs.push({"lat":v.latlng[1] , "lng":v.latlng[0]});
		}
		if (v.senti == "negative") {
			outs.neg+=1;
			latslngs.push({"lat":v.latlng[1] , "lng":v.latlng[0]});
		}
		if (v.senti == "neutral") {
			outs.neu+=1;
			latslngs.push({"lat":v.latlng[1] , "lng":v.latlng[0]});
		}
	})

	return (suburb , { "suburb":suburb, "senti" : outs , "latlng":latslngs });
}

db.suburban.mapReduce(map,reduce,{out:"suburban_senti_count"})

'''