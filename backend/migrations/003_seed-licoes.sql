INSERT INTO licoes (id, titulo, descricao, icone, ordem) VALUES
  ('1', 'Fundamentos',            'Aprenda como cada peça do xadrez se move.',                                                                          'medal',        1),
  ('2', 'Abertura',               'Aprenda os 5 primeiros lances de uma abertura simples e os fundamentos de desenvolvimento.',                          'chess-pawn',   2),
  ('3', 'Tática de Garfo',        'Um garfo é quando uma peça ataca duas peças inimigas ao mesmo tempo, forçando o adversário a perder material.',       'head-cog',     3),
  ('4', 'Finais Básicos',         'Aprenda a dar xeque-mate com rei e torre contra rei.',                                                                'chess-king',   4),
  ('5', 'Desafio do Mestre',      '',                                                                                                                    'gift',         5),
  ('6', 'Xeque-mate em 1',        '',                                                                                                                    'chess-queen',  6),
  ('7', 'Xeque-mate em 2',        '',                                                                                                                    'chess-queen',  7),
  ('8', 'Defesa contra o pastor', '',                                                                                                                    'chess-bishop', 8)
ON CONFLICT (id) DO NOTHING;

-- Lição 1: Fundamentos (6 passos)
INSERT INTO passos_licao (licao_id, ordem, instrucao, dica, fen, movimento_from, movimento_to, resposta_from, resposta_to) VALUES
  ('1', 1,
   'O peão avança para frente! No primeiro movimento pode andar 1 ou 2 casas. Mova o peão de e2 para e4.',
   'Clique no peão em e2 e arraste até e4.',
   'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
   'e2', 'e4', NULL, NULL),
  ('1', 2,
   'Os cavalos saltam em ''L'': 2 casas em uma direção e 1 casa perpendicular. São as únicas peças que pulam sobre outras! Mova o cavalo de g1 para f3.',
   'O cavalo em g1 pode pular para f3.',
   'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
   'g1', 'f3', NULL, NULL),
  ('1', 3,
   'Os bispos se movem na diagonal, quantas casas quiserem! Mova o bispo de f1 para c4.',
   'O bispo em f1 se move na diagonal até c4.',
   'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
   'f1', 'c4', NULL, NULL),
  ('1', 4,
   'As torres se movem em linhas retas: horizontalmente ou verticalmente, quantas casas quiserem. Mova a torre de a1 para e1.',
   'A torre em a1 se move pela linha 1 até e1.',
   '4k3/8/8/8/8/8/8/R6K w - - 0 1',
   'a1', 'e1', NULL, NULL),
  ('1', 5,
   'A dama é a peça mais poderosa! Ela combina os movimentos da torre e do bispo — move em qualquer direção. Mova a dama de d1 para h5.',
   'A dama em d1 pode se mover na diagonal até h5.',
   '4k3/8/8/8/8/8/8/3QK3 w - - 0 1',
   'd1', 'h5', NULL, NULL),
  ('1', 6,
   'O rei move apenas 1 casa em qualquer direção. Proteger o rei é o objetivo do xadrez — se o rei for capturado, o jogo acaba! Mova o rei de e1 para e2.',
   'O rei em e1 pode mover para e2.',
   '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
   'e1', 'e2', NULL, NULL)
ON CONFLICT (licao_id, ordem) DO NOTHING;

-- Lição 2: Abertura (5 passos)
INSERT INTO passos_licao (licao_id, ordem, instrucao, dica, fen, movimento_from, movimento_to, resposta_from, resposta_to) VALUES
  ('2', 1,
   '1. e4: comece ocupando o centro e abrindo linhas para a dama e o bispo. Mova o peao de e2 para e4.',
   'Controle o centro cedo aumenta suas opcoes no meio-jogo.',
   'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
   'e2', 'e4', 'e7', 'e5'),
  ('2', 2,
   '2. Nf3: desenvolva o cavalo, ataque o peao de e5 e prepare o roque. Mova o cavalo de g1 para f3.',
   'Desenvolva pecas leves antes de sair com a dama cedo.',
   'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
   'g1', 'f3', 'b8', 'c6'),
  ('2', 3,
   '3. Bc4: coloque o bispo em uma diagonal ativa mirando f7, um ponto sensivel das pretas.',
   'O bispo em c4 trabalha junto da dama para criar ameacas taticas.',
   'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
   'f1', 'c4', 'g8', 'f6'),
  ('2', 4,
   '4. d3: proteja o centro e abra a diagonal do bispo de c1 com seguranca.',
   'Uma base solida no centro ajuda seu desenvolvimento sem enfraquecer o rei.',
   'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
   'd2', 'd3', 'f8', 'c5'),
  ('2', 5,
   '5. c3: fortaleça o centro e prepare d4 no proximo lance. Mova o peao de c2 para c3.',
   'O plano de abertura deve combinar desenvolvimento, seguranca do rei e controle central.',
   'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 6 5',
   'c2', 'c3', NULL, NULL)
