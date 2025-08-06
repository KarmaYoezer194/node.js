const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Import the database connection        

router.get('/', (req, res) => {
     res.render('index');
     });

     router.get('/register', (req, res) => {
     res.render('register');
     });

router.post('/register', async (req, res) => {
     const {fullName, email, password,confirmPassword } = req.body;
     const [first_name, lastName] = fullName.split(' ');
     if (!fullName || !email || !password || !confirmPassword) {
         return res.status(400).send('All fields are required');
     }
     if (password !== confirmPassword) {
         return res.status(400).send('Passwords do not match');
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     db.query(
          'INSERT INTO username (first_name, last_name, email, password, authen) VALUES (?, ?, ?, ?, ?)', 
          [first_name, lastName, email, hashedPassword, 1], 
          (err, results) => {
               if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).send('Internal server error');
               }
               console.log('User registered successfully:', results);
               // Redirect to login page or send success response
               res.redirect('/login');
          });


});

module.exports = router;