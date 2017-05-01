### This readme file contains instructions on how to get the web-app running on your machine
+ __Please create your own branch before starting the development__
+   Pull the latest changes
+   The 'cloudstoriesapp' root folder contains the following
    1.    _angular-src_ contains front-end
        -    The _app_ folder contains all the components for the front-end
        -    To create any new _component_ navigate to _angular-src/src/app/components_ and use __ng g component `component-name`__
        -    To create any new _service_ navigate to _angular-src/src/app/services_ and use __ng g service `service-name`__. You'll have to import the service into _app.module.ts_ and add it to _providers_
    2.    _config_ contains the database file which stores the connection string to mongodb
    3.    _models_ contains the model for each component, which is required by mongoose to create schema
    4.    _routes_ contains the routes for backend. These will be used as such in angular services to fetch data from backend.
+   Please ensure that your machine has Node 6.9+ installed
+   Whenever you need to install any node package into the web-app navigate to _cloudstories_ and use __npm install `package-name`__