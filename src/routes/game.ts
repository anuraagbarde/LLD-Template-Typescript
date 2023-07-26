import express from 'express';
const router = express.Router();

import GameService from '../services/gameService.js';
import { BadRequestError } from '../utils/error.js';

const tryCatchWrapper = (fn: (req: express.Request, res: express.Response) => express.Response) => {
  return (req: express.Request, res: express.Response) => {
    try {
      fn(req, res);
    } catch (err) {
      console.log(err);
      if (err instanceof BadRequestError) return res.status(err.httpCode).json({ error: err, message: err.message });
      if (err instanceof Error) return res.status(500).json({ error: err, message: err.message });
      res.status(500).json({ error: err, message: 'Internal Server Error!' });
      return res;
    }
  };
};

router.post(
  '/create',
  tryCatchWrapper((req, res) => {
    const input: { userIds: Array<string> } = req.body;
    const response = GameService.create(input);

    res.status(200).json(response);
    return res;
  })
);

router.post(
  '/:id/move',
  tryCatchWrapper((req, res) => {
    if (!req.params.id) throw new BadRequestError('No game id provided');
    const response = GameService.move({
      gameId: req.params.id,
      userId: req.body.userId,
      x: req.body.x,
      y: req.body.y,
    });
    res.status(200).json(response);
    return res;
  })
);

router.get(
  '/:id',
  tryCatchWrapper((req, res) => {
    if (!req.params.id) throw new BadRequestError('No game id provided');
    const response = GameService.getGameById(req.params.id);
    res.status(200).json(response);
    return res;
  })
);

router.get(
  '/',
  tryCatchWrapper((req, res) => {
    const response = GameService.getAllGames();
    res.status(200).json(response);
    return res;
  })
);

export default router;
