import { Router, type IRouter } from 'express';
import { pool } from '@workspace/db';

const router: IRouter = Router();

function requireApiKey(req: any, res: any, next: any) {
  const apiKey = process.env.EXPORT_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'EXPORT_API_KEY not set' }); return; }
  const auth = req.headers['authorization'] as string | undefined;
  if (!auth || auth.slice(7) !== apiKey) { res.status(401).json({ error: 'Unauthorized' }); return; }
  next();
}

// TEMPORARY — delete this route after use
router.delete('/admin/reset-stats', requireApiKey, async (_req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rowCount: parts } = await client.query('DELETE FROM match_participants');
    const { rowCount: matches } = await client.query('DELETE FROM matches');
    const { rowCount: players } = await client.query('DELETE FROM players');
    await client.query('COMMIT');
    res.json({ ok: true, deleted: { matches, participants: parts, players } });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: String(err) });
  } finally {
    client.release();
  }
});

export default router;
