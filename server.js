//'use strict';

const Hapi = require('hapi');
const MySQL = require('mysql');
const Joi = require('joi');
const Bcrypt = require('bcrypt');
// Create a server with a host and port
const server = new Hapi.Server();

/****Connect Your Mysql Database ****/
const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'node_db'
});

/****** Create Your Node Server with port 8087 *******/
server.connection({
    host: 'localhost',
    port: 3000
});
connection.connect();
/*******Routing Started Here ********/
/*
 * Sample Route
 * Method : Get
 * return Type : text
 */
server.route({
    method: 'GET',
    path: '/helloworld',
    handler: function (request, reply) {
        return reply('hello world');
    }
});

/*
 * Get All User Details
 * Method : Get
 * return Type : JSON
 */
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply) {

        connection.query('SELECT uid, username FROM users', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });

    }
});

/*
 * Get Single User Details
 * Method : Get
 * @uid : user id(int)
 * return Type : JSON
 */

server.route({
    method: 'GET',
    path: '/user/{uid}',
    handler: function (request, reply) {
        const uid = request.params.uid;

        connection.query('SELECT uid, username, email FROM users WHERE uid = "' + uid + '"', function (error, results, fields) {
            if (error) throw error;
            //console.log(results);
            reply(results);
        });

    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer()
            }
        }
    }
});
/*
 * SignUp Api
 * Method : Post
 * @username : user name(String)
 * @email : Email(String)
 * @password : Password(Alpha Numeric)
 * return Type : JSON
 */

server.route({
    method: 'POST',
    path: '/signup',

    handler: function (request, reply) {

        const username = request.payload.username;
        const email = request.payload.email;
        const password = request.payload.password;

        var salt = Bcrypt.genSaltSync();
        var encryptedPassword = Bcrypt.hashSync(password, salt);
     
        var orgPassword = Bcrypt.compareSync(password, encryptedPassword);

        connection.query('INSERT INTO users (username,email,password) VALUES ("' + username + '","' + email + '","' + encryptedPassword + '")', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });

    },
    config: {
        validate: {
            payload: {
                username: Joi.string().alphanum().min(3).max(30).required(),
                email: Joi.string().email(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
            }
        }

    }
});
/*
 * login Api
 * Method : Post
 * @username : user name(String)
 * @password : Password(Alpha Numeric)
 * return Type : JSON
 */

server.route({
    method: 'POST',
    path: '/login',

    handler: function (request, reply) {

        const username = request.payload.username;
        const password = request.payload.password;
        var response = {"status": 401,"message":"Login Failed"}
        
        connection.query('SELECT uid, username, email, password FROM users WHERE username = "' + username + '"', function (error, results, fields) {
            if (error) throw error;
            
            var encryptedPassword = results[0].password;
            var orgPassword = Bcrypt.compareSync(password, encryptedPassword);
            if(orgPassword)
            {
              response = {"status": 200,"message":"Login Success"}
            }
            reply(response);
        });
       

    },
    config: {
        validate: {
            payload: {
                username: Joi.string().alphanum().min(3).max(30).required(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
            }
        }

    }
});
/*
 * Update Api
 * Method : Put
 * @username : user name(String)
 * return Type : JSON
 */

server.route({
    method: 'PUT',
    path: '/update/{uid}',

    handler: function (request, reply) {
        const uid = request.params.uid;
        const username = request.payload.username;
        
        var response = {"status": 401,"message":"Update Failed"}
        
        connection.query('UPDATE users SET username = "'+ username +'"WHERE uid = "' + uid + '"', function (error, results, fields) {
            if (error) throw error;
            response = {"status": 200,"message":"Update Successfully"}
            
            reply(response);
        });
       

    },
    config: {
        validate: {
            payload: {
                username: Joi.string().alphanum().min(3).max(30).required(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
            }
        }

    }
});
// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
