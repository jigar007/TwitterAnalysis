# Created by Jigar Thakkar
# Install all packages needed by harvester and run python files

# Use an official Python runtime as a base image
FROM python:latest

COPY . /home/$(whoami)

# Install any needed packages specified in requirements.txt
RUN pip install appdirs==1.4.3
RUN pip install click==6.7
RUN pip install decorator==4.0.11
RUN pip install docutils==0.13.1
RUN pip install jmespath==0.9.2
RUN pip install nltk==3.2.2
RUN pip install oauthlib==2.0.2
RUN pip install packaging==16.8
RUN pip install PyJWT==1.5.0
RUN pip install pymongo==3.4.0
RUN pip install pyparsing==2.2.0
RUN pip install PySocks==1.6.7
RUN pip install python-dateutil==2.6.0
RUN pip install pytz==2017.2
RUN pip install ratelim==0.1.6
RUN pip install requests==2.13.0
RUN pip install requests-oauthlib==0.8.0
RUN pip install s3transfer==0.1.10
RUN pip install six==1.10.0
RUN pip install textblob==0.12.0
RUN pip install tweepy==3.5.0
RUN pip install twilio==6.0.0

# Make port 80 available to the world outside this container
EXPOSE 80:80
EXPOSE 27017:27017

#CMD ["python","find_cities"]
CMD ["python","searchAPI.py"]
CMD ["python","streamAPI.py"]