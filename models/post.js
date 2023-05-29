const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    Indonesia: String,
    Rejang: String
})


module.exports = {
    mainModel: model("mains", postSchema),
}
