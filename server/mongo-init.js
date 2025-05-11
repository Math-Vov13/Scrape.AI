// Accounts DataBase
db = db.getSiblingDB('database_ScrapeAI');
use('database_ScrapeAI');


// Create Collections
db.createCollection("accounts");
db.createCollection("files");



// Create Indexes
db.accounts.createIndex({ email: 1 }, { unique: true });
db.files.createIndex({ name: 1 }, { unique: true });




// Add sample docs
db.accounts.insertMany([
  { firstName: 'Dev', lastName: 'dev', email: 'dev.1@frVigilante.gouv.fr', password: '$2b$10$5jBqcbBc9Kequk827PlF3.ugBvVN0bUjYCtGW4vOTA.J4zgmwWBuS', created_at: new Date() }, // pswd: DEV1234!%
]);