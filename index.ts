const { mainModel } = require("./models/post");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { kaganga } = require("./Router/kaganga.js");
const cors = require("cors"); // Import the CORS middleware

const mongoose = require("mongoose");
require("dotenv").config();
let sql;
var data = [
  {
    id: 0,
    tj: "Arti Muncul Disini",
    jt: "kgf",
    mode: 0,
    textBahasa: "Indonesia Ke Rejang",
  },
];

var dataKaganga = [
  {
    tj: "Arti Muncul Disini",
    jt: "kgf",
  },
];
var badword = false;
interface data {
  _id: string;
  Indonesia: string;
  Rejang: string;
}

class kkbr {
  data: any;
  mainModel: any;
  notes: data[];
  dataKaganga: any;
  constructor(data, mainModel, notes, dataKaganga) {
    this.data = data;
    this.mainModel = mainModel;
    this.notes = notes;
    this.dataKaganga = dataKaganga;
  }
  ganti() {
    if (this.data[0].mode == 0) {
      this.data[0].mode = 1;
      this.data[0].textBahasa = "Rejang Ke Indonesia";
    } else if (this.data[0].mode == 1) {
      this.data[0].mode = 0;
      this.data[0].textBahasa = "Indonesia Ke Rejang";
    }
  }
  home() {
    return {
      data: this.data,
      notes: this.notes,
    };
  }

  atmin() {
    return this.notes;
  }

