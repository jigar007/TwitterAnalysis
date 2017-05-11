# Created by Jigar Thakkar
# Install all packages needed by mean app, and lauch web server

# base node image
FROM node:boron

RUN useradd -ms /bin/bash newuser
USER newuser

#Install app dependencies

COPY . /home/newuser/cloudstoriesapp/

RUN sudo mkdir /home/newuser/cloudstoriesapp

WORKDIR /home/newuser/cloudstoriesapp

RUN npm install && npm cache clean
RUN cd angular-src
RUN npm install && npm cache clean

# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

#CMD while true ; do nc -l -p 4200 < ng serve ; done
CMD [“nohup nodemon&”,”ng serve”]