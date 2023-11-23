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
mainModel.find({}, null, { sort: { like: -1 } }).then(docs => { notes = docs })

/*() 

sql = 'SELECT * FROM Table1';
db.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);

  // For each note, query the comment table to see if there are any comments associated with it
  rows.forEach((row) => {
    mainModel.create({Indonesia: row.Indo, Rejang: row.Rejang})
  });
});*/


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
app.get("/database", function(req, res) {

  res.render("database", {
    data: notes
  })
})
/**
 * @param {mainModel} model 
 */
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
  const input = req.query.value.toLowerCase()

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

  if (mode == 0) {
    /*db.get("SELECT Rejang FROM Table1 WHERE Indo='"+input+"'", function(err, row) {

        
        data[0].tj = input;
        data[0].jt = kaganga(input);
        if(row!==undefined){
            data[0].tj = row.Rejang;
            data[0].jt = kaganga(row.Rejang);
        }
        res.json({
            tj: data[0].tj,
            jt: data[0].jt
        });
    });*/

    mainModel.findOne({ Indonesia: input })
      .then((doc) => {


        data[0].tj = input;
        data[0].jt = kaganga(input);

        if (doc !== null) {
          data[0].tj = doc.Rejang;
          data[0].jt = kaganga(doc.Rejang);
        }

        res.json({
          tj: data[0].tj,
          jt: data[0].jt
        });
      });

  } else {
    mainModel.findOne({ Rejang: input })
      .then((doc) => {

        data[0].tj = input;
        data[0].jt = kaganga(input);

        if (doc !== null) {
          data[0].tj = doc.Indonesia;
          data[0].jt = kaganga(doc.Indonesia);
        }
        res.json({
          tj: data[0].tj,
          jt: data[0].jt
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
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

