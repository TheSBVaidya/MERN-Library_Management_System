const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const router = express.Router();

const role = "owner";

//login
router.post("/adminLogin", (req, resp) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM members WHERE role = ? and email = ? and password = ?",
    [role, email, password],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      if (result.length !== 1)
        return resp.send(apiError("Wrong Credential !!"));
      resp.send(apiSuccess(result[0]));
    }
  );
});

// get based on role
router.get("/getAll/:role", (req, resp) => {
  db.query(
    "SELECT * FROM members WHERE role = ?",
    [req.params.role],
    (err, result) => {
      if (err) return resp.send(apiError(err));
      resp.send(apiSuccess(result));
    }
  );
});

//add Librarian
router.post("/addLibrarian", (req, resp) => {
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

module.exports = router;
