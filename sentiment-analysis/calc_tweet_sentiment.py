from textblob import TextBlob
import re
from emoji import EMOJIS
import json
from pymongo import MongoClient

# mongodb connection string ##################
mongo_client = MongoClient('115.146.95.71', 27017)
raw_db = mongo_client['rawtweetsdbLive']
collection = raw_db['test']
##############################################


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


def calcSentiment(tweet):
    tweet = TextBlob(tweet)

    if tweet.sentiment.polarity < 0:
        sentiment = "negative"
    elif tweet.sentiment.polarity == 0:
        sentiment = "neutral"
    else:
        sentiment = "positive"

    return sentiment


def main():
    for raw_tweet in collection.find():
        # first pre-process the text in the tweet and find out it's sentiment
        sentiment = calcSentiment(preprocesstweets(raw_tweet["text"]))
        # create a new property for that document which stores the sentiment
        collection.update({"_id": raw_tweet["_id"]},
                          {"$set": {"tweet_sentiment": sentiment}}
                          )
        # print("RAWTEXT: {}\nPROCTEXT: {}\nSENTIMENT: {}\n".format(raw_tweet["text"],proc_text,sentiment))

if __name__ == '__main__':
    main()
