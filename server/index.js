"use strict";
exports.__esModule = true;
exports.pusherChannel = exports.pusher = void 0;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var cors_1 = require("cors");
var morgan_1 = require("morgan");
var cookie_parser_1 = require("cookie-parser");
var safe_1 = require("@colors/colors/safe");
var userRoutes_1 = require("./routes/userRoutes");
var projectRoutes_1 = require("./routes/projectRoutes");
var ticketRoutes_1 = require("./routes/ticketRoutes");
var Pusher_1 = require("./config/Pusher");
var app = (0, express_1["default"])();
var pusher = (0, Pusher_1["default"])();
exports.pusher = pusher;
var pusherChannel = 'bug-tracker';
exports.pusherChannel = pusherChannel;
app.use(express_1["default"].json({ limit: '30mb' }));
app.use(express_1["default"].urlencoded({ limit: '30mb', extended: true }));
app.use((0, cors_1["default"])({ origin: process.env.ORIGIN, credentials: true }));
app.use((0, morgan_1["default"])('dev'));
app.use((0, cookie_parser_1["default"])());
app.get('/', function (req, res) {
    res.send('Welcome to the Bug Tracker API!');
});
app.use('/api/users', userRoutes_1["default"]);
app.use('/api/projects', projectRoutes_1["default"]);
app.use('/api/tickets', ticketRoutes_1["default"]);
var PORT = +process.env.PORT;
var CONNECTION_URI = process.env.MONGO_URI || '';
mongoose_1["default"].set('strictQuery', false);
mongoose_1["default"].connect(CONNECTION_URI)
    .then(function (conn) {
    app.listen(PORT, function () {
        console.log("Connected to ".concat(conn.connection.name, " successfully..."));
        console.log('Host:', safe_1["default"].cyan(conn.connection.host));
        console.log('Port:', safe_1["default"].cyan(PORT.toString()));
    });
})["catch"](function (err) {
    console.log('\nError connecting to MongoDB...');
    console.log('Message:', safe_1["default"].red(err.message || err), '\n');
});
