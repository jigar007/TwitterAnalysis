# Created by Jigar Thakkar
# print all avialable instances at cloud 
# Need Python 3.0 or Higher and Boto3

import boto3

try:
    #For connecting to NeCTAR
    ec2 = boto3.resource('ec2',aws_access_key_id="f3371700d8d046c6bcf76de03e83a491",
                        aws_secret_access_key="5519eda2f6bd4cb18a697fab94205b4c",
                        region_name="NeCTAR",
                        endpoint_url="https://nova.rc.nectar.org.au:8773/services/Cloud")
except:
    print("Error while connecting with given credentials.")


instances = ec2.instances.filter(
    Filters=[{'Name': 'instance-state-name', 'Values': ['running']}])

#Prints detail about new instances
for instance in instances:
    # print("%s (%s) [%s]" % (instance.tags['Name'], inst.id, inst.state))
    print(instance.tags)
    instance.wait_until_running()
    instance.load()
    print ("Id/Name = " + instance.id)
    print ("Instance name = " + instance.private_dns_name)
    print ("IP address = " + instance.private_ip_address)
    print ("Size = " + instance.instance_type)
    print ("Key = " + instance.key_name)
    print ("State = " + str(instance.state))
    print ("Availibility Zone = " + str(instance.placement))
    print ("Launch Time = " + str(instance.launch_time))
    print ("Image id = " + str(instance.image_id))