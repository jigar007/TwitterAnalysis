# Created by Jigar Thakkar
# Updated by Shivank, to use config file for launching instances
# and basic exception handling
# Need Python 3.0 or Higher and Boto3

import boto3
import sys
import json
from botocore.exceptions import ClientError as ce

# Constants for setting up the resource ######################
access_key_id = "f3371700d8d046c6bcf76de03e83a491"
secret_access_key = "5519eda2f6bd4cb18a697fab94205b4c"
region = "NeCTAR"
endpoint = "https://nova.rc.nectar.org.au:8773/services/Cloud"
###############################################################

# Below is the structure for config file for now ##############
# {
#   "imageID": "",
#   "minCount": ,
#   "maxCount": ,
#   "keyName": "",
#   "placement": { "": "" },
#   "instanceType": ""
# }
###############################################################


def launch_from_config(content):
    try:
        # For connecting to NeCTAR
        ec2 = boto3.resource('ec2', aws_access_key_id=access_key_id,
                             aws_secret_access_key=secret_access_key,
                             region_name=region,
                             endpoint_url=endpoint)
        # Creating new instance
        instances = ec2.create_instances(ImageId=content['imageID'],
                                         MinCount=content['minCount'],
                                         MaxCount=content['maxCount'],
                                         KeyName=content['keyName'],
                                         Placement=content['placement'],
                                         InstanceType=content['instanceType'])
        # Prints detail about new instances
        for instance in instances:
            instance.wait_until_running()
            instance.load()
            print("Id = " + instance.id)
            print("Instance name = " + instance.private_dns_name)
            print("IP address = " + instance.private_ip_address)
            print("Size = " + instance.instance_type)
            print("Key = " + instance.key_name)
            print("State = " + str(instance.state))
            print("Availibility Zone = " + str(instance.placement))
            print("Launch Time = " + str(instance.launch_time))
            print("Image id = " + str(instance.image_id))
            print('*' * 50)
    except ce:
        print("Exception while launching instance: {0}".format(ce))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Please specify the config file')
        sys.exit(1)
    else:
        try:
            file_name = sys.argv[1]
            props = {}
            with open(file_name, mode='r') as config_file:
                props = json.loads(config_file.read())
            launch_from_config(content=props)
        except FileNotFoundError as fnf:
            print(fnf)
        except ValueError as ve:
            print("Exception when reading config file: {0}".format(ve))
        except Exception as e:
            print("Oops, Something went wrong!\n{0}".format(e))
