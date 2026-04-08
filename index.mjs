import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "bqmayq5x95g1sgr9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xmp5mr6euvg1wfgv",
    password: "c86t00ploqkdv6qy",
    database: "lvrxrzvw9a1cobbu",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let sql1 = `SELECT authorId, firstName, lastName
                FROM q_authors
                ORDER BY lastName`;

    let sql2 = `SELECT DISTINCT category
                FROM q_quotes
                ORDER BY category`;

    const [authors] = await pool.query(sql1);
    const [categories] = await pool.query(sql2);

    res.render("index", { authors: authors, categories: categories });
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;

    let sql = `SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE quote LIKE ?`;

    let sqlParams = [`%${keyword}%`];

    const [rows] = await pool.query(sql, sqlParams);

    res.render("results", { "quotes": rows });
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;

    let sql = `SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE authorId = ?`;

    let sqlParams = [userAuthorId];

    const [rows] = await pool.query(sql, sqlParams);

    res.render("results", { "quotes": rows });
});

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;

    let sql = `SELECT *
               FROM q_authors
               WHERE authorId = ?`;

    const [rows] = await pool.query(sql, [authorId]);

    res.send(rows);
});
app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;

    let sql = `SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE category = ?`;

    const [rows] = await pool.query(sql, [category]);

    res.render("results", { quotes: rows });
});

app.get('/searchByLikes', async (req, res) => {
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;

    let sql = `SELECT authorId, firstName, lastName, quote, likes
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE likes BETWEEN ? AND ?`;

    const [rows] = await pool.query(sql, [minLikes, maxLikes]);

    res.render("results", { quotes: rows });
});

app.listen(3000, ()=>{
    console.log("Express server running")
})

 

 