const fs = require('fs');

const envContent = `MONGO_URL=mongodb+srv://shamimweb78_db_user:ifJOxzjrn98kYfl0@asssignment3.oykhf8i.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_for_assignment_3_2024_unguessable_string
`;

fs.writeFileSync('.env', envContent);
console.log('.env file has been created/updated successfully!');
console.log('Content:');
console.log(envContent);
