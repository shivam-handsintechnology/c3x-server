const mongoose = require("mongoose")
const BatchNumberSchema = mongoose.Schema({
    BatchNumber: { type: String, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo',
        // unique: true,
    },
}, {
    timestamps: true,
})
let BatchNumberModel = mongoose.model("BatchNumberModel", BatchNumberSchema)
module.exports = BatchNumberModel