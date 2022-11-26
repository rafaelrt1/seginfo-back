var express = require("express");
var router = express.Router();
const db = require("../config/connectDb");

const getAccouts = async () => {
    const conn = await db.connect();
    const [accounts] = await conn.query(
        "SELECT id, app as 'name', login, senha as 'password', lastModified from senhas where idUsuario = 1"
    );
    return accounts;
};

router.post("/add-account", async (req, res, next) => {
    try {
        const newAccount = req.body.account;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(
            date.getMonth() + 1
        ).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}-${date.getDate().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })} ${date.getHours().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}:${date.getMinutes().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}:${date.getSeconds().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}`;
        const conn = await db.connect();
        const [rows] = await conn.query(
            "INSERT INTO senhas (app, login, senha, idUsuario, lastModified) values (?, ?, ?, ?, ?)",
            [
                newAccount.name,
                newAccount.login,
                newAccount.password,
                1,
                formattedDate,
            ]
        );
        const result = await getAccouts();
        res.json(result);
    } catch (e) {
        res.json({
            error: "Não foi possível realizar esta operação",
        });
    }
});

router.put("/add-account", async (req, res, next) => {
    try {
        const account = req.body.account;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(
            date.getMonth() + 1
        ).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}-${date.getDate().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })} ${date.getHours().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}:${date.getMinutes().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}:${date.getSeconds().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}`;
        const conn = await db.connect();
        const [rows] = await conn.query(
            "UPDATE senhas set app = ?, login = ?, senha = ?, lastModified = ? where id = ? and idUsuario = ?",
            [
                account.name,
                account.login,
                account.password,
                formattedDate,
                account.id,
                1,
            ]
        );
        const result = await getAccouts();
        res.json(result);
    } catch (e) {
        res.json({
            error: "Não foi possível realizar esta operação",
        });
    }
});

router.delete("/account", async (req, res, next) => {
    try {
        const id = req.body.id;
        const conn = await db.connect();
        const [rows] = await conn.query("DELETE from senhas where id = ?", id);
        const result = await getAccouts();
        res.json(result);
    } catch (e) {
        res.json({
            error: "Não foi possível realizar esta operação",
        });
    }
});

router.delete("/delete-all-accounts", async (req, res, next) => {
    try {
        const conn = await db.connect();
        const [rows] = await conn.query("DELETE from senhas");
        const result = await getAccouts();
        res.json("Sucesso");
    } catch (e) {
        res.json({
            error: "Não foi possível realizar esta operação",
        });
    }
});

router.get("/user", async (req, res, next) => {
    const conn = await db.connect();
    const [user] = await conn.query("SELECT * from usuarios where id = 1");
    if (user?.length) res.json("registered");
    else res.json("unregistered");
});

router.post("/app-password", async (req, res, next) => {
    try {
        const password = req.body.password;
        const conn = await db.connect();

        const [user] = await conn.query("SELECT * from usuarios where id = 1", [
            password,
        ]);

        if (user?.length) {
            await conn.query("UPDATE usuarios set senha = ?", password);
        } else {
            await conn.query(
                "INSERT INTO usuarios (id, senha) values (1, ?)",
                password
            );
        }
        res.json({});
    } catch (e) {
        res.json({ error: "Erro ao criar senha" });
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const password = req.body.password;
        const conn = await db.connect();

        const [user] = await conn.query("SELECT * from usuarios where id = 1");
        return res.json({
            status: `${user[0].senha === password ? "OK" : "error"}`,
        });
    } catch (e) {
        res.json({ error: "Erro ao criar senha" });
    }
});

router.get("/app-password", async (req, res, next) => {
    try {
        const conn = await db.connect();
        const [user] = await conn.query(
            "SELECT senha from usuarios where id = 1"
        );
        res.json(user[0].senha);
    } catch (e) {}
});

router.get("/accounts", async (req, res, next) => {
    const result = await getAccouts();
    res.json(result);
});

module.exports = router;
