import express from 'express';
const router = express.Router();

import * as GameService from '@services/gameService';

router.post('/create', (req, res) => {
  try {
    const input: {
      userIds: Array<string>;
    } = req.body;
    const response = GameService.create(input);
    res.status(200).json(response);
    return res;
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
    return res;
  }
});

export default router;
