# EFA Stats — Terminal Command Reference

Run all commands from the Shell tab in the workspace root (`~/workspace`).

---

## Reset Stats

### Wipe everything (all matches, all players, all stats)
```bash
node scripts/reset-stats.mjs
```
Will show current counts and ask you to type `yes` before deleting.

### Skip the confirmation prompt
```bash
node scripts/reset-stats.mjs --yes
```

### Delete one specific match only
```bash
node scripts/reset-stats.mjs --match RRUKU6
```
Removes the match and all its player stat rows. Player records are kept (they may have other matches).

---

## Edit Stats

### See all players in a match (do this first to get names right)
```bash
node scripts/edit-stats.mjs --list ABC123
```

### Edit a player's stats by name
```bash
node scripts/edit-stats.mjs <matchId> <playerName> <category> key=value key=value ...
```

### Edit a player's stats by Roblox userId
```bash
node scripts/edit-stats.mjs <matchId> <userId> <category> key=value key=value ...
```

### Categories and their valid keys

| Category  | Keys |
|-----------|------|
| passing   | `completions` `attempts` `yards` `tds` `ints` |
| rushing   | `carries` `yards` `tds` |
| receiving | `receptions` `yards` `tds` |
| defense   | `tackles` `interceptions` |

### Examples
```bash
# Fix a rusher's yards and carries
node scripts/edit-stats.mjs ABC123 silentfloat rushing yards=55 carries=3 tds=1

# Fix a passer's full line
node scripts/edit-stats.mjs ABC123 shiloTALKER passing completions=14 attempts=22 yards=210 tds=2 ints=0

# Fix by userId instead of name
node scripts/edit-stats.mjs ABC123 3291847 defense tackles=6 interceptions=1

# Only update one key — others stay unchanged
node scripts/edit-stats.mjs ABC123 silentfloat rushing tds=1
```

---

## Notes
- You only need to include the keys you're changing. Everything else stays the same.
- Player names are case-insensitive (`silentfloat` = `SilentFloat`).
- All changes write to the **dev** database. For production, use the deployed API or Republish after changes.
- After editing stats, re-export the match from Discord to push the corrected data to the website.
