'use strick'

const fs = require('fs').promises;
const {parse} = require('path')

const atribute = {
  path: '',
  name: '',
  ext: ''
};
Object.seal(atribute);

   function getPath (...path) {
     let opath = {}
    for(const toPath of path){
      path.join(__dirname, toPath)
    }
}
console.log(parse('/home/test/list.txt'))
