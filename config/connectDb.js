const connect = async () => {
    if (global.connection && global.connection.state !== "disconnected")
        return global.connection;

    require("dotenv").config();
    const mysql = require("mysql2/promise");

    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB,
        port: process.env.PORT,
    });
    global.connection = connection;
    return connection;
};

module.exports = { connect };