  kaganga() {
    return this.dataKaganga;
  }
  delete(id) {
    this.data = this.data.filter((obj) => obj.id !== id); // Filter the data
    this.notes = this.notes.filter((obj) => obj._id !== id); // Filter the data
    // Delete the article from the 'mainModel'
    this.mainModel
      .deleteOne({ id: id })
      .then(function () {
        console.log("deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }
  async edit(req) {
    const acceptedData = {
      Indonesia: req.body.indo,
      Rejang: req.body.rejang,
    };

    const existingData = await this.mainModel.findOneAndUpdate(
      { _id: req.params.id },
      acceptedData,
      { new: true } // Return the updated document
    );

    if (!existingData) {
      // If the document with the specified id doesn't exist, handle it accordingly
      return;
    }

    // Update the data in the 'notes' array
    const existingDataIndex = this.notes.findIndex(
      (obj) => obj._id.toString() === req.params.id
    );

    if (existingDataIndex !== -1) {
      // Update the 'notes' array with the new data
      this.notes[existingDataIndex].Indonesia = existingData.Indonesia;
      this.notes[existingDataIndex].Rejang = existingData.Rejang;
    }
  }

  async post(Indonesia, Rejang, badword) {
    Indonesia = Indonesia.toLowerCase();
    Rejang = Rejang.toLowerCase();
    try {
      // Validasi kata kasar
      const containsBadWord = badword.some((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "i");
        return regex.test(Indonesia) || regex.test(Rejang);
      });

      if (Indonesia.trim() !== "" && Rejang.trim() !== "" && !containsBadWord) {
        // TODO: Tambahkan posting ke database terlebih dahulu.
        const existingDataIndo = await this.mainModel.findOne({ Indonesia });
        const existingDataRejang = await this.mainModel.findOne({ Rejang });

        if (!existingDataIndo && !existingDataRejang) {
          // Data belum ada dalam database, tambahkan ke database
          const _id: string = (this.notes.length + 1).toString();
          await this.mainModel.create({ Indonesia, Rejang });
          this.notes.unshift({ _id, Indonesia, Rejang });
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
  async search(input, modee) {
    try {
      const mode = modee || this.data[0].mode;
      var searchData = this.data.map((obj) => ({ ...obj }));

      if (mode == 0) {
        const doc = await this.mainModel.findOne({ Indonesia: input });
        if (doc !== null) {
          var d = doc.Rejang.replace("ê", "e");
          searchData[0].tj = d;
          searchData[0].jt = kaganga(d);
        }
      } else {
        input = input.replace("ê", "e");
        const doc = await this.mainModel.findOne({ Rejang: input });
        if (doc !== null) {
          searchData[0].tj = doc.Indonesia;
          searchData[0].jt = kaganga(doc.Indonesia);
        }
      }

      return searchData;
    } catch (error) {
      console.error("An error occurred in search:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  searchKaganga(input) {
    var searchData = this.dataKaganga.map((obj) => ({ ...obj }));

    searchData[0].tj = input;
    searchData[0].jt = kaganga(input);

    return searchData;
  }
}

var notes: data[] = [];
let kamus;
mainModel
  .find({}, "_id Indonesia Rejang")
  .then((docs) => {
    // Now the 'notes' array will contain objects with '_id', 'Indonesia', and 'Rejang' fields
    notes = docs;
    kamus = new kkbr(data, mainModel, notes, dataKaganga);
  })
  .catch((error) => {
    console.error(error);
  });
const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "client/build")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*app.post("/ganti", (req, res) => {
  kamus.ganti();
  res.redirect("/");
});
app.get("/", function (req, res) {
  res.render("home", kamus.home());
});

app.get("/atmin", async function (req, res) {
  try {
    const data = await kamus.atmin();
    console.log("Data:", data);
    res.render("atmin", { data });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/delete/:id", function (req, res) {
  kamus.delete(req.params.id);
  res.redirect("/atmin");
});

app.post("/edit/:id", async function (req, res) {
  try {
    kamus.edit(req);
    res.redirect("/database");
  } catch (error) {
    console.error(error);
    res.redirect("/database"); // Handle errors accordingly
  }
});

app.get("/database", async function (req, res) {
  try {
    const data = await kamus.atmin();
    console.log("Data:", data);
    res.render("database", { data });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

const badWordsString: any = process.env.katakasar;
const badWords = badWordsString.split(",");

app.post("/post-database", async function (req, res) {
  // Assign values from request body
  const Indonesia = req.body.Indonesia;
  const Rejang = req.body.Rejang;

  // Call the function
  await kamus.post(Indonesia, Rejang, badword);

  if (badword == true) {
    badword = false;
    res.render("badword");
  } else {
    res.send(200);
  }
});

app.get("/search", async (req, res) => {
  try {
    var input = req.query.value.toLowerCase();
    const search = await kamus.search(input);

    if (input == "doma#0777") {
      res.render("easteregg");
    } else {
      res.render("home", {
        data: search,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/searchKaganga", (req, res) => {
  var input = req.query.value.toLowerCase();

  res.render("kaganga", {
    data: kamus.searchKaganga(input),
  });
});
app.get("/kaganga", (req, res) => {
  res.render("kaganga", { data: kamus.kaganga() });
});
*/
//=============================AP
app.post("/api/ganti", (req, res) => {
  kamus.ganti();
  res.redirect("/api/");
});
app.get("/api/", function (req, res) {
  res.json(kamus.home());
});

app.get("/api/atmin", async function (req, res) {
  try {
    const data = await kamus.atmin();
    console.log("Data:", data);
    res.json({ data });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/delete/:id", function (req, res) {
  kamus.delete(req.params.id);
  res.redirect("/api/atmin");
});

app.post("/api/edit/:id", async function (req, res) {
  try {
    kamus.edit(req);
    res.send(202);
  } catch (error) {
    console.error(error);
    res.redirect("/api/database"); // Handle errors accordingly
  }
});

app.get("/api/database", async function (req, res) {
  try {
    const data = await kamus.atmin();
    console.log("Data:", data);
    res.json({ data });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/post-database", async function (req, res) {
  // Assign values from request body
  const Indonesia = req.body.Indonesia;
  const Rejang = req.body.Rejang;

  // Call the function
  await kamus.post(Indonesia, Rejang, badword);

  if (badword == true) {
    badword = false;
  } else {
    res.send(202);
  }
});

app.get("/api/search", async (req, res) => {
  try {
    var input = req.query.value.toLowerCase();
    const search = await kamus.search(input);

    res.json({
      data: search,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/search2", async (req, res) => {
  try {
    var input = req.body.value;
    const search = await kamus.search(input, req.body.mode);

    res.json({
      data: search,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/api/searchKaganga", (req, res) => {
  var input = req.query.value.toLowerCase();

  res.json({
    data: kamus.searchKaganga(input),
  });
});
app.get("/api/kaganga", (req, res) => {
  res.json({ data: kamus.kaganga() });
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

const uri = process.env.MONGODBURI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
  })
  .then(() => {
    app.listen(8080, (req, res) => {
      Host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";
      console.log("SERVER SUDAH BERJALAN");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
