const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const { createToken, jwtAuth } = require("../utils/jwtauth");
const router = express.Router();

const role = "admin";

//login
router.post("/adminLogin", (req, resp) => {
  const { email, password } = req.body;
  db.query(
    "SELECT id,name FROM members WHERE role = ? and email = ? and password = ?",
    [role, email, password],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      if (result.length !== 1)
        return resp.send(apiError("Wrong Credential !!"));

      const dbAdmin = result[0];

      const token = createToken(dbAdmin);
      resp.send(apiSuccess({ ...dbAdmin, token }));
    }
  );
});

// get based on role
router.get("/getAll/:role", jwtAuth, (req, resp) => {
  db.query(
    "SELECT id,name,email,phone FROM members WHERE role = ? AND flag = 'false'",
    [req.params.role],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      resp.send(apiSuccess(result));
    }
  );
});

//add Librarian
router.post("/addLibrarian", jwtAuth, (req, resp) => {
  const { name, email, password } = req.body;
  const role = "librarian";
  db.query(
    "INSERT INTO members (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      resp.send(apiSuccess("New Librarian Added"));
    }
  );
});

router.get("/getbyName", jwtAuth, (req, resp) => {
  const { name, role } = req.query;
  const value = name + "%";

  const sql = `SELECT id,name,email, phone from members WHERE name LIKE ? AND role = ?`;

  db.query(sql, [value, role], (err, result) => {
    if (err) return resp.status(404).send(apiError(err));

    resp.send(apiSuccess(result));
  });
});

router.patch("/deleteMember/:id", jwtAuth, (req, resp) => {
  db.query(
    "UPDATE members SET flag = 1 WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return resp.status(404).send(apiError(err));

      resp.send(apiSuccess("User Delete Successfully"));
    }
  );
});

router.get("/dashboard", jwtAuth, (req, resp) => {
  const sql = `SELECT
                SUM(CASE WHEN role = 'librarian' THEN 1 ELSE 0 END) AS librarian_count,
                SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) AS user_count
              FROM
                members
              WHERE
                flag = 0;`;

  db.query(sql, (err, result) => {
    if (err) return resp.status(404).send(apiError(err));

    resp.send(apiSuccess(result[0]));
  });
});

module.exports = router;
