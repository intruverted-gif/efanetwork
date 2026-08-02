import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearch, Link } from 'wouter';
import { TEAMS } from '../data/schedule';
import { supabase } from '../lib/supabase';

type Category = 'passing' | 'rushing' | 'receiving' | 'defense';
type Season = 'all' | '1' | '2' | '3';

interface PlayerRow {
  user_id: number;
  display_name: string;
  headshot_url: string | null;
  team_name: string | null;
  completions?: number; attempts?: number; ints?: number; sacked?: number;
  carries?: number;
  yards?: number; tds?: number; receptions?: number;
  tackles?: number; interceptions?: number; sacks?: number;
}

function fuzzyTeam(name: string | null) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const t of Object.values(TEAMS)) {
    if (lower.includes(t.city.toLowerCase()) || lower.includes(t.nickname.toLowerCase())) {
      return t;
    }
  }
  return null;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%23d1d5db' font-size='18' font-family='sans-serif'%3E%3F%3C/text%3E%3C/svg%3E";

function normalizePlayerName(value: unknown): string {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getPlayerAggregateKey(userId: unknown, displayName: unknown) {
  const parsedId = Number(userId);
  const normalizedName = normalizePlayerName(displayName);

  if (Number.isFinite(parsedId) && parsedId > 0) {
    return `user:${parsedId}`;
  }

  if (normalizedName) {
    return `name:${normalizedName}`;
  }

  return 'unknown';
}

const COLUMNS: Record<Category, { key: string; label: string; title?: string }[]> = {
  passing: [
    { key: 'completions', label: 'CMP' },
    { key: 'attempts', label: 'ATT' },
    { key: 'yards', label: 'YDS' },
    { key: 'tds', label: 'TD' },
    { key: 'ints', label: 'INT' },
    { key: 'sacked', label: 'SCK', title: 'Times sacked' },
  ],
  rushing: [
    { key: 'carries', label: 'CAR' },
    { key: 'yards', label: 'YDS' },
    { key: 'tds', label: 'TD' },
  ],
  receiving: [
    { key: 'receptions', label: 'REC' },
    { key: 'yards', label: 'YDS' },
    { key: 'tds', label: 'TD' },
  ],
  defense: [
    { key: 'tackles', label: 'TKL' },
    { key: 'interceptions', label: 'INT' },
    { key: 'sacks', label: 'SCK' },
  ],
};

const DEFAULT_SORT: Record<Category, string> = {
  passing: 'yards',
  rushing: 'yards',
  receiving: 'yards',
  defense: 'tackles',
};

const VALID_CATEGORIES: Category[] = ['passing', 'rushing', 'receiving', 'defense'];

export default function Stats() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const paramCat = params.get('category') as Category | null;
  const initialCat: Category = paramCat && VALID_CATEGORIES.includes(paramCat) ? paramCat : 'passing';

  const [category, setCategory] = useState<Category>(initialCat);
  const [season, setSeason] = useState<Season>('3');
  const [sortKey, setSortKey] = useState<string>(DEFAULT_SORT[initialCat]);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const cat = paramCat && VALID_CATEGORIES.includes(paramCat) ? paramCat : 'passing';
    setCategory(cat);
    setSortKey(DEFAULT_SORT[cat]);
    setSortDesc(true);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['stats', category, season],
    queryFn: async () => {
      let query = supabase
        .from('player_stats')
        .select('*')
        .eq('category', category);

      if (season !== 'all') {
        const seasonMatches = [season, String(season), `SEASON ${season}`.toUpperCase()];
        query = query.or(
          `season.eq.${season},season.eq.${String(season)},season.ilike.%${String(season).toLowerCase()}%`
        );
      }

      const { data: rows, error } = await query;

      if (error) throw error;

      const groupedRows = new Map<string, PlayerRow>();
      for (const row of (rows || []) as PlayerRow[]) {
        const key = getPlayerAggregateKey(row.user_id, row.display_name);
        const existing = groupedRows.get(key);

        if (!existing) {
          groupedRows.set(key, { ...row });
          continue;
        }

        existing.completions = (existing.completions || 0) + (row.completions || 0);
        existing.attempts = (existing.attempts || 0) + (row.attempts || 0);
        existing.ints = (existing.ints || 0) + (row.ints || 0);
        existing.sacked = (existing.sacked || 0) + (row.sacked || 0);
        existing.carries = (existing.carries || 0) + (row.carries || 0);
        existing.yards = (existing.yards || 0) + (row.yards || 0);
        existing.tds = (existing.tds || 0) + (row.tds || 0);
        existing.receptions = (existing.receptions || 0) + (row.receptions || 0);
        existing.tackles = (existing.tackles || 0) + (row.tackles || 0);
        existing.interceptions = (existing.interceptions || 0) + (row.interceptions || 0);
        existing.sacks = (existing.sacks || 0) + (row.sacks || 0);
        existing.display_name = row.display_name || existing.display_name;
        existing.headshot_url = row.headshot_url || existing.headshot_url;
        existing.team_name = row.team_name || existing.team_name;
      }

      return { players: Array.from(groupedRows.values()) };
    },
  });

  const players = useMemo(() => {
    const rows = data?.players ?? [];
    return [...rows].sort((a, b) => {
      const av = (a as any)[sortKey] ?? 0;
      const bv = (b as any)[sortKey] ?? 0;
      return sortDesc ? bv - av : av - bv;
    });
  }, [data, sortKey, sortDesc]);

  const columns = COLUMNS[category];

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
    setSortKey(DEFAULT_SORT[cat]);
    setSortDesc(true);
  }

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  const CATEGORIES: { key: Category; label: string }[] = [
    { key: 'passing', label: 'Passing' },
    { key: 'rushing', label: 'Rushing' },
    { key: 'receiving', label: 'Receiving' },
    { key: 'defense', label: 'Defense' },
  ];

  const SEASONS: { key: Season; label: string; corrupted?: boolean }[] = [
    { key: 'all', label: 'All-time' },
    { key: '1', label: 'SEASON 1', corrupted: true },
    { key: '2', label: 'SEASON 2', corrupted: true },
    { key: '3', label: 'SEASON 3' },
  ];

  const isCorrupted = season === '1' || season === '2';

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1 className="stats-title">Player Stats</h1>

        <div className="stats-cat-tabs">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              className={`stats-cat-tab${category === key ? ' stats-cat-tab--active' : ''}`}
              onClick={() => handleCategoryChange(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="stats-season-row">
          {SEASONS.map(({ key, label, corrupted }) => (
            <button
              key={key}
              className={`stats-season-btn${season === key ? ' stats-season-btn--active' : ''}${corrupted ? ' stats-season-btn--corrupted' : ''}`}
              onClick={() => setSeason(key)}
            >
              {label}
              {corrupted && <span className="stats-season-corrupt-tag">CORRUPTED</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-card">
        {isCorrupted && (
          <div className="stats-corrupted">
            <div className="stats-corrupted-icon">⚠</div>
            <div className="stats-corrupted-title">DATA CORRUPTED</div>
            <div className="stats-corrupted-sub">
              SEASON {season} records were lost. Stats from this era are unrecoverable.
            </div>
          </div>
        )}
        {!isCorrupted && isLoading && (
          <div className="stats-empty">Loading stats…</div>
        )}
        {!isCorrupted && isError && (
          <div className="stats-empty stats-empty--error">Failed to load stats from Supabase.</div>
        )}
        {!isCorrupted && !isLoading && !isError && players.length === 0 && (
          <div className="stats-empty">No {category} stats yet. Import matches via the Discord bot.</div>
        )}
        {!isCorrupted && !isLoading && !isError && players.length > 0 && (
          <div className="stats-table-wrap">
            <table className="stats-table">
              <thead>
                <tr>
                  <th className="stats-th stats-th--rank">#</th>
                  <th className="stats-th stats-th--player">Player</th>
                  <th className="stats-th">Team</th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`stats-th stats-th--num${sortKey === col.key ? ' stats-th--sorted' : ''}`}
                      onClick={() => handleSort(col.key)}
                      title={`Sort by ${col.label}`}
                    >
                      {col.label}
                      <span className="stats-sort-icon">
                        {sortKey === col.key ? (sortDesc ? ' ▼' : ' ▲') : ' ⇅'}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((player, i) => {
                  const team = fuzzyTeam(player.team_name);
                  return (
                    <tr key={`${player.user_id}-${player.display_name}`} className="stats-row">
                      <td className="stats-td stats-td--rank">
                        <span className={`stats-rank-badge${i < 3 ? ' stats-rank-badge--top' : ''}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="stats-td stats-td--player">
                        <Link href={`/players/${player.user_id}`} className="stats-player-link">
                          <div className="stats-player-inner">
                            <img
                              className="stats-avatar"
                              src={player.headshot_url || PLACEHOLDER}
                              alt={player.display_name}
                              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                            />
                            <span className="stats-player-name">{player.display_name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="stats-td stats-td--team">
                        {team ? (
                          <div className="stats-team-cell">
                            <img className="stats-team-logo" src={team.logo} alt={team.nickname} />
                            <span className="stats-team-name">{team.nickname}</span>
                          </div>
                        ) : (
                          <span className="stats-team-unknown">{player.team_name ?? '—'}</span>
                        )}
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`stats-td stats-td--num${sortKey === col.key ? ' stats-td--sorted' : ''}`}
                        >
                          {(player as any)[col.key] ?? 0}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}