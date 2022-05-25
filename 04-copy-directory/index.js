const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

fsPromises.rmdir(path.resolve(__dirname , 'files-copy'), { recursive: true })
  .finally(() => {
    fs.mkdir(path.resolve(__dirname , 'files-copy'), { recursive: true },copyFiles);
  });


async function copyFiles(){
  try {
    const files = await fsPromises.readdir(path.resolve(__dirname , 'files'), {withFileTypes: true});
    for (const file of files){
      fs.copyFile(path.resolve(__dirname , 'files', file.name), path.resolve(__dirname , 'files-copy' , file.name), callback);
    }
  } catch (err) {
    callback(err);
  }
}

function callback(err) {
  if (err) throw err;
}