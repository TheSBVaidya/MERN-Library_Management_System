const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const { createToken, jwtAuth } = require("../utils/jwtauth");
const router = express.Router();

const role = "librarian";

router.get("/dashboard", (req, resp) => {
  const sql = `SELECT 
                (SELECT COUNT(*) FROM books) AS total_books,
                (SELECT COUNT(*) FROM members) AS total_members,
                (SELECT SUM(amount) FROM payments WHERE type = 'Fine') AS total_fines,
                (SELECT SUM(amount) FROM payments) AS total_amount`;

  db.query(sql, (err, result) => {
    if (err) return resp.status(400).send(apiError(err));
    resp.send(apiSuccess(result[0]));
  });
});

//login Librarian
router.post("/loginLibrarian", (req, resp) => {
  const { email, password } = req.body;
  db.query(
    "SELECT id,name,role,password FROM members WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      if (result.length !== 1) return resp.status(400).send(apiError("0")); //User Not Found
      const dbUser = result[0];
      const isMatching = password;
      if (dbUser.role !== role) return resp.status(400).send(apiError("-2")); // Enter Correct Email and Password
      if (isMatching !== dbUser.password)
        return resp.status(400).send(apiError("-1")); // Wrong Password

      const token = createToken(dbUser);

      resp.send(apiSuccess({ ...dbUser, token }));
    }
  );
});

//forget password
router.put("/editProfile/:id", jwtAuth, (req, resp) => {
  const { password, phone } = req.body;
  db.query(
    "UPDATE members SET password = ?, phone = ? WHERE id = ?",
    [password, phone, req.params.id],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      resp.send(apiSuccess("User Update Successfully"));
    }
  );
});

//getBookbyId
router.get("/getBook/:id", jwtAuth, (req, resp) => {
  db.query(
    "SELECT name, author, subject, price, isbn FROM books WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return resp.status(404).send(apiError("Book is Not Found"));
      resp.send(apiSuccess(result[0]));
    }
  );
});

//addBook
router.post("/addBook", jwtAuth, (req, resp) => {
  const { name, author, subject, price, isbn } = req.body;
  db.query(
    "INSERT INTO books(name, author, subject, price, isbn) VALUES(?, ?, ?, ?, ?)",
    [name, author, subject, price, isbn],
    (err, result) => {
      if (err) return resp.status(401).send(apiError(err));
      resp.send(apiSuccess("New Book Added"));
    }
  );
});

//updateBook
router.put("/updateBook/:id", jwtAuth, (req, resp) => {
  const { name, author, subject, price, isbn } = req.body;
  db.query(
    "UPDATE books SET name = ?, author = ?, subject = ?, price = ?, isbn = ? WHERE id = ?",
    [name, author, subject, price, isbn, req.params.id],
    (err, result) => {
      if (err) return resp.status(404).send(apiError("Book Not Updated"));
      resp.send(apiSuccess("Book Updated"));
    }
  );
});

//get Subjects
router.get("/getSubjects", jwtAuth, (req, resp) => {
  const sql = `SELECT DISTINCT subject FROM books`;
  db.query(sql, (err, result) => {
    if (err) return resp.status(400).send(apiError(err));

    const subjectsResult = result
      .map((row) => row.subject)
      .filter((subject) => subject !== null);

    resp.send(apiSuccess(subjectsResult));
  });
});

router.post("/addBookCopy", jwtAuth, (req, resp) => {
  const { book_id, rack } = req.body;
  const sql = `INSERT INTO copies(book_id, rack, status) VALUES(?, ?, ?)`;
  const status = "available";
  db.query(sql, [book_id, rack, status], (err, result) => {
    if (err) return resp.status(400).send(apiError(err));
    resp.send(apiSuccess("1")); // Copy Added
  });
});

router.get("/getAllBooks", jwtAuth, (req, resp) => {
  const sql = `SELECT 
                b.id,
                b.name,
                b.author,
                b.subject,
                b.price,
                b.isbn,
                COUNT(c.id) AS copies,
                SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END) AS available,
                SUM(CASE WHEN c.status = 'borrowed' THEN 1 ELSE 0 END) AS borrowed
              FROM books b
              LEFT JOIN copies c ON b.id = c.book_id
              GROUP BY 
                  b.id, b.name, b.author, b.subject, b.price, b.isbn`;
  db.query(sql, (err, result) => {
    if (err) return resp.status(400).send(apiError(err));

    resp.send(apiSuccess(result));
  });
});

router.delete("/deleteBook/:id", jwtAuth, (req, resp) => {
  db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return resp.status(400).send(apiError(err));
    return resp.send(apiSuccess("Book Deleted"));
  });
});

router.get("/getAllPayments", jwtAuth, (req, resp) => {
  const sql = `SELECT 
                  p.id,
                  m.name AS member_name,
                  p.amount,
                  p.type,
                  p.txtime,
                  p.status
              FROM payments p 
              JOIN members m ON p.member_id = m.id `;
  db.query(sql, (err, result) => {
    if (err) return resp.status(400).send(apiError(err));
    resp.send(apiSuccess(result));
  });
});

module.exports = router;
