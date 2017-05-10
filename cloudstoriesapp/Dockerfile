FROM node:boron

RUN useradd -ms /bin/bash newuser
USER newuser

# Install app dependencies
RUN mkdir /home/$(whoami)/cloudstoriesapp/

WORKDIR /home/$(whoami)/cloudstoriesapp/

COPY . /home/$(whoami)/cloudstoriesapp/
RUN npm install nodemon —-g
RUN cd /home/$(whoami)/cloudstoriesapp/; npm install
RUN cd /home/$(whoami)/cloudstoriesapp/angular-src/; npm install

# Make port 80 available to the world outside this container
EXPOSE 4200
EXPOSE 3000

CMD [“nohup nodemon&”,”cd /home/$(whoami)/angular-src/“,“ng serve”]