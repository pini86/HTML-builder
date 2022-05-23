const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

fsPromises.rmdir(path.join(__dirname + '\\files-copy'), { recursive: true })
  .finally(() => {
    fs.mkdir(path.join(__dirname + '\\files-copy'), { recursive: true },copyFiles);
  });


async function copyFiles(){
  try {
    const files = await fsPromises.readdir(path.join(__dirname + '\\files'), {withFileTypes: true});
    for (const file of files){
      fs.copyFile(path.join(__dirname + '\\files\\') + file.name, path.join(__dirname + '\\files-copy\\') + file.name, callback);
    }
  } catch (err) {
    callback(err);
  }
}

function callback(err) {
  if (err) throw err;
}