ON CONFLICT (licao_id, ordem) DO NOTHING;

-- Lição 3: Tática de Garfo (3 passos)
INSERT INTO passos_licao (licao_id, ordem, instrucao, dica, fen, movimento_from, movimento_to, resposta_from, resposta_to) VALUES
  ('3', 1,
   'O Garfo do Cavalo! Um garfo ocorre quando uma peça ataca duas peças inimigas simultaneamente. O cavalo branco em d5 pode atacar o rei em e8 E a torre em a8 ao mesmo tempo. Encontre o garfo!',
   'Mova o cavalo de d5 para c7 — ele atacará o rei e a torre de uma vez.',
   'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1',
   'd5', 'c7', 'e8', 'd8'),
  ('3', 2,
   'Excelente! Agora encontre outro garfo de cavalo. O cavalo branco em f5 pode atacar simultaneamente o rei em g8 e a torre em c8. Qual é o movimento?',
   'Mova o cavalo de f5 para e7 — ele atacará ambas as peças pretas.',
   '2r3k1/8/8/5N2/8/8/8/5K2 w - - 0 1',
   'f5', 'e7', 'g8', 'f8'),
  ('3', 3,
   'Último desafio! O cavalo branco em h5 pode realizar um garfo devastador. Encontre a casa certa para dar xeque ao rei em g8 E atacar a torre em e4 ao mesmo tempo!',
   'Mova o cavalo de h5 para f6 — ele dará xeque ao rei e ameaçará a torre de uma vez.',
   '6k1/8/8/7N/4r3/8/8/K7 w - - 0 1',
   'h5', 'f6', NULL, NULL)
ON CONFLICT (licao_id, ordem) DO NOTHING;

-- Lição 4: Finais Básicos (2 passos)
INSERT INTO passos_licao (licao_id, ordem, instrucao, dica, fen, movimento_from, movimento_to, resposta_from, resposta_to) VALUES
  ('4', 1,
   'Rei e Torre contra Rei! Para dar xeque-mate, você precisa empurrar o rei inimigo para a borda do tabuleiro. Comece movendo a torre para a8 para restringir o rei inimigo.',
   'Mova a torre de a1 para a7 para empurrar o rei para a última fileira.',
   '4k3/8/8/8/8/8/8/R3K3 w Q - 0 1',
   'a1', 'a7', 'e8', 'd8'),
  ('4', 2,
   'Ótimo! O rei foi empurrado. Agora mova o seu rei para o centro para ajudar a dar xeque-mate.',
   'Mova o rei de e1 para e2 para aproximá-lo.',
   '3k4/R7/8/8/8/8/8/4K3 w - - 2 2',
   'e1', 'e2', 'd8', 'c8')
ON CONFLICT (licao_id, ordem) DO NOTHING;

