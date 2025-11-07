export const LEAGUES = [
  "bronze",
  "silver",
  "gold",
  "sapphire",
  "ruby",
  "emerald",
  "amethyst",
  "pearl",
  "obsidian",
  "diamond",
];

export const LEAGUE_CONFIG = {
  bronze:   { up: 10, down: 0 },
  silver:   { up: 10, down: 5 },
  gold:     { up: 10, down: 5 },
  sapphire: { up: 10, down: 5 },
  ruby:     { up: 10, down: 5 },
  emerald:  { up: 10, down: 5 },
  amethyst: { up: 10, down: 5 },
  pearl:    { up: 10, down: 5 },
  obsidian: { up: 10, down: 5 },
  diamond:  { up: 0,  down: 10 }, // 最上位のみ降格あり
};

export const LEAGUE_MEMBER_LIMIT = 30;
