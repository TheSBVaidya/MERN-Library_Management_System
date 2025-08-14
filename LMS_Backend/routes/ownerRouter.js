const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, aptError } = require("../utils/apiresult");
const router = express.Router();

router.get("/getAll/:role", (req, resp) => {
  db.query(
    "SELECT * FROM members WHERE role = ?",
    [req.params.role],
    (err, result) => {
      if (err) return resp.send(aptError(err));
      resp.send(apiSuccess(result));
    }
  );
});

module.exports = router;
