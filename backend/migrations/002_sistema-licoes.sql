CREATE TABLE IF NOT EXISTS licoes (
  id TEXT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  icone VARCHAR(100) NOT NULL,
  ordem INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS passos_licao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  licao_id TEXT NOT NULL REFERENCES licoes(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  instrucao TEXT NOT NULL,
  dica TEXT,
  fen TEXT NOT NULL,
  movimento_from VARCHAR(2) NOT NULL,
  movimento_to VARCHAR(2) NOT NULL,
  resposta_from VARCHAR(2),
  resposta_to VARCHAR(2),
  UNIQUE(licao_id, ordem)
);

CREATE TABLE IF NOT EXISTS destaques_passo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passo_id UUID NOT NULL REFERENCES passos_licao(id) ON DELETE CASCADE,
  square VARCHAR(2) NOT NULL,
  color VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS progresso_licoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  licao_id TEXT NOT NULL REFERENCES licoes(id) ON DELETE CASCADE,
  concluida_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, licao_id)
);

CREATE INDEX IF NOT EXISTS idx_passos_licao ON passos_licao(licao_id);
CREATE INDEX IF NOT EXISTS idx_progresso_usuario ON progresso_licoes(usuario_id);
