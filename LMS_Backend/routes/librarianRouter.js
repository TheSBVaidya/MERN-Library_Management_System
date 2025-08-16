const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const router = express.Router();

const role = "librarian";

//login Librarian
router.post("/loginLibrarian", (req, resp) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM members WHERE email = ?", [email], (err, result) => {
    if (err) return resp.send(apiError(err));
    if (result.length !== 1) return resp.send(apiError("0")); //User Not Found
    const dbUser = result[0];
    const isMatching = password;
    if (dbUser.role !== role) return resp.send(apiError("-2")); // Enter Correct Email and Password
    if (isMatching !== dbUser.password) return resp.send(apiError("-1")); // Wrong Password

    resp.send(apiSuccess(dbUser));
  });
});

//forget password
router.put("/editProfile/:id", (req, resp) => {
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

module.exports = router;
