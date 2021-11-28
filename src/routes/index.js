const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("You are connected to this app");
});

module.exports = router;
