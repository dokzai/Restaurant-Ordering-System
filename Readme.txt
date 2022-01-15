Name: Judy Wu

Student Number: 101184803

Design Decisions made:
- I used mongoose instead of mongodb because of schemas and because I was lazy
- it has auth checking for you but I used my own stuff anyways LOL, im not sure if I implemeneted that part correctly
- I used models for users and orders to make life easy
- choose to use certain codes like 401 or 403 to specify why they user doesnt have access to stuff
- used sessions
- followed restful designs

How to install and run the assignment:
- run npm install to install everything in the package json, if that somehow fails just manually npm install the dependencies needed listed there (mongodb, mongoose, pug, express, express-session, connect-mongo)
- you dont need nodemon i just have that so i dont cry debugging 
- make a folder somewhere, you can call it 'database', i suggest just putting it in the A4 folder I submitted
- in the terminal, in directory that has that folder 'database', run 'mongod --dbpath="database"' or whatever you named the folder
- then you can open compass cause why not to see data in there, if you want
- then make sure in another terminal run 'node ./database-initializer.js' to init the data into the database folder and drop old data
- then after thats done run 'node ./server.js' this will run the server!
- click on the link that pops up in the terminal to localhost with the port, you should be able to test the code and product and everthing!
- if it somehow doesn't work (which i have had happen on a2)-i can litearlly download the code from brightspace to run it and show you (spent wayyyyyyyyyyyyyy too long on this LOL)
