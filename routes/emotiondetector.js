const express = require('express');
const axios = require('axios');
const router = express.Router();
const multer = require('multer');
const request = require('request');
const fs = require('fs');
const mysql = require('mysql2');
const path = require("path");

// const db = require("./database");

// configure storage for uploaded images
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
	  cb(null, './public/uploads/emotionphotos/');
	},
	filename: function(req, file, cb) {
	  cb(null, file.originalname);
	}
  });
const upload = multer({ storage });
const alertMessage = require('../helpers/messenger');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'itp211',
    password: 'itp211',
    database: 'moodplusdb'
  });

router.get('/emotionhome', (req, res) => {
    // quotes of the day api only can call 10 times per hour lol 
    axios.get('https://quotes.rest/qod')
    .then(response => {
      const quote = response.data.contents.quotes[0];
      console.log(`Quote of the day: ${quote.quote}`);
      res.render('emotiondetector/emomain',{ quote }) // 
    // res.render('emotiondetector/emomain') 
    })
    .catch(error => {
      console.log(`Error fetching quote of the day: ${error.message}`);
      res.render('404', { message: 'Error fetching quote of the day' });
    });
});

router.post('/emotionhome',upload.single('file') ,(req, res) => {
    const emotionpredquote = null;
      
    //upload file image 
    if (req.file) {
        const imagePath = `public/uploads/emotionphotos/${req.file.filename}`;

        const image = fs.readFileSync(imagePath);
        const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
            }
        };
    
        const formData = new FormData();
        formData.append('file', new Blob([image], { type: 'image/jpeg' }), `${req.file.filename}`);

        // make a POST request to the custom image classification API
        axios.post('http://127.0.0.1:5000/predictEmotion', formData, config)
          .then(response => {
            // console.log(`Classification result: ${response.data.classification}`);
            const prediction_result = response.data.classification
            const column = prediction_result;
            const max = 1000000;
            const min = 1;
            const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
           // Get a random value from the specified column
           connection.connect((error) => {
            if (error) throw error;
        
            connection.query(`SELECT ${column} FROM emotionquotes ORDER BY RAND() LIMIT 1`, (error, results) => {
              if (error) throw error;
              const emotionpredquote = results[0][column];
              res.render('emotiondetector/emomain',{ prediction_result, emotionpredquote, randomNumber})
        
              connection.query(`INSERT INTO emotiondetections (random_id, photo, emotion_result, quote_generated) VALUES ('${randomNumber}','${req.file.filename}', '${prediction_result}', '${emotionpredquote}')`, 
              (error, results) => {
                if (error) throw error;
                // res.send(results);
                // connection.end();
              });
            });
        });
          })
          .catch(error => {
            console.log(`Error calling classification API: ${error.message}`);
            res.status(500).send({ message: 'Error calling classification API' });
          });
      } else {
        console.log('Error uploading image');
        res.status(500).send({ message: 'Error uploading image' });
      }
});

router.get('/sharesocialmedia/:random_id', (req, res) => {
    const id = req.params.random_id;
    // Define the SQL query to retrieve data from the database based on the ID
    const query = `SELECT * FROM  emotiondetections WHERE random_id = ${id}`;
    // console.log(id)
    // Execute the query and render the Handlebars page with the data
    connection.query(query, (error, results) => {
      if (error) throw error;
    //   var imagePath = "mood-plus/public/uploads/emotionphotos/results[0].photo";
    //   var imagePath = path.join( "~", "public", "uploads","emotionphotos", results[0].photo);
    //   res.sendFile(imagePath);
      res.render('emotiondetector/sharesocialmedia', { data: results[0], id });
    });
});

router.post('/sharesocialmedia', (req, res) => {
    const message = req.body.message;
    const name = req.body.name;
    const id = req.body.random_id;
    const quote = req.body.quote_generated;
    const emotiongen = req.body.emotion_result;

    const ACCESS_TOKEN = 'EAANglwaGSZCsBADIOEZC0uc8eLwkz1GjAepvepMPMnzH66AxTKwSqeHSWT4gVpby7isL5ZCEyipM5eSjDm24eNZBCIZARrwJB09saY6gZARtG3VSJh9h4ZA35MxZCooEWiqiJ2oNvZAIkFYthEfdmwEhmMXTyqPMID4ZCcZBYRFIYxmVQiuXOkTYVazBZANDPTyrofdvfwqZA2AAHOAZAywWEQ878A';
    // Define the Facebook Graph API endpoint for posting to the user's feed
    const endpoint = `https://graph.facebook.com/me/feed?access_token=${ACCESS_TOKEN}`; 
    try {
        const response = axios.post(
        `https://graph.facebook.com/110668581943758/feed`,
        {
            "message": "Name:" + name +"\nEmotion Result:" + emotiongen + "\nQuote Generated:" + quote + "\nMessage:" + message,
            access_token: ACCESS_TOKEN
        }
        );
        res.redirect('/emotion/sharecomplete');
        // console.log(response.data);
    } catch (error) {
        console.error(error);
    }
});

// // test 1 
// router.post('/sharesocialmedia',(req,res) =>{
//     const message = req.body.message;
//     const name = req.body.name;
//     var ACCESS_TOKEN = 'EAANglwaGSZCsBAP4GZBlYS3ZAPZB4hT1koCSoyRZBoyhG5OHuUFDc06wVtfQNHPZA8DwYL3DX2P4hXJoBxULJUj23RVobihGMjZBqWEzBSg4cYADOMk1ir5m3cr3Q02pudeDQlJu9ZCeaduTVkcFGKzHr9VHn5IZA7YlWrAhVJBZAZCEDfNTrHYfw5AL81a2tW2qd9OVRneOkkZCmq7L5MVevJAX';
//     var pageId = '110668581943758';
//     var imagePath = 'public/uploads/emotionphotos/curls.jpg';

//     fs.readFile(imagePath, function(err, data) {
//     if (err) {
//         console.error('Error reading image file:', err);
//         return;
//     }

//     var imageData = new Buffer.from(data).toString('base64');
//     var postData = {
//         access_token: ACCESS_TOKEN,
//         caption: message + name,
//         url: 'data:image/jpeg;base64,' + imageData
//     };

//     var options = {
//         method: 'POST',
//         url: `https://graph.facebook.com/v16.0/110668581943758/uploads?file_length=109981&file_type=image/png&access_token=${ACCESS_TOKEN}`,
//         json: true,
//         body: postData
//     };

//     request(options, function(err, response, body) {
//         if (err) {
//         console.error('Error posting image:', err);
//         return;
//         }

//         console.log('Image posted successfully:', body);
//     });
//     })
// });




router.get('/sharecomplete', (req, res) => {
	res.render('emotiondetector/sharecomplete');
});

module.exports = router;