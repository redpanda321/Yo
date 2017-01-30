

Share car (Like Uber)


 
Setup:

    Clone this repo to your local machine by: git clone https://github.com/redpanda321/Yo/Server.
    Okay, after clone it, you can install all dependencies by type: npm install on your terminal.
    I used to mongo database for this repo, because you must install and start mongodb. In your terminal: sudo /etc/init.d/mongodb start
    Use mongorestore -d mydb dump/mydb to restore database.
    Fix path mongodb: config/init.js --> _db: 'mongodb://localhost/mydb'
    Finally, you can start server with command: npm start and then, your server will start at http://localhost:6868
