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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var mainModel = require("./models/post").mainModel;
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var kaganga = require("./Router/kaganga.js").kaganga;
var mongoose = require('mongoose');
require('dotenv').config();
var sql;
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
function post(data, Indonesia, Rejang) {
    return __awaiter(this, void 0, void 0, function () {
        var containsBadWord, existingDataIndo, existingDataRejang, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Indonesia = Indonesia.toLowerCase();
                    Rejang = Rejang.toLowerCase();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    containsBadWord = badWords.some(function (word) {
                        var regex = new RegExp("\\b".concat(word, "\\b"), "i");
                        return regex.test(Indonesia) || regex.test(Rejang);
                    });
                    if (!(Indonesia.trim() !== "" && Rejang.trim() !== "" && !containsBadWord)) return [3 /*break*/, 7];
                    return [4 /*yield*/, mainModel.findOne({ Indonesia: Indonesia })];
                case 2:
                    existingDataIndo = _a.sent();
                    return [4 /*yield*/, mainModel.findOne({ Rejang: Rejang })];
                case 3:
                    existingDataRejang = _a.sent();
                    if (!(!existingDataIndo && !existingDataRejang)) return [3 /*break*/, 5];
                    // Data belum ada dalam database, tambahkan ke database
                    return [4 /*yield*/, mainModel.create({ Indonesia: Indonesia, Rejang: Rejang })];
                case 4:
                    // Data belum ada dalam database, tambahkan ke database
                    _a.sent();
                    data.unshift({ Indonesia: Indonesia, Rejang: Rejang });
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
}
var notes = [];
mainModel.find({}, '_id Indonesia Rejang')
    .then(function (docs) {
    // Now the 'notes' array will contain objects with '_id', 'Indonesia', and 'Rejang' fields
    notes = docs;
})
    .catch(function (error) {
    console.error(error);
});
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post("/ganti", function (req, res) {
    if (data[0].mode == 0) {
        data[0].mode = 1;
        data[0].textBahasa = "Rejang Ke Indonesia";
    }
    else if (data[0].mode == 1) {
        data[0].mode = 0;
        data[0].textBahasa = "Indonesia Ke Rejang";
    }
    res.redirect('/');
});
app.get("/", function (req, res) {
    res.render("home", {
        data: data,
        notes: notes
    });
});
app.get("/atmin", function (req, res) {
    res.render("atmin", {
        data: notes
    });
});
app.get("/delete/:id", function (req, res) {
    data = data.filter(function (obj) { return obj.id !== req.params.id; }); // Filter the data
    // Delete the article from the 'mainModel'
    mainModel
        .deleteOne({ id: req.params.id })
        .then(function () {
        console.log("deleted"); // Success
    })
        .catch(function (error) {
        console.log(error); // Failure
    });
    res.redirect("/atmin");
});
app.post("/edit/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var acceptedData, existingData, existingDataIndex, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    acceptedData = {
                        Indonesia: req.body.indo,
                        Rejang: req.body.rejang,
                    };
                    return [4 /*yield*/, mainModel.findOneAndUpdate({ _id: req.params.id }, acceptedData, { new: true } // Return the updated document
                        )];
                case 1:
                    existingData = _a.sent();
                    if (!existingData) {
                        // If the document with the specified id doesn't exist, handle it accordingly
                        console.log("Document not found.");
                        return [2 /*return*/, res.redirect("/database")];
                    }
                    existingDataIndex = notes.findIndex(function (obj) { return obj._id.toString() === req.params.id; });
                    if (existingDataIndex !== -1) {
                        // Update the 'notes' array with the new data
                        notes[existingDataIndex].Indonesia = existingData.Indonesia;
                        notes[existingDataIndex].Rejang = existingData.Rejang;
                    }
                    console.log(existingDataIndex);
                    console.log(existingData);
                    res.redirect("/database");
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    res.redirect("/database"); // Handle errors accordingly
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.get("/database", function (req, res) {
    res.render("database", {
        data: notes
    });
});
var badWordsString = process.env.katakasar;
var badWords = badWordsString.split(',');
app.post("/post-database", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var Indonesia, Rejang;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Indonesia = req.body.Indonesia;
                    Rejang = req.body.Rejang;
                    // Call the function
                    return [4 /*yield*/, post(notes, Indonesia, Rejang)];
                case 1:
                    // Call the function
                    _a.sent();
                    if (badword == true) {
                        badword = false;
                        res.render("badword");
                    }
                    else {
                        res.redirect("/database");
                    }
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/search", function (req, res) {
    var input = req.query.value.toLowerCase();
    if (input == "doma#0777") {
        res.render("easteregg");
    }
    else {
        var mode = data[0].mode;
        var searchData = data.map(function (obj) { return (__assign({}, obj)); });
        if (mode == 0) {
            mainModel.findOne({ Indonesia: input })
                .then(function (doc) {
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
        }
        else {
            input = input.replace("ê", "e");
            mainModel.findOne({ Rejang: input })
                .then(function (doc) {
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
app.post("/searchKaganga", function (req, res) {
    var input = req.body.value.toLowerCase();
    dataKaganga[0].tj = input;
    dataKaganga[0].jt = kaganga(input);
    res.redirect('/kaganga');
});
app.get("/kaganga", function (req, res) {
    res.render("kaganga", {
        data: dataKaganga
    });
});
app.post("/search2", function (req, res) {
    var input = req.body.value.toLowerCase();
    var mode = req.body.mode;
    var searchData = data.map(function (obj) { return (__assign({}, obj)); });
    if (mode == 0) {
        mainModel.findOne({ Indonesia: input })
            .then(function (doc) {
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
    }
    else {
        mainModel.findOne({ Rejang: input })
            .then(function (doc) {
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
var uri = process.env.MONGODBURI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
})
    .then(function () {
    app.listen(8080, function (req, res) {
        Host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';
        console.log("SERVER SUDAH BERJALAN");
    });
})
    .catch(function (error) {
    console.error('Database connection error:', error);
});
