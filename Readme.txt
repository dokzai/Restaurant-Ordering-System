How to instal:
- run npm install to install everything in the package json, if that somehow fails just manually npm install the dependencies needed listed there (mongodb, mongoose, pug, express, express-session, connect-mongo)
- you dont need nodemon i just have that so i dont cry debugging 
- make a folder somewhere, you can call it 'database', i suggest just putting it in the A4 folder I submitted
- in the terminal, in directory that has that folder 'database', run 'mongod --dbpath="database"' or whatever you named the folder
- then you can open compass cause why not to see data in there, if you want
- then make sure in another terminal run 'node ./database-initializer.js' to init the data into the database folder and drop old data
- then after thats done run 'node ./server.js' this will run the server!
- click on the link that pops up in the terminal to localhost with the port, you should be able to test the code and product and everthing!

