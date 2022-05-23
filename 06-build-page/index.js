const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const pathDist = path.join(__dirname, '\\project-dist\\');
const pathAssetsCopy = path.join(pathDist, '\\assets\\');
const pathStyles = path.join(__dirname, '\\styles\\');
const pathComponents = path.join(__dirname, '\\components\\');
const pathAssets = path.join(__dirname, '\\assets\\');

fsPromises.rmdir(pathDist, { recursive: true })
  .finally(() => {
    return fsPromises.mkdir(pathDist, { recursive: true });
  })
  .then(()=>{
    return recursiveCopy(pathAssets,pathAssetsCopy);
  })
  .then(()=>{
    return mergeStyles(pathStyles, path.join(pathDist, 'style.css'));
  })
  .then(()=>{
    return createHtml(pathComponents, path.join(__dirname, 'template.html'), path.join(pathDist, 'index.html'));
  })
  .catch((err)=> {
    callback(err);
  });

  
async function recursiveCopy(source, destination) {
  fsPromises.lstat(source)
    .then((value)=>{
      if (value.isDirectory()) {
        fsPromises.mkdir(destination, { recursive: true });
        fsPromises.readdir(source, {withFileTypes: true})
          .then((files)=>{
            files.forEach((file) => {
              recursiveCopy(path.join(source, file.name), path.join(destination, file.name));
            });
          });
      } else {
        fs.copyFile(source, destination, callback);
      }
    });
}
  
function callback(err) {
  if (err) throw err;
}

function mergeStyles(source, destination){
  fsPromises.open(destination,'a')
    .finally(()=>{
      fsPromises.readdir(source, {withFileTypes: true})
        .then ((files) => {
          let outList = [];
          for (const file of files){
            if(file.isFile() && (path.parse(file.name).ext === '.css')){
              outList.push(path.join(source + file.name));
            }
          }
          streamMerge(outList, destination);
        })
        .catch((error)=> console.error(error));
    });
}

function streamMerge(sourceFiles, targetFile) {
  const fileWriteStream = fs.createWriteStream(targetFile); 
  streamMergeRecursive(sourceFiles, fileWriteStream);
}

function streamMergeRecursive(sources=[], fileWriteStream) {
  if (!sources.length) {
    return fileWriteStream.end (); 
  }
  const currentFile = sources.shift();
  const currentReadStream = fs.createReadStream(currentFile); 
  currentReadStream.pipe(fileWriteStream, { end: false }); 
  currentReadStream.on('end', function() {
    streamMergeRecursive(sources, fileWriteStream);
  });
  currentReadStream.on ('error', function (error) {
    console.error(error);
    fileWriteStream.close();
  });
}

async function createHtml( pathComponents, inputFile, outputFile){
  let fileTemplate = await fsPromises.readFile(inputFile, { encoding: 'utf-8' });
  const files = await fsPromises.readdir(pathComponents, { withFileTypes: true });

  for (let file of files) {
    const fileComponent = await fsPromises.readFile(path.join(pathComponents, `${file.name}`), 'utf-8');
    fileTemplate = fileTemplate.replace('{{'+ file.name.slice(0,-5)+'}}', fileComponent);
  }
  await fsPromises.writeFile(outputFile, fileTemplate);
}   
