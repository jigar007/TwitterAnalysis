# LINUX PACKAGES AND MODULES #
* sudo apt-get update
* Use python 3
* install pip as follows
	* sudo apt-get install python-pip python-dev build-essential
	* sudo pip install --upgrade pip
	* sudo pip install --upgrade virtualenv
* install docker
	1. sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	2. sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
	3. sudo apt-get update
	4. sudo apt-get install -y docker-engine
* use couchdb image => lenkan/couchdb in docker
	1. docker pull lenkan/couchdb
	2. docker run -d -p 5984:5984 --name couchdb lenkan/couchdb
* run the harvester (using python 3) to start collecting tweets
	* python3 melb_harvester.py