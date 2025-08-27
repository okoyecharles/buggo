"use strict";
exports.__esModule = true;
var pusher_1 = require("pusher");
var connectToPusher = function () {
    // Add pusher for real time updates
    return new pusher_1["default"]({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_APP_KEY,
        secret: process.env.PUSHER_APP_SECRET,
        cluster: "eu",
        useTLS: true
    });
};
exports["default"] = connectToPusher;
