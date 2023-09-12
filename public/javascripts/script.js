var uploaddd = document.querySelector("#new")
var fileform = document.querySelector("#fileform")
var fileinp = document.querySelector("#fileinp")
uploaddd.addEventListener("click", () => {
    fileinp.click()
})
fileinp.addEventListener("change", () => {
    fileform.submit()
})


var filediv = document.querySelector("#file")
var hiddenicons = document.querySelector("#hiddenicons")
filediv.addEventListener("mousemove", () => {
    hiddenicons.style.opacity = "1"
})
filediv.addEventListener("mouseout", () => {
    hiddenicons.style.opacity = "0"
})

const fileSizeMB = user.filesize / (1024 * 1024);
console.log(fileSizeMB)
console.log(filesize + "mb")
console.log(`${fileSizeMB.toFixed(2)} MB`)







// const fs = require('fs');

// function openfile(index,file){
// alert("heeee")    
// const { exec } = require('child_process');

// // Replace with the actual path to the file you want to open
// const filePath = '/Users/hi/OneDrive/Desktop/googledrive/public/uploads/:file';

// // Check if the file exists
// fs.access(filePath, fs.constants.F_OK, (err) => {
//   if (err) {
//     console.error('File not found.');
//     return;
//   }

//   // Open the file using the default system viewer
//   exec(`open "${filePath}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error opening file: ${error.message}`);
//       return;
//     }
//     console.log('File opened successfully.');
//   });
// });

// }


const { spawn } = require('child_process');
const fs = require('fs');

const filePath = '/Users/hi/OneDrive/Desktop/googledrive/public/uploads/1692463734224-Final123.Docx'; // Replace this with the actual file path

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.log('File not found');
  process.exit(1);
}

// Determine the appropriate command based on the operating system
const command = process.platform === 'win32' ? 'type' : 'cat';

// Spawn the child process to view the file
const childProcess = spawn(command, [filePath], { stdio: 'inherit' });

// Listen for the child process's exit event
childProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Child process exited with code ${code}`);
  }
});
