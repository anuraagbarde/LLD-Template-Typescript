import express from 'express';
const router = express.Router();

router.get('/:id', (req, res) => {
  res.status(200);
  res.json({
    id: req.params.id,
  });
  return res;
});

export default router;
