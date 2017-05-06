# mongo library ###############
from pymongo import MongoClient
###############################

# twilio for notification ########################
from twilio.rest import Client
##################################################

# tweepy error handling ##########################
from tweepy import AppAuthHandler, API
from tweepy.error import TweepError
##################################################

# other imports
import time
import math
import sys
from tweepy.utils import import_simplejson

json = import_simplejson()
###############

# # User credentials to access Twitter API ######################################
# CONSUMER_KEY = "OUjJp6Wzt2PXc6p97lPtiQ20E"
# CONSUMER_SECRET = "oeN2PlMl5waJuEy55QkEWiH1y2Gzc1v5VioHmI6gN7dBmOZsf2"
# consumer_key = "fhZ1VwyrjTMuyyrBonMeuUMr2"
# consumer_secret = "9y6QrPh8XRFDKyqAQZHM2uaLoG5LSly4BECJOuJ0LxZXLXdVR4"
# consumer_key = "HCXJC9Jg97wp08d1aBHFuvSj9"
# consumer_secret = "ackWKhV5seM5cVIyHjUBWs7DeYJvq1M50o93lz2djoXVGY1CQq"
# consumer_key = "2Akcp0bkBnpgr4nMpOaIPOVa0"
# consumer_secret = "xmZ5NpbbqnLFsWCB295B1QBrm7KocRNc5LLPtWA4hVbUldlZAS"
#################################################################################

# Initializing objects for twilio rest client to send SMS notifications ##########################
client_shivank = Client("ACd434aa13726a611ed78e241c9584a866", "9f532222976f5e6e38ef562aa68e5645")
shiv_to_num = "+61426274869"
shiv_from_num = "+61439548489"


##################################################################################################


# this function is used to notify devs via SMS whenever harvester stops ####
def notify_sms(msg):
    client_shivank.messages.create(to=shiv_to_num, from_=shiv_from_num,
                                   body='searchAPI stopped: {0}'.format(msg))


############################################################################

# GET request constants
TWEETS_PER_QUERY = 100

# Search parameters
GEOCODE = "-29.53522956294844,133.76953125,2300km"  # This covers all of Australia

# A timeline of tweets will be available to download for a given query. Twitter can only return a finite number of
# tweets per request, therefore multiple requests will be required to fetch all tweets. The stateless nature of http
# requests require us to keep track of which tweets we have already received, which is accomplished using the following:
since_ID = None  # If included in request, only tweets with an ID more recent than this value will be returned.
max_ID = -1  # If included in request, tweets with an ID older than or including this value will be returned.
since_ID_for_later = None  # this will help us keep track of the prev since_ID in case harvester stops working
# Must initially be less than 0 since we haven't retrieved any tweets yet

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Please enter the required number of arguments with the script")
        # notify_sms("Please enter the required number of arguments with the script")
        sys.exit(1)
    else:
        # Parse arguments from command line #########
        consumer_key = sys.argv[1]
        consumer_secret = sys.argv[2]
        file_name = sys.argv[3]
        story_name = sys.argv[4]
        try:
            with open(file_name, mode='r') as hfile:
                content = hfile.read()
            dict_content = json.loads(content)
            query = dict_content[story_name]
        except FileNotFoundError as fnf:
            # notify_sms(format(fnf))
            print(fnf)
            sys.exit(1)
        except ValueError as ve:
            # notify_sms(ve)
            print(ve)
            sys.exit(1)
        except KeyError as ke:
            print("No key found named: {}".format(ke))
        except Exception as e:
            # notify_sms(e)
            print(e)
            sys.exit(1)
        #############################################

        # Connect to Twitter API ###############################################
        auth = AppAuthHandler(consumer_key, consumer_secret)
        api = API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
        ########################################################################

        # mongodb connection string ##################
        mongo_client = MongoClient('localhost', 27017)
        raw_db = mongo_client['rawtweetsdbLive']
        collection = raw_db[story_name]
        ##############################################

        tweet_count = 0
        print("Begin retrieving tweets")

        while True:
            try:
                # Use search API to retrieve more tweets
                if max_ID <= 0:  # No tweets retrieved yet so API call only includes count attribute in request
                    if not since_ID:  # If since_ID exists
                        received_tweets = api.search(q=query, geocode=GEOCODE, lang="en", count=TWEETS_PER_QUERY)
                    else:
                        received_tweets = api.search(q=query, geocode=GEOCODE, lang="en", count=TWEETS_PER_QUERY,
                                                     since_id=since_ID)
                    # Save this for when we have downloaded all currently available tweets.
                    since_ID_for_later = received_tweets[0].id

                else:  # Tweets have already been retrieved, so include max_id and count attributes in request
                    if not since_ID:
                        received_tweets = api.search(q=query, geocode=GEOCODE, lang="en", count=TWEETS_PER_QUERY,
                                                     max_id=str(max_ID - 1))
                    else:
                        received_tweets = api.search(q=query, geocode=GEOCODE, lang="en", count=TWEETS_PER_QUERY,
                                                     max_id=str(max_ID - 1), since_id=since_ID)

                # All tweets for this batch retrieved so start processing them
                if not received_tweets:
                    # All relevant tweets that are currently indexed for the Search API have been retrieved
                    # Set the since_ID so next time it only checks for tweets newer than the most recent tweet
                    # we have downloaded.
                    since_ID = since_ID_for_later
                    max_ID = -1
                    # Don't make any more requests until the next 15 minute window starts.
                    rate_limit_status = api.rate_limit_status()
                    epoch_time_of_reset = int(rate_limit_status["resources"]["search"]["/search/tweets"]["reset"])
                    current_epoch_time = int(time.time())
                    time_til_next_reset = epoch_time_of_reset - math.ceil(
                        current_epoch_time) + 5  # add 5 seconds for good measure :)
                    print("Going to sleep for {} minutes and {} seconds".format(int(time_til_next_reset / 60),
                                                                                time_til_next_reset % 60))
                    time.sleep(time_til_next_reset)
                else:
                    for tweet in received_tweets:
                        # Send it to database
                        collection.insert_one(tweet._json)
                    tweet_count += len(received_tweets)
                    max_ID = received_tweets[-1].id
                    print("Downloaded {} tweets \n{} \n{}".format(tweet_count, received_tweets[0].id, max_ID))
            except TweepError as te:
                print(te.reason)
                # notify_sms(te.reason)
            except Exception as e:
                print(e)
                # notify_sms(e)
