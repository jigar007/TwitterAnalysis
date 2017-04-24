from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.error import TweepError, RateLimitError
import sys


# Variables that contains the user credentials to access Twitter API
access_token = "87336336-det6wlix4hK99vzC7HqWAowJ5CrMLFG8Aq6620EYW"
access_token_secret = "TJl8XUc48Nvc5j13qgDnxBP1hqMN15qDlWwZe6rtzhKUF"
consumer_key = "p6FZIKs9KxB3g7qh1Wrjze5W1"
consumer_secret = "PbU7wfXc68oSkzBNW1CQBnD1NVCrd7HlvKtpSPbxzGxsTj3mcK"
geobox_melbourne = [144.593742, -38.433859, 145.512529, -37.511274]
geobox_sydney = [150.520929, -34.118347, 151.343021, -33.578141]
geobox_brisbane = [152.668523, -27.767441, 153.317870, -26.996845]
geobox_perth = [115.684048, -32.455642, 116.239023, -31.624485]
geobox_final = geobox_melbourne + geobox_sydney + geobox_brisbane + geobox_perth


# This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):
    def on_data(self, data):
        print(data)
        return True

    def on_error(self, status):
        print(status)


if __name__ == '__main__':
    # This handles Twitter authentication and the connection to Twitter Streaming API
    listener = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, listener)
    # This line filter Twitter Streams to capture data by the keywords:
    try:
        stream.filter(locations=geobox_final)
    except TweepError as te:
        line_num = sys.exc_info()[2].tb_lineno
        print('At line {0}: {1}'.format(line_num, te.reason))
    except Exception as e:
        print('Exception: {0}'.format(e))
