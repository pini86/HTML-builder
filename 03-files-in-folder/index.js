const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

async function listFiles(){
  try {
    const files = await readdir(path.resolve(__dirname , 'secret-folder'), {withFileTypes: true});
    for (const file of files)
      if (file.isFile()){
        fs.stat(path.resolve(__dirname , 'secret-folder', file.name), (err,stats) => 
          console.log(path.parse(file.name).name, ' - ', path.parse(file.name).ext.slice(1), ' - ', stats.size, 'bytes'));
      }
  } catch (err) {
    console.error(err);
  }
}
listFiles();
