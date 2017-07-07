# NodeJs Rest Api

```
####### Dependency Packages  ###########
mysql : npm install mysql --save
hapi : npm install hapi --save
bcrypt : npm install bcrypt --save


###### Mysql Query ##############
Create Database node_db
CREATE TABLE `users` (
    -> `uid` int(11) AUTO_INCREMENT,
    -> `username` varchar(50),
    -> `password` varchar(200),
    -> `email` varchar(200),
    -> PRIMARY KEY (`uid`)
    -> );
    
######## Run node server ######
node server.js

Open your browser localhost:3000
