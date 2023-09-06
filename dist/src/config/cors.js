"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelist = [
    'http://localhost:5173',
    'http://localhost:8081',
    'https://zippy-starlight-26ce2f.netlify.app',
];
const corsOption = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
            // console.log(origin, 'is allowed by CORS');
        }
        else {
            console.log(origin, 'is block by CORS');
        }
    },
    credentials: true,
};
exports.default = corsOption;
