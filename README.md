# Restaurant-Ordering-System
MongoDB, Mongoose, Express, Node.js, Javascript, Pug
# How to Run
- run npm install to install everything in the package json, if that somehow fails just manually npm install the dependencies needed listed there (mongodb, mongoose, pug, express, express-session, connect-mongo) 
- make a folder somewhere, you can call it 'database', i suggest just putting it in the folder
- in the terminal, in directory that has that folder 'database', run 'mongod --dbpath="database"' or whatever you named the folder
- then you can open compass cause why not to see data in there, if you want
- then make sure in another terminal run 'node ./database-initializer.js' to init the data into the database folder and drop old data
- then after thats done run 'node ./server.js' this will run the server!
- click on the link that pops up in the terminal to localhost with the port
