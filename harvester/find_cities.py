from pymongo import MongoClient
import sys
from tweepy.utils import import_simplejson

json = import_simplejson()

coll_name = None

res = {}

# for geolocation ###################
import geocoder
# import requests
# url = 'https://maps.googleapis.com/maps/api/geocode/json'
# params = {'sensor': 'false', 'address': ''}
#####################################

# mongodb connection string ###################################################
username = "smoky"
password = "sm0ky$"
# node IP -> 115.146.95.71
mongo_client = MongoClient('115.146.95.71', 27017)
raw_db = mongo_client['rawtweetsdbLive']
raw_db.authenticate(username, password, mechanism='SCRAM-SHA-1', source='admin')
################################################################################


def find_city():
    coll_name = sys.argv[1]
    collection = raw_db[coll_name]
    for tweet in collection.find():
        location = geocoder.google([tweet["value"]["co"]["coordinates"][1], tweet["value"]["co"]["coordinates"][0]],
                                   method='reverse')
        # point = str(tweet["value"]["co"]["coordinates"][1]) + "," + str(tweet["value"]["co"]["coordinates"][0])
        # params['address'] = point
        # location = requests.get(url, params=params)
        if location.state is None:
            print(location.latlng)
            return
        # res.setdefault(location.state, 0)
        # res[location.state] += 1
    # for k,v in res.items():
    #     print("{0}=> {1}".format(k,v))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Insufficient arguments specified. Exiting")
        sys.exit(1)
    else:
        find_city()