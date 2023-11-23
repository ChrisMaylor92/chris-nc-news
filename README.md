# Northcoders News API

Hi, welcome to my project. 

Summary of project: 

(should evolve over time) 
This project is my first API/Server, using Node.js web application framework 'Express'.... 

Link to project:
https://chriss-new-app.onrender.com/api (you will find a list of all endpoints here)

Instructions:
Due to using .gitignore, you will not be able to run this locally until you make some minor changes. 

Please set up 2 .env files in the root directory, like this; 

File 1:
    File Name: 
        '.env.test'
    File Contents: 
        'PGDATABASE=nc_news_test;'

File 2:
    File Name: 
        '.env.development'
    File Contents: 
        'PGDATABASE=nc_news;'


Please install dependencies by running command; 
npm install 

For the correct versions of all dependencies please refer to my package.json file.


You should now be able to run this repo locally.


Instructions on what scripts to use;
'npm run setup-dbs' - will setup the database
'npm run seed' - will seed the datatabse
'npm run test' - will run all of the test


Kind regards,
Chris