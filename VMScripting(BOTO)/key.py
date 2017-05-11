# Created by Jigar Thakkar
# Creates Key to ssh in to insatnce
# Need Python 3.0 or Higher and Boto3

import boto3

# Constants for setting up the resource ######################
access_key_id = "f3371700d8d046c6bcf76de03e83a491"
secret_access_key = "5519eda2f6bd4cb18a697fab94205b4c"
region = "NeCTAR"
endpoint = "https://nova.rc.nectar.org.au:8773/services/Cloud"
###############################################################

ec2 = boto3.resource('ec2', aws_access_key_id=access_key_id,
                             aws_secret_access_key=secret_access_key,
                             region_name=region,
                             endpoint_url=endpoint)

key = ec2.create_key_pair('mynewkey')
key.save('/key')