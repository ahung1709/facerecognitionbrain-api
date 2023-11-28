const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //localhost
      port : 5432,
      user : 'aaronhung',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password: 'cookies',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        }, 
        {
            id: '124',
            name: 'Sally',
            password: 'bananas',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // bcrypt.compare("apples", '$2a$10$2es5REj8q9xRXmBkanfmBeqZ7JP4HCjlwo5SoepKGSSbV/pj9Nh5u', function(err, res) {
    //     console.log('first guess', res)
    //     // res == true
    // });
    // bcrypt.compare("veggies", '$2a$10$2es5REj8q9xRXmBkanfmBeqZ7JP4HCjlwo5SoepKGSSbV/pj9Nh5u', function(err, res) {
    //     console.log('second guess', res)
    //     // res = false
    // });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0])
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });    
    db('users')
        .returning('*')
        .insert({
            email: email, 
            name: name, 
            joined: new Date()
        })
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})


// // Load hash from your password DB.

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
