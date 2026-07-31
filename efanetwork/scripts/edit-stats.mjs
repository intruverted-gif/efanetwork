/**
 * Edit a player's stats for a specific match.
 *
 * Usage:
 *   node scripts/edit-stats.mjs <matchId> <playerName|userId> <category> <key=value> [key=value ...]
 *
 * Categories: passing | rushing | receiving | defense
 *
 * Examples:
 *   node scripts/edit-stats.mjs RRUKU6 silentfloat rushing yards=55 carries=3 tds=1
 *   node scripts/edit-stats.mjs RRUKU6 3291847 passing yards=210 completions=14 attempts=22 tds=2 ints=0
 */

import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const [, , matchId, playerArg, category, ...pairs] = process.argv;

const VALID_CATEGORIES = ["passing", "rushing", "receiving", "defense"];

if (!matchId || !playerArg || !category || pairs.length === 0) {
  console.error(
    "Usage: node scripts/edit-stats.mjs <matchId> <playerName|userId> <category> <key=value> ...\n" +
    "Example: node scripts/edit-stats.mjs RRUKU6 silentfloat rushing yards=55 carries=3 tds=1"
  );
  process.exit(1);
}

if (!VALID_CATEGORIES.includes(category)) {
  console.error(`❌  Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  process.exit(1);
}

// Parse key=value pairs into an object of numbers
const updates = {};
for (const pair of pairs) {
  const eq = pair.indexOf("=");
  if (eq === -1) { console.error(`❌  Bad argument "${pair}" — must be key=value`); process.exit(1); }
  const key = pair.slice(0, eq);
  const val = Number(pair.slice(eq + 1));
  if (isNaN(val)) { console.error(`❌  Value for "${key}" is not a number`); process.exit(1); }
  updates[key] = val;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    // Find the participant row — by name (case-insensitive) or userId
    const isNumeric = /^\d+$/.test(playerArg);
    const findQuery = isNumeric
      ? `SELECT mp.id, p.display_name, mp.${category}
         FROM match_participants mp
         JOIN players p ON p.user_id = mp.user_id
         WHERE mp.match_id = $1 AND mp.user_id = $2`
      : `SELECT mp.id, p.display_name, mp.${category}
         FROM match_participants mp
         JOIN players p ON p.user_id = mp.user_id
         WHERE mp.match_id = $1 AND LOWER(p.display_name) = LOWER($2)`;

    const findParams = isNumeric ? [matchId, parseInt(playerArg)] : [matchId, playerArg];
    const found = await client.query(findQuery, findParams);

    if (found.rows.length === 0) {
      console.error(`❌  No participant found for "${playerArg}" in match "${matchId}".`);
      console.error(`    Run this to list players in that match:`);
      console.error(`    node scripts/edit-stats.mjs --list ${matchId}`);
      process.exit(1);
    }

    const row = found.rows[0];
    const current = row[category] || {};
    const merged = { ...current, ...updates };

    await client.query(
      `UPDATE match_participants SET ${category} = $1 WHERE id = $2`,
      [JSON.stringify(merged), row.id]
    );

    console.log(`✅  Updated ${category} stats for ${row.display_name} in match ${matchId}`);
    console.log("   Before:", JSON.stringify(current));
    console.log("   After: ", JSON.stringify(merged));
  } finally {
    client.release();
    await pool.end();
  }
}

// --list mode
if (matchId === "--list") {
  const listMatchId = playerArg;
  if (!listMatchId) { console.error("Usage: node scripts/edit-stats.mjs --list <matchId>"); process.exit(1); }
  const pool2 = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool2.connect();
  try {
    const res = await client.query(
      `SELECT p.display_name, p.user_id, mp.team_name, mp.passing, mp.rushing, mp.receiving, mp.defense
       FROM match_participants mp
       JOIN players p ON p.user_id = mp.user_id
       WHERE mp.match_id = $1
       ORDER BY mp.team_name, p.display_name`,
      [listMatchId]
    );
    if (res.rows.length === 0) { console.log(`No participants found for match "${listMatchId}".`); }
    else {
      console.log(`\nPlayers in match ${listMatchId}:\n`);
      for (const r of res.rows) {
        console.log(`  ${r.display_name.padEnd(25)} (userId: ${r.user_id})  team: ${r.team_name}`);
        if (r.passing)   console.log(`    passing:   ${JSON.stringify(r.passing)}`);
        if (r.rushing)   console.log(`    rushing:   ${JSON.stringify(r.rushing)}`);
        if (r.receiving) console.log(`    receiving: ${JSON.stringify(r.receiving)}`);
        if (r.defense)   console.log(`    defense:   ${JSON.stringify(r.defense)}`);
      }
    }
  } finally {
    client.release();
    await pool2.end();
  }
  process.exit(0);
}

run().catch((err) => { console.error("❌ ", err.message); process.exit(1); });
