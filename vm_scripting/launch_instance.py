# Created by Jigar Thakkar
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

# vpc=ec2.Vpc('')
# print(vpc)

# print(instances)

#Creating new instance
# instances =ec2.create_instances(ImageId='ami-86f4a44c',
#                                 MinCount=1,
#                                 MaxCount=1,
#                                 KeyName='centosKey',
#                                 Placement={'AvailabilityZone':'melbourne-np'},
#                                 InstanceType='m2.tiny')
#
# print("All launched instances = "+str(instances))


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