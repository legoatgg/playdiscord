// routes/admin.js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Admin route active');
});

module.exports = router;
