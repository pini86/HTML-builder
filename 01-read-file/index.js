const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let myData = '';
stream.on('data', chunk => myData += chunk);
stream.on('end', () => console.log(myData));
stream.on('error', error => console.log('Error', error.message));