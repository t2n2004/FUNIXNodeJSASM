fs = require('fs');
fs.writeFile('hello.txt', 'Hello from node.js', function (err) {
  if (err) return console.log(err);
  console.log('Hello from node.js');
});