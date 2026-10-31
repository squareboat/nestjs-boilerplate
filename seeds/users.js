const bcrypt = require('bcrypt');

// This seed deletes every user first (and, through the foreign keys, their
// jobs and applications), so it only runs with APP_ENV local/dev/test.
// SEED_FORCE=1 runs it anyway.
const SAFE_ENVS = ['local', 'dev', 'development', 'test'];

   exports.seed = async function (knex) {
     const env = process.env.APP_ENV;
     if (!SAFE_ENVS.includes(env) && process.env.SEED_FORCE !== '1') {
       throw new Error(
         `Not seeding: APP_ENV is "${env ?? ''}" and this seed deletes every user. ` +
           `Use APP_ENV=${SAFE_ENVS.join('/')} or set SEED_FORCE=1.`,
       );
     }

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