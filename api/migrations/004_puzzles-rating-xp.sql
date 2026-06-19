ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rating REAL NOT NULL DEFAULT 1500;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rd REAL NOT NULL DEFAULT 350;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS volatilidade REAL NOT NULL DEFAULT 0.06;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rating_atualizado_em TIMESTAMPTZ;

ALTER TABLE licoes ADD COLUMN IF NOT EXISTS xp_recompensa INTEGER NOT NULL DEFAULT 50;

CREATE TABLE IF NOT EXISTS puzzles (
  id VARCHAR(16) PRIMARY KEY,
  fen TEXT NOT NULL,
  lances_solucao TEXT[] NOT NULL,
  rating INTEGER NOT NULL,
  popularidade INTEGER NOT NULL DEFAULT 0,
  temas TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_puzzles_rating ON puzzles(rating);

CREATE TABLE IF NOT EXISTS puzzle_tentativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  puzzle_id VARCHAR(16) NOT NULL REFERENCES puzzles(id),
  resolveu_primeira BOOLEAN NOT NULL,
  tentativas INTEGER NOT NULL DEFAULT 1,
  delta_rating REAL NOT NULL,
  rating_apos REAL NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, puzzle_id)
);

CREATE INDEX IF NOT EXISTS idx_tentativas_usuario ON puzzle_tentativas(usuario_id, criado_em DESC);
