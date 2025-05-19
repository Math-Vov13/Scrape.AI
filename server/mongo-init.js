// Accounts DataBase
db = db.getSiblingDB('ScrapeAI');
use('ScrapeAI');


// Create Collections
db.createCollection("accounts");
db.createCollection("files");

// Create Indexes
db.accounts.createIndex({ email: 1 }, { unique: true });
db.files.createIndex({ name: 1 }, { unique: true });

// Add sample docs
db.accounts.insertMany([
  { username: 'Admin', full_name: 'Administrateur', email: 'admin@scrapeai.com', authorization: 'staff', disabled: false, password: '$2b$12$ztooFVQDfR3qu2Rec2isHOKhPpLaTD1khpSOeS3COhVSZfMEUBCHS', created_at: new Date() }, // pswd: Admin1234!
]);

// Create Roles
db.createRole({
  role: "accountsRW",
  privileges: [
    {
      resource: { db: "ScrapeAI", collection: "accounts" },
      actions: ["find", "insert", "update", "remove"]
    }
  ],
  roles: []
});

// Create Users
db.createUser({
  user: "users",
  pwd: "userpassword",
  roles: ["accountsRW"]
});