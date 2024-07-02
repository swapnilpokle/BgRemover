const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.get('/',(req,res)=>{
  res.sendFile(__dirname+"/index.html");
  })
// Ensure 'processed' directory exists
const processedDir = path.join(__dirname, 'processed');
if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir);
}

app.post('/upload', upload.single('image'), (req, res) => {
  const pythonProcess = spawn('python', ['remove_bg.py', req.file.path]);

  pythonProcess.stdout.on('data', (data) => {
    const outputFilePath = `processed/${req.file.filename}.png`;
    fs.writeFileSync(outputFilePath, data);
    res.sendFile(path.resolve(outputFilePath));
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

