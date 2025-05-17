const bcrypt = require('bcrypt');

   exports.seed = async function (knex) {
     // Deletes existing entries to avoid duplicates
     await knex('users').del();

     // Inserts seed entries
     await knex('users').insert([
       {
         first_name: 'Ankush ',
         last_name: ' Tyagi',
         dob: '2000-01-01',
         username: 'ankush_tyagi',
         email: 'ankush.tyagi@squareboat.com',
         password: await bcrypt.hash('password123', 10),
         role:0,
       },
       {
         first_name: 'Ankush',
         last_name: 'Tyagi',
         dob: '2000-01-01',
         username: 'ankush_tyagi1',
         email: 'ankush.tyagi1@squareboat.com',
         password: await bcrypt.hash('password123', 10),
         role:0,
       }
     ]);
   };