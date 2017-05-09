FROM python:latest

RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

ADD cloudstoriesapp /cloudstoriesapp

WORKDIR ~/cloudstoriesapp
CMD nodemon ;cd angular-src;ng serve