-- Destaques: Lição 1
INSERT INTO destaques_passo (passo_id, square, color)
SELECT p.id, v.square, v.color FROM passos_licao p
JOIN (VALUES
  ('1'::TEXT, 1, 'e2', 'rgba(74,222,128,0.6)'),
  ('1', 1, 'e3', 'rgba(250,204,21,0.4)'),
  ('1', 1, 'e4', 'rgba(250,204,21,0.4)'),
  ('1', 2, 'g1', 'rgba(74,222,128,0.6)'),
  ('1', 2, 'f3', 'rgba(250,204,21,0.4)'),
  ('1', 2, 'h3', 'rgba(250,204,21,0.4)'),
  ('1', 3, 'f1', 'rgba(74,222,128,0.6)'),
  ('1', 3, 'e2', 'rgba(250,204,21,0.3)'),
  ('1', 3, 'd3', 'rgba(250,204,21,0.3)'),
  ('1', 3, 'c4', 'rgba(250,204,21,0.4)'),
  ('1', 4, 'a1', 'rgba(74,222,128,0.6)'),
  ('1', 4, 'b1', 'rgba(250,204,21,0.3)'),
  ('1', 4, 'c1', 'rgba(250,204,21,0.3)'),
  ('1', 4, 'd1', 'rgba(250,204,21,0.3)'),
  ('1', 4, 'e1', 'rgba(250,204,21,0.4)'),
  ('1', 5, 'd1', 'rgba(74,222,128,0.6)'),
  ('1', 5, 'e2', 'rgba(250,204,21,0.3)'),
  ('1', 5, 'f3', 'rgba(250,204,21,0.3)'),
  ('1', 5, 'g4', 'rgba(250,204,21,0.3)'),
  ('1', 5, 'h5', 'rgba(250,204,21,0.4)'),
  ('1', 6, 'e1', 'rgba(74,222,128,0.6)'),
  ('1', 6, 'd1', 'rgba(250,204,21,0.3)'),
  ('1', 6, 'd2', 'rgba(250,204,21,0.3)'),
  ('1', 6, 'e2', 'rgba(250,204,21,0.4)'),
  ('1', 6, 'f2', 'rgba(250,204,21,0.3)'),
  ('1', 6, 'f1', 'rgba(250,204,21,0.3)')
) AS v(licao_id, ordem, square, color) ON p.licao_id = v.licao_id AND p.ordem = v.ordem;

-- Destaques: Lição 2
INSERT INTO destaques_passo (passo_id, square, color)
SELECT p.id, v.square, v.color FROM passos_licao p
JOIN (VALUES
  ('2'::TEXT, 1, 'e2', 'rgba(74,222,128,0.6)'),
  ('2', 1, 'e4', 'rgba(250,204,21,0.4)'),
  ('2', 2, 'g1', 'rgba(74,222,128,0.6)'),
  ('2', 2, 'f3', 'rgba(250,204,21,0.4)'),
  ('2', 3, 'f1', 'rgba(74,222,128,0.6)'),
  ('2', 3, 'c4', 'rgba(250,204,21,0.4)'),
  ('2', 4, 'd2', 'rgba(74,222,128,0.6)'),
  ('2', 4, 'd3', 'rgba(250,204,21,0.4)'),
  ('2', 5, 'c2', 'rgba(74,222,128,0.6)'),
  ('2', 5, 'c3', 'rgba(250,204,21,0.4)'),
  ('2', 5, 'd4', 'rgba(250,204,21,0.3)')
) AS v(licao_id, ordem, square, color) ON p.licao_id = v.licao_id AND p.ordem = v.ordem;

-- Destaques: Lição 3
INSERT INTO destaques_passo (passo_id, square, color)
SELECT p.id, v.square, v.color FROM passos_licao p
JOIN (VALUES
  ('3'::TEXT, 1, 'd5', 'rgba(74,222,128,0.6)'),
  ('3', 1, 'e8', 'rgba(239,68,68,0.5)'),
  ('3', 1, 'a8', 'rgba(239,68,68,0.5)'),
  ('3', 2, 'f5', 'rgba(74,222,128,0.6)'),
  ('3', 2, 'g8', 'rgba(239,68,68,0.5)'),
  ('3', 2, 'c8', 'rgba(239,68,68,0.5)'),
  ('3', 3, 'h5', 'rgba(74,222,128,0.6)'),
  ('3', 3, 'g8', 'rgba(239,68,68,0.5)'),
  ('3', 3, 'e4', 'rgba(239,68,68,0.5)')
) AS v(licao_id, ordem, square, color) ON p.licao_id = v.licao_id AND p.ordem = v.ordem;

-- Destaques: Lição 4
INSERT INTO destaques_passo (passo_id, square, color)
SELECT p.id, v.square, v.color FROM passos_licao p
JOIN (VALUES
  ('4'::TEXT, 1, 'a1', 'rgba(74,222,128,0.6)'),
  ('4', 1, 'a7', 'rgba(250,204,21,0.4)'),
  ('4', 2, 'e1', 'rgba(74,222,128,0.6)'),
  ('4', 2, 'e2', 'rgba(250,204,21,0.4)')
) AS v(licao_id, ordem, square, color) ON p.licao_id = v.licao_id AND p.ordem = v.ordem;
