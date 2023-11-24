const { mainModel } = require("./models/post")
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { kaganga } = require("./Router/kaganga.js")

const mongoose = require('mongoose');
require('dotenv').config();
let sql;
var data = [{
  id: 0,
  tj: "Arti Muncul Disini",
  jt: 'kgf',
  mode: 0,
  textBahasa: "Indonesia Ke Rejang"
}];

var dataKaganga = [{
  tj: "Arti Muncul Disini",
  jt: 'kgf',
}];
var badword = false;
async function post(data, Indonesia, Rejang) {
  Indonesia = Indonesia.toLowerCase()
  Rejang = Rejang.toLowerCase()
  try {
    // Validasi kata kasar
    const containsBadWord = badWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(Indonesia) || regex.test(Rejang);
    });

    if (Indonesia.trim() !== "" && Rejang.trim() !== "" && !containsBadWord) {
      // TODO: Tambahkan posting ke database terlebih dahulu.
      const existingDataIndo = await mainModel.findOne({ Indonesia });
      const existingDataRejang = await mainModel.findOne({ Rejang });

      if (!existingDataIndo && !existingDataRejang) {
        // Data belum ada dalam database, tambahkan ke database
        await mainModel.create({ Indonesia, Rejang });
        data.unshift({ Indonesia, Rejang });
      } else {
        console.log("Data already exists in the database.");
      }
    } else {
      badword = true;
    }
  } catch (err) {
    console.error(err);
  }
}



var notes = [];
mainModel.find({}, '_id Indonesia Rejang')
    .then(docs => {
        // Now the 'notes' array will contain objects with '_id', 'Indonesia', and 'Rejang' fields
        notes = docs;
    })
    .catch(error => {
        console.error(error);
    });
const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post("/ganti", (req, res) => {
  if (data[0].mode == 0) {
    data[0].mode = 1
    data[0].textBahasa = "Rejang Ke Indonesia"
  } else if (data[0].mode == 1) {
    data[0].mode = 0;
    data[0].textBahasa = "Indonesia Ke Rejang"
  }
  res.redirect('/')
})
app.get("/", function(req, res) {

  res.render("home", {
    data: data,
    notes: notes
  })
})

app.get("/atmin", function(req, res) {

  res.render("atmin", {
    data: notes
  })
})

app.get("/delete/:id", function(req, res) {
  data = data.filter((obj) => obj.id !== req.params.id); // Filter the data
    // Delete the article from the 'mainModel'
  mainModel
    .deleteOne({ id: req.params.id })
    .then(function () {
      console.log("deleted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
    res.redirect("/atmin")
});

app.post("/edit/:id", async function(req, res) {
    try {
        const acceptedData = {
            Indonesia: req.body.indo,
            Rejang: req.body.rejang,
        };

        const existingData = await mainModel.findOneAndUpdate(
            { _id: req.params.id },
            acceptedData,
            { new: true } // Return the updated document
        );

        if (!existingData) {
            // If the document with the specified id doesn't exist, handle it accordingly
            console.log("Document not found.");
            return res.redirect("/database");
        }

        // Update the data in the 'notes' array
        const existingDataIndex = notes.findIndex((obj) => obj._id.toString() === req.params.id);

        if (existingDataIndex !== -1) {
            // Update the 'notes' array with the new data
            notes[existingDataIndex].Indonesia = existingData.Indonesia;
            notes[existingDataIndex].Rejang = existingData.Rejang;
        }

        console.log(existingDataIndex);
        console.log(existingData);
        res.redirect("/database");

    } catch (error) {
        console.error(error);
        res.redirect("/database"); // Handle errors accordingly
    }
});


app.get("/database", function(req, res) {

  res.render("database", {
    data: notes
  })
})
const badWordsString = process.env.katakasar;
const badWords = badWordsString.split(',');

app.post("/post-database", async function(req, res) {
  // Assign values from request body
  const Indonesia = req.body.Indonesia;
  const Rejang = req.body.Rejang;

  // Call the function
  await post(notes, Indonesia, Rejang);

  if (badword == true) {
    badword = false;
    res.render("badword")
  } else {
    res.redirect("/database");
  }
});


app.get("/search", (req, res) => {
  var input = req.query.value.toLowerCase()

  if (input == "doma#0777") {
    res.render("easteregg");
  } else {
    const mode = data[0].mode;
    var searchData = data.map(obj => ({ ...obj })); 

    if (mode == 0) {
      mainModel.findOne({ Indonesia: input })
        .then((doc) => {
          searchData[0].tj = input;
          searchData[0].jt = kaganga(input);

          if (doc !== null) {
            var d = doc.Rejang.replace("ê", "e");
            searchData[0].tj = d;
            searchData[0].jt = kaganga(d);
          }

          res.render("home", {
            data: searchData
          });
        });
    } else {
      input = input.replace("ê", "e");
      mainModel.findOne({ Rejang: input })
        .then((doc) => {
          searchData[0].tj = input;
          searchData[0].jt = kaganga(input);

          if (doc !== null) {
            searchData[0].tj = doc.Indonesia;
            searchData[0].jt = kaganga(doc.Indonesia);
          }

          res.render("home", {
            data: searchData
          });
        });
    }
  }
});
app.post("/searchKaganga", (req, res) => {
  const input = req.body.value.toLowerCase()
  dataKaganga[0].tj = input;
  dataKaganga[0].jt = kaganga(input);

  res.redirect('/kaganga')


})
app.get("/kaganga", (req, res) => {
  res.render("kaganga", {
    data: dataKaganga
  })
})

app.post("/search2", (req, res) => {
  const input = req.body.value.toLowerCase();
  const mode = req.body.mode;
  var searchData = data.map(obj => ({ ...obj })); 
  if (mode == 0) {
    mainModel.findOne({ Indonesia: input })
      .then((doc) => {


        searchData[0].tj = input;
        searchData[0].jt = kaganga(input);

        if (doc !== null) {
          searchData[0].tj = doc.Rejang;
          searchData[0].jt = kaganga(doc.Rejang);
        }

        res.json({
          tj: searchData[0].tj,
          jt: searchData[0].jt
        });
      });

  } else {
    mainModel.findOne({ Rejang: input })
      .then((doc) => {

        searchData[0].tj = input;
        searchData[0].jt = kaganga(input);

        if (doc !== null) {
          searchData[0].tj = doc.Indonesia;
          searchData[0].jt = kaganga(doc.Indonesia);
        }
        res.json({
          tj: searchData[0].tj,
          jt: searchData[0].jt
        });
      });
  }
});




const uri = process.env.MONGODBURI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
})
  .then(() => {
    app.listen(8080, (req, res) => {
      Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0'
      console.log("SERVER SUDAH BERJALAN")
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
