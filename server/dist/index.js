"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pusherChannel = exports.pusher = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const safe_1 = __importDefault(require("@colors/colors/safe"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const Pusher_1 = __importDefault(require("./config/Pusher"));
const app = (0, express_1.default)();
const pusher = (0, Pusher_1.default)();
exports.pusher = pusher;
const pusherChannel = 'bug-tracker';
exports.pusherChannel = pusherChannel;
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ limit: '30mb', extended: true }));
app.use((0, cors_1.default)({ origin: process.env.ORIGIN, credentials: true }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('Welcome to the Bug Tracker API!');
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
const PORT = +process.env.PORT;
const CONNECTION_URI = process.env.MONGO_URI || '';
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(CONNECTION_URI)
    .then((conn) => {
    app.listen(PORT, () => {
        console.log(`Connected to ${conn.connection.name} successfully...`);
        console.log('Host:', safe_1.default.cyan(conn.connection.host));
        console.log('Port:', safe_1.default.cyan(PORT.toString()));
    });
}).catch((err) => {
    console.log('\nError connecting to MongoDB...');
    console.log('Message:', safe_1.default.red(err.message || err), '\n');
});
