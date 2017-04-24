# Created by Jigar Thakkar
# Need Python 3.0 or Higher and Boto3

import boto3

#For connecting to NeCTAR
ec2 = boto3.resource('ec2',aws_access_key_id="f3371700d8d046c6bcf76de03e83a491",
                    aws_secret_access_key="5519eda2f6bd4cb18a697fab94205b4c",
                    region_name="NeCTAR",
                    endpoint_url="https://nova.rc.nectar.org.au:8773/services/Cloud")

#Creating new instance
responces =ec2.create_instances(ImageId='ami-86f4a44c',
                                MinCount=1,
                                MaxCount=1,
                                KeyName='centosKey',
                                Placement={'AvailabilityZone':'melbourne-np'},
                                InstanceType='m2.tiny')

print("All launched instances = "+str(responces))

#Prints detail about new instances
for responce in responces:
    responce.wait_until_running()
    responce.load()
    print ("Id/Name = " + responce.id)
    print ("Instance name = " + responce.private_dns_name)
    print ("IP address = " + responce.private_ip_address)
    print ("Size = " + responce.instance_type)
    print ("Key = " + responce.key_name)
    print ("State = " + str(responce.state))
    print ("Availibility Zone = " + str(responce.placement))
    print ("Launch Time = " + str(responce.launch_time))
    print ("Image id = " + str(responce.image_id))