const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

fsPromises.open((__dirname + '\\project-dist\\bundle.css'),'a')
  .finally(()=>{
    fsPromises.readdir(path.join(__dirname + '\\styles'), {withFileTypes: true})
      .then ((files) => {
        let outList = [];
        for (const file of files){
          if(file.isFile() && (path.parse(file.name).ext === '.css')){
            outList.push(path.join(__dirname + '\\styles\\'+ file.name));
          }
        }
        streamMerge(outList, path.join(__dirname + '\\project-dist\\bundle.css'));
      })
      .catch((error)=> console.error(error));
  });

function streamMerge(sourceFiles, targetFile) {
  const fileWriteStream = fs.createWriteStream (targetFile); 
  streamMergeRecursive(sourceFiles, fileWriteStream);
}

function streamMergeRecursive(sources=[], fileWriteStream) {
  if (!sources.length) {
    return fileWriteStream.end (); 
  }
  const currentFile = sources.shift();
  const currentReadStream = fs.createReadStream (currentFile); 
  currentReadStream.pipe(fileWriteStream, { end: false }); 
  currentReadStream.on('end', function() {
    streamMergeRecursive(sources, fileWriteStream);
  });
  currentReadStream.on ('error', function (error) {
    console.error(error);
    fileWriteStream.close();
  });
}
