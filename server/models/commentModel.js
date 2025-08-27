"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var commentSchema = new mongoose_1["default"].Schema({
    text: { type: String, required: true },
    author: { type: mongoose_1["default"].Schema.Types.ObjectId, ref: 'User', required: true },
    ticket: { type: mongoose_1["default"].Schema.Types.ObjectId, ref: 'Ticket', required: true }
}, {
    timestamps: true
});
exports["default"] = mongoose_1["default"].model('Comment', commentSchema);
