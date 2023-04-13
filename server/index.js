

const express = require('express');
const cors = require('cors')
const app = express();
const ytdl = require('ytdl-core');
const port = 9008;
const fs = require('fs');

app.use(cors());
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ // to support URL-encoded bodies
  extended: true
}));


//Audio Only Download
app.get('/audio', async function (req, res) {

  var url = req.query.url_video;
  let regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/ig

  if (!regex.test(url))
    res.status(503).send("url not valid");

  const tk = Math.floor(100000 + Math.random() * 900000);

  let info = await ytdl.getInfo(url);
  let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  //  console.log('Formats with only audio: ' + JSON.stringify(audioFormats));


  await new Promise((resolve) => {
    ytdl(url, { filter: 'audioonly' }).on('progress', (length, downloaded, totalLength, err) => {
      const progress = (downloaded / totalLength) * 100;
      if (progress >= 100) {
        console.log(progress);
      }
      if (err) {
        res.status(503).send(err);
      }
    }).pipe(fs.createWriteStream('Audiovideos/' + tk + '.mp3'))
      .on('finish', (err) => {
        if (err) {
          res.status(503).send(err);
        }
        res.status(200).send(tk.toString());
        resolve();
      })
  });
});

app.get('/download/:tk', function (req, res) {
  console.log("dsds");
  const token = req.params.tk;
  res.download('./Audiovideos/' + token + '.mp3', function (err) {
    if (err) {
      console.log(err);
      res.status(503).send(err);
    }
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));