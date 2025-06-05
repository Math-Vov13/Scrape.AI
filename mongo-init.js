// Accounts DataBase
db = db.getSiblingDB('ScrapeAI');
use('ScrapeAI');


// Create Collections
db.createCollection("accounts");
db.createCollection("company");
db.createCollection("files");

// Create Indexes
db.accounts.createIndex({ email: 1 }, { unique: true });
db.files.createIndex({ name: 1 }, { unique: true });

// Add sample docs
db.accounts.insertMany([
  { username: 'Admin', full_name: 'Administrator', email: 'admin@scrapeai.com', admin: true, authorization: 'staff', disabled: false, password: '$2b$12$ztooFVQDfR3qu2Rec2isHOKhPpLaTD1khpSOeS3COhVSZfMEUBCHS', created_at: new Date() }, // pswd: Admin1234!
]);

db.company.insertOne({
  id: 1,
  name: 'ScrapeAI Technologies',
  description: 'An innovative company specializing in artificial intelligence and data process automation.',
  industry: 'Technology / Artificial Intelligence',
  employeeCount: 150,
  foundedYear: 2020,
  address: '123 Innovation Avenue, 75001 Paris, France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@scrapeai.com',
  website: 'https://www.scrapeai.com',
  services: [
    'Web data scraping',
    'AI data analysis',
    'Process automation',
    'AI consulting',
    'Custom solutions'
  ],
  departments: [
    'Development',
    'Data Science',
    'Marketing',
    'Sales',
    'Customer Support',
    'Human Resources',
    'Finance'
  ]
});

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