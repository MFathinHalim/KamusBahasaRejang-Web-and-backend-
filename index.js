var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var mainModel = require("./models/post").mainModel;
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var kaganga = require("./Router/kaganga.js").kaganga;
var cors = require("cors"); // Import the CORS middleware
var mongoose = require("mongoose");
require("dotenv").config();
var sql;
var data = [
    {
        id: 0,
        tj: "Arti Muncul Disini",
        jt: "kgf",
        mode: 0,
        textBahasa: "Indonesia Ke Rejang"
    },
];
var dataKaganga = [
    {
        tj: "Arti Muncul Disini",
        jt: "kgf"
    },
];
var badword = false;
var kkbr = /** @class */ (function () {
    function kkbr(data, mainModel, notes, dataKaganga) {
        this.data = data;
        this.mainModel = mainModel;
        this.notes = notes;
        this.dataKaganga = dataKaganga;
    }
    kkbr.prototype.ganti = function () {
        if (this.data[0].mode == 0) {
            this.data[0].mode = 1;
            this.data[0].textBahasa = "Rejang Ke Indonesia";
        }
        else if (this.data[0].mode == 1) {
            this.data[0].mode = 0;
            this.data[0].textBahasa = "Indonesia Ke Rejang";
        }
    };
    kkbr.prototype.home = function () {
        return {
            data: this.data,
            notes: this.notes
        };
    };
    kkbr.prototype.atmin = function () {
        return this.notes;
    };
    kkbr.prototype.kaganga = function () {
        return this.dataKaganga;
    };
    kkbr.prototype["delete"] = function (id) {
        this.data = this.data.filter(function (obj) { return obj.id !== id; }); // Filter the data
        this.notes = this.notes.filter(function (obj) { return obj._id !== id; }); // Filter the data
        // Delete the article from the 'mainModel'
        this.mainModel
            .deleteOne({ id: id })
            .then(function () {
            console.log("deleted"); // Success
        })["catch"](function (error) {
            console.log(error); // Failure
        });
    };
    kkbr.prototype.edit = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var acceptedData, existingData, existingDataIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acceptedData = {
                            Indonesia: req.body.indo,
                            Rejang: req.body.rejang
                        };
                        return [4 /*yield*/, this.mainModel.findOneAndUpdate({ _id: req.params.id }, acceptedData, { "new": true } // Return the updated document
                            )];
                    case 1:
                        existingData = _a.sent();
                        if (!existingData) {
                            // If the document with the specified id doesn't exist, handle it accordingly
                            return [2 /*return*/];
                        }
                        existingDataIndex = this.notes.findIndex(function (obj) { return obj._id.toString() === req.params.id; });
                        if (existingDataIndex !== -1) {
                            // Update the 'notes' array with the new data
                            this.notes[existingDataIndex].Indonesia = existingData.Indonesia;
                            this.notes[existingDataIndex].Rejang = existingData.Rejang;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    kkbr.prototype.post = function (Indonesia, Rejang, badword) {
        return __awaiter(this, void 0, void 0, function () {
            var containsBadWord, existingDataIndo, existingDataRejang, _id, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Indonesia = Indonesia.toLowerCase();
                        Rejang = Rejang.toLowerCase();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        containsBadWord = badword.some(function (word) {
                            var regex = new RegExp("\\b".concat(word, "\\b"), "i");
                            return regex.test(Indonesia) || regex.test(Rejang);
                        });
                        if (!(Indonesia.trim() !== "" && Rejang.trim() !== "" && !containsBadWord)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.mainModel.findOne({ Indonesia: Indonesia })];
                    case 2:
                        existingDataIndo = _a.sent();
                        return [4 /*yield*/, this.mainModel.findOne({ Rejang: Rejang })];
                    case 3:
                        existingDataRejang = _a.sent();
                        if (!(!existingDataIndo && !existingDataRejang)) return [3 /*break*/, 5];
                        _id = (this.notes.length + 1).toString();
                        return [4 /*yield*/, this.mainModel.create({ Indonesia: Indonesia, Rejang: Rejang })];
                    case 4:
                        _a.sent();
                        this.notes.unshift({ _id: _id, Indonesia: Indonesia, Rejang: Rejang });
                        return [3 /*break*/, 6];
                    case 5:
                        console.log("Data already exists in the database.");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        badword = true;
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    kkbr.prototype.search = function (input, modee) {
        return __awaiter(this, void 0, void 0, function () {
            var mode, searchData, doc, d, doc, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        mode = modee || this.data[0].mode;
                        searchData = this.data.map(function (obj) { return (__assign({}, obj)); });
                        if (!(mode == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.mainModel.findOne({ Indonesia: input })];
                    case 1:
                        doc = _a.sent();
                        if (doc !== null) {
                            d = doc.Rejang.replace("ê", "e");
                            searchData[0].tj = d;
                            searchData[0].jt = kaganga(d);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        input = input.replace("ê", "e");
                        return [4 /*yield*/, this.mainModel.findOne({ Rejang: input })];
                    case 3:
                        doc = _a.sent();
                        if (doc !== null) {
                            searchData[0].tj = doc.Indonesia;
                            searchData[0].jt = kaganga(doc.Indonesia);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, searchData];
                    case 5:
                        error_1 = _a.sent();
                        console.error("An error occurred in search:", error_1);
                        throw error_1; // Rethrow the error to be caught by the calling function
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    kkbr.prototype.searchKaganga = function (input) {
        var searchData = this.dataKaganga.map(function (obj) { return (__assign({}, obj)); });
        searchData[0].tj = input;
        searchData[0].jt = kaganga(input);
        return searchData;
    };
    return kkbr;
}());
var notes = [];
var kamus;
mainModel
    .find({}, "_id Indonesia Rejang")
    .then(function (docs) {
    // Now the 'notes' array will contain objects with '_id', 'Indonesia', and 'Rejang' fields
    notes = docs;
    kamus = new kkbr(data, mainModel, notes, dataKaganga);
})["catch"](function (error) {
    console.error(error);
});
var app = express();
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
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
app.post("/api/ganti", function (req, res) {
    kamus.ganti();
    res.redirect("/api/");
});
app.get("/api/", function (req, res) {
    res.json(kamus.home());
});
app.get("/api/atmin", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var data_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, kamus.atmin()];
                case 1:
                    data_1 = _a.sent();
                    console.log("Data:", data_1);
                    res.json({ data: data_1 });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("An error occurred:", error_2);
                    res.status(500).send("Internal Server Error");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.get("/api/delete/:id", function (req, res) {
    kamus["delete"](req.params.id);
    res.redirect("/api/atmin");
});
app.post("/api/edit/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                kamus.edit(req);
                res.send(202);
            }
            catch (error) {
                console.error(error);
                res.redirect("/api/database"); // Handle errors accordingly
            }
            return [2 /*return*/];
        });
    });
});
app.get("/api/database", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var data_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, kamus.atmin()];
                case 1:
                    data_2 = _a.sent();
                    console.log("Data:", data_2);
                    res.json({ data: data_2 });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("An error occurred:", error_3);
                    res.status(500).send("Internal Server Error");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post("/api/post-database", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var Indonesia, Rejang;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Indonesia = req.body.Indonesia;
                    Rejang = req.body.Rejang;
                    // Call the function
                    return [4 /*yield*/, kamus.post(Indonesia, Rejang, badword)];
                case 1:
                    // Call the function
                    _a.sent();
                    if (badword == true) {
                        badword = false;
                    }
                    else {
                        res.send(202);
                    }
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/api/search", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var input, search, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                input = req.query.value.toLowerCase();
                return [4 /*yield*/, kamus.search(input)];
            case 1:
                search = _a.sent();
                res.json({
                    data: search
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("An error occurred:", error_4);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/search2", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var input, search, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                input = req.body.value;
                return [4 /*yield*/, kamus.search(input, req.body.mode)];
            case 1:
                search = _a.sent();
                res.json({
                    th: search.tj
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("An error occurred:", error_5);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/api/searchKaganga", function (req, res) {
    var input = req.query.value.toLowerCase();
    res.json({
        data: kamus.searchKaganga(input)
    });
});
app.get("/api/kaganga", function (req, res) {
    res.json({ data: kamus.kaganga() });
});
app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});
var uri = process.env.MONGODBURI;
mongoose
    .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
    .then(function () {
    app.listen(8080, function (req, res) {
        Host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";
        console.log("SERVER SUDAH BERJALAN");
    });
})["catch"](function (error) {
    console.error("Database connection error:", error);
});
