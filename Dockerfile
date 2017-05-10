FROM node:boron

# Install app dependencies
COPY package.json /cloudstoriesapp/package.json
RUN cd cloudstoriesapp/; npm install

# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

CMD [“nodemon”,”angular-src/ng serve”]