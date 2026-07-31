/**
 * Reset all stats — wipes matches, match_participants, and players.
 *
 * Usage:
 *   node scripts/reset-stats.mjs           — prompts for confirmation
 *   node scripts/reset-stats.mjs --match MATCHID  — delete one specific match only
 *   node scripts/reset-stats.mjs --yes     — skip confirmation (wipe everything)
 *
 * Examples:
 *   node scripts/reset-stats.mjs
 *   node scripts/reset-stats.mjs --match RRUKU6
 *   node scripts/reset-stats.mjs --yes
 */

import pg from "pg";
import readline from "readline";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const args = process.argv.slice(2);
const matchIdx = args.indexOf("--match");
const skipConfirm = args.includes("--yes");
const specificMatch = matchIdx !== -1 ? args[matchIdx + 1] : null;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function run() {
  const client = await pool.connect();
  try {
    if (specificMatch) {
      // Delete one match only
      const check = await client.query("SELECT match_id FROM matches WHERE match_id = $1", [specificMatch]);
      if (check.rows.length === 0) {
        console.error(`❌  Match "${specificMatch}" not found.`);
        process.exit(1);
      }

      if (!skipConfirm) {
        const ans = await confirm(`⚠️  Delete match "${specificMatch}" and all its player stats? (yes/no): `);
        if (ans !== "yes" && ans !== "y") { console.log("Aborted."); process.exit(0); }
      }

      await client.query("BEGIN");
      const { rowCount: parts } = await client.query(
        "DELETE FROM match_participants WHERE match_id = $1", [specificMatch]
      );
      await client.query("DELETE FROM matches WHERE match_id = $1", [specificMatch]);
      await client.query("COMMIT");

      console.log(`✅  Deleted match ${specificMatch} and ${parts} participant row(s).`);
      console.log("    Note: player records in the players table are kept (they may appear in other matches).");

    } else {
      // Wipe everything
      const counts = await client.query(`
        SELECT
          (SELECT COUNT(*) FROM matches) AS matches,
          (SELECT COUNT(*) FROM match_participants) AS participants,
          (SELECT COUNT(*) FROM players) AS players
      `);
      const { matches, participants, players } = counts.rows[0];

      console.log(`\nCurrent database contents:`);
      console.log(`  Matches:      ${matches}`);
      console.log(`  Participants: ${participants}`);
      console.log(`  Players:      ${players}\n`);

      if (!skipConfirm) {
        const ans = await confirm("⚠️  This will DELETE ALL matches, stats, and players. Type yes to confirm: ");
        if (ans !== "yes" && ans !== "y") { console.log("Aborted."); process.exit(0); }
      }

      await client.query("BEGIN");
      await client.query("DELETE FROM match_participants");
      await client.query("DELETE FROM matches");
      await client.query("DELETE FROM players");
      await client.query("COMMIT");

      console.log(`✅  All stats wiped. Database is clean.`);
    }
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
