FROM node:boron

RUN useradd -ms /bin/bash newuser
USER newuser

# Install app dependencies

RUN mkdir /home/newuser/cloudstoriesapp
WORKDIR /home/newuser/cloudstoriesapp


COPY . cloudstoriesapp/
RUN npm install && nom install nodemon —-save
RUN cd angular-src; npm install

# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

CMD [“nohup nodemon&”,”ng serve”]