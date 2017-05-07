from textblob import TextBlob
import re
from emoji import EMOJIS
import sys
from pymongo import MongoClient


def preprocesstweets(rawtext):
    # Replace hashtags with word
    tweet = rawtext.replace("#", "")
    # Remove URLs
    tweet = re.sub('((https?://[^\s]+)|(www\.[^\s]+))', '', tweet)
    # To read the regex: first alternative is match http literally and then s? means match s where the ? quantifier
    # matches between 0 and 1 times. Match :// literally and then the capturing group will match any single character
    # isn't whitespace, where the + is a qunatifier meaning match between one and unlimited times
    # second alternative is match www. literally and then same capturing group as first alternative.

    # Remove any usernames (@username)
    tweet = re.sub('@[^\s]+', '', tweet)

    # Replace emojis with their sentiment as defined by the mapping in emoji.py
    for emoji in EMOJIS:
        if emoji in tweet:
            tweet = tweet.replace(emoji, ' {} '.format(EMOJIS[emoji]))
    return tweet


def calc_sentiment(tweet):
    tweet = TextBlob(tweet)

    if tweet.sentiment.polarity < 0:
        sentiment = "negative"
    elif tweet.sentiment.polarity == 0:
        sentiment = "neutral"
    else:
        sentiment = "positive"

    return sentiment


def main():
    if len(sys.argv) < 2:
        print("Please enter the collection on which the sentiment will run")
        sys.exit(1)
    else:
        coll = sys.argv[1]
        # mongodb connection string ##################
        # node IP -> 115.146.95.71
        username = "smoky"
        password = "sm0ky$"
        mongo_client = MongoClient('localhost', 27017)
        raw_db = mongo_client['rawtweetsdbLive']
        raw_db.authenticate(username, password, mechanism='SCRAM-SHA-1', source='admin')
        collection = raw_db[coll]
        ##############################################

        for raw_tweet in collection.find():
            # first pre-process the text in the tweet and find out it's sentiment
            sentiment = calc_sentiment(preprocesstweets(raw_tweet["value"]["text"]))
            # create a new property for that document which stores the sentiment
            collection.update({"_id": raw_tweet["_id"]},
                              {"$set": {"tweet_sentiment": sentiment}}
                              )
            # print("RAWTEXT: {}\nPROCTEXT: {}\nSENTIMENT: {}\n".format(raw_tweet["text"],proc_text,sentiment))
        print("Update complete!")

if __name__ == '__main__':
    main()
