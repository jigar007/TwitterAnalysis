import twitter
import time
import schedule

# -----------------------------------------------------------------------
# Twitter API credentials 
# -----------------------------------------------------------------------

access_token = "128552890-KmiXK200XMqWjKhsrPq6cfHDyCP1WNGVcnvOqs4C"
access_token_secret = "wYRCm48ZNIwEW7t7PHLFRAo6F9JXrBYt6E0s28Z0DU0rw"
consumer_key = "2Akcp0bkBnpgr4nMpOaIPOVa0"
consumer_secret = "xmZ5NpbbqnLFsWCB295B1QBrm7KocRNc5LLPtWA4hVbUldlZAS"

# -----------------------------------------------------------------------
# create twitter API object
# -----------------------------------------------------------------------

api = twitter.Api(consumer_key,consumer_secret,access_token,access_token_secret, sleep_on_rate_limit=True)

# -----------------------------------------------------------------------
# This search query will search for all australian Tweets in English Language.
# This returns Tweets which are Australian but may not have location enabled.
# At the end we require the English Language statuses for sentiment analysis
# To do Task is to pass these tweets to the Database rather than just Printing
# -----------------------------------------------------------------------

def searchApi():
    search = api.GetSearch(geocode=[-29.53522956294844, 133.76953125, "2162.719km"], count=100, result_type="mixed", lang="en")
    for tweets in search:
        print(tweets)
        
# -----------------------------------------------------------------------
# Scheduler to execute the Twitter search every 30 seconds
# -----------------------------------------------------------------------
         
schedule.every(0.5).minutes.do(searchApi)

# -----------------------------------------------------------------------
# Infinte Loop, the Search Api will be invoked every 30 seconds
# -----------------------------------------------------------------------

try:
    while True:
     schedule.run_pending()
     time.sleep(0.05)
except twitter.error.TwitterError as err:
    print(err.message)
