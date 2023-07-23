import express from 'express';
const router = express.Router();

import * as GameService from '@services/gameService';

router.post('/create', (req, res) => {
  res.status(200);
  const input: {
    userIds: Array<string>;
  } = req.body;

  res.json({
    // id: req.params.id,
  });
  return res;
});

export default router;
