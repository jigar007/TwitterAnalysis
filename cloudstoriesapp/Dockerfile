FROM node:boron

# Install app dependencies
RUN mkdir ~/cloudstoriesapp/

WORKDIR ~/cloudstoriesapp/

COPY . ~/cloudstoriesapp/
RUN cd ~/cloudstoriesapp/; npm install
RUN cd ~/cloudstoriesapp/angular-src/; npm install

# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

CMD [“nohup nodemon&”,”cd angular-src/ng serve”]