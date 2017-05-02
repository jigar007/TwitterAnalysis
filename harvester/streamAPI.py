# Created by Shivank Sharma

# tweepy streaming libraries #####################
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.utils import import_simplejson
json = import_simplejson()
##################################################

# tweepy error handling ##########################
from tweepy.error import TweepError
##################################################

# twilio for notification ########################
from twilio.rest import Client
##################################################

# other necessary modules ########################
import requests
from pymongo import MongoClient
##################################################

# Variables that contains the user credentials to access Twitter API ######################################
access_token = "87336336-det6wlix4hK99vzC7HqWAowJ5CrMLFG8Aq6620EYW"
access_token_secret = "TJl8XUc48Nvc5j13qgDnxBP1hqMN15qDlWwZe6rtzhKUF"
consumer_key = "p6FZIKs9KxB3g7qh1Wrjze5W1"
consumer_secret = "PbU7wfXc68oSkzBNW1CQBnD1NVCrd7HlvKtpSPbxzGxsTj3mcK"
###########################################################################################################

# Variables with city box grids ###########################################################################
# geobox_melbourne = [144.593742, -38.433859, 145.512529, -37.511274]
# geobox_sydney = [150.520929, -34.118347, 151.343021, -33.578141]
# geobox_brisbane = [152.668523, -27.767441, 153.317870, -26.996845]
# geobox_perth = [115.684048, -32.455642, 116.239023, -31.624485]
# geobox_final = geobox_melbourne + geobox_sydney + geobox_brisbane + geobox_perth
geobox_australia = [110.951034, -54.833766, 159.287222, -9.187026]
############################################################################################################

# Initializing objects for twilio rest client to send SMS notifications ####################################
client_shivank = Client("ACd434aa13726a611ed78e241c9584a866", "9f532222976f5e6e38ef562aa68e5645")
shiv_to_num = "+61426274869"
shiv_from_num = "+61439548489"
client_jigar = Client("AC8316dbf0dfff0e545f80d7ef076106c9", "95db6786b4c7ce4f969d09f6f4f6cae6")
jig_to_num = "+61406101797"
jig_from_num = "+61409738448"

############################################################################################################

# mongodb connection string and other constants ############################################################
# master instance -> 115.146.95.71
# url = 'http://smoky:smoky@0.0.0.0:5984/rawtweetsdb'
# headers = {'Content-Type': 'application/json'}
mongo_client = MongoClient('localhost', 27017)
raw_db = mongo_client['rawtweetsdbLive']
collection = raw_db['rawTweet']
############################################################################################################


# This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):
    def on_data(self, json_data):
        tweet = json.loads(json_data)
        collection.insert_one(tweet)
        # print(json_data)
        # requests.post(url=url, data=json_data, headers=headers)
        return True

    def on_error(self, status):
        print(status)
        notify_sms(msg=te.reason)
        return False


# this function is used to notify devs via SMS whenever harvester stops
def notify_sms(msg):
    client_shivank.messages.create(to=shiv_to_num, from_=shiv_from_num,
                                  body='Harvester stopped: {0}'.format(msg))
    client_jigar.messages.create(to=jig_to_num, from_=jig_from_num,
                                body='Harvester stopped: {0}'.format(msg))


if __name__ == '__main__':
    # This handles Twitter authentication and the connection to Twitter Streaming API
    listener = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, listener)
    try:
        # This line filter Twitter Streams to capture data by the keywords:
        stream.filter(locations=geobox_australia)
    except TweepError as te:
        print(te.reason)
        notify_sms(msg=te.reason)
    except requests.exceptions.Timeout as timeout:
        print(timeout)
        notify_sms(msg=timeout)
    except requests.exceptions.ConnectionError as ce:
        print(ce)
        notify_sms(msg=ce)
    except requests.exceptions.RequestException as re:
        print(re)
        notify_sms(msg=re)
    except Exception as e:
        print('Exception: {0}'.format(e))
        notify_sms(msg=e)
