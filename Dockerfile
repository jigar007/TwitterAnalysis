FROM node:boron


# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

ADD cloudstoriesapp /cloudstoriesapp

WORKDIR ~/cloudstoriesapp

CMD nodemon;cd angular-src;ng serve