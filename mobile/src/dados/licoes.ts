import type { ConteudoLicao } from "@/src/model/ConteudoLicao";

export const LICOES_CONTEUDO: Record<string, ConteudoLicao> = {
	"1": {
		id: "1",
		titulo: "Fundamentos",
		descricao: "Aprenda como cada peça do xadrez se move.",
		passos: [
			{
				instrucao:
					"O peão avança para frente! No primeiro movimento pode andar 1 ou 2 casas. Mova o peão de e2 para e4.",
				dica: "Clique no peão em e2 e arraste até e4.",
				fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				movimentoEsperado: { from: "e2", to: "e4" },
				destaques: [
					{ square: "e2", color: "rgba(74,222,128,0.6)" },
					{ square: "e3", color: "rgba(250,204,21,0.4)" },
					{ square: "e4", color: "rgba(250,204,21,0.4)" },
				],
			},
			{
				instrucao:
					"Os cavalos saltam em 'L': 2 casas em uma direção e 1 casa perpendicular. São as únicas peças que pulam sobre outras! Mova o cavalo de g1 para f3.",
				dica: "O cavalo em g1 pode pular para f3.",
				fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
				movimentoEsperado: { from: "g1", to: "f3" },
				destaques: [
					{ square: "g1", color: "rgba(74,222,128,0.6)" },
					{ square: "f3", color: "rgba(250,204,21,0.4)" },
					{ square: "h3", color: "rgba(250,204,21,0.4)" },
				],
			},
			{
				instrucao:
					"Os bispos se movem na diagonal, quantas casas quiserem! Mova o bispo de f1 para c4.",
				dica: "O bispo em f1 se move na diagonal até c4.",
				fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
				movimentoEsperado: { from: "f1", to: "c4" },
				destaques: [
					{ square: "f1", color: "rgba(74,222,128,0.6)" },
					{ square: "e2", color: "rgba(250,204,21,0.3)" },
					{ square: "d3", color: "rgba(250,204,21,0.3)" },
					{ square: "c4", color: "rgba(250,204,21,0.4)" },
				],
			},
			{
				instrucao:
					"As torres se movem em linhas retas: horizontalmente ou verticalmente, quantas casas quiserem. Mova a torre de a1 para e1.",
				dica: "A torre em a1 se move pela linha 1 até e1.",
				fen: "4k3/8/8/8/8/8/8/R6K w - - 0 1",
				movimentoEsperado: { from: "a1", to: "e1" },
				destaques: [
					{ square: "a1", color: "rgba(74,222,128,0.6)" },
					{ square: "b1", color: "rgba(250,204,21,0.3)" },
					{ square: "c1", color: "rgba(250,204,21,0.3)" },
					{ square: "d1", color: "rgba(250,204,21,0.3)" },
					{ square: "e1", color: "rgba(250,204,21,0.4)" },
				],
			},
			{
				instrucao:
					"A dama é a peça mais poderosa! Ela combina os movimentos da torre e do bispo — move em qualquer direção. Mova a dama de d1 para h5.",
				dica: "A dama em d1 pode se mover na diagonal até h5.",
				fen: "4k3/8/8/8/8/8/8/3QK3 w - - 0 1",
				movimentoEsperado: { from: "d1", to: "h5" },
				destaques: [
					{ square: "d1", color: "rgba(74,222,128,0.6)" },
					{ square: "e2", color: "rgba(250,204,21,0.3)" },
					{ square: "f3", color: "rgba(250,204,21,0.3)" },
					{ square: "g4", color: "rgba(250,204,21,0.3)" },
					{ square: "h5", color: "rgba(250,204,21,0.4)" },
				],
			},
			{
				instrucao:
					"O rei move apenas 1 casa em qualquer direção. Proteger o rei é o objetivo do xadrez — se o rei for capturado, o jogo acaba! Mova o rei de e1 para e2.",
				dica: "O rei em e1 pode mover para e2.",
				fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
				movimentoEsperado: { from: "e1", to: "e2" },
				destaques: [
					{ square: "e1", color: "rgba(74,222,128,0.6)" },
					{ square: "d1", color: "rgba(250,204,21,0.3)" },
					{ square: "d2", color: "rgba(250,204,21,0.3)" },
					{ square: "e2", color: "rgba(250,204,21,0.4)" },
					{ square: "f2", color: "rgba(250,204,21,0.3)" },
					{ square: "f1", color: "rgba(250,204,21,0.3)" },
				],
			},
		],
	},
	"2": {
		id: "2",
		titulo: "Abertura",
		descricao:
			"Aprenda os 5 primeiros lances de uma abertura simples e os fundamentos de desenvolvimento.",
		passos: [
			{
				instrucao:
					"1. e4: comece ocupando o centro e abrindo linhas para a dama e o bispo. Mova o peao de e2 para e4.",
				dica: "Controle o centro cedo aumenta suas opcoes no meio-jogo.",
				fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
				movimentoEsperado: { from: "e2", to: "e4" },
				destaques: [
					{ square: "e2", color: "rgba(74,222,128,0.6)" },
					{ square: "e4", color: "rgba(250,204,21,0.4)" },
				],
				respostaComputador: { from: "e7", to: "e5" },
			},
			{
				instrucao:
					"2. Nf3: desenvolva o cavalo, ataque o peao de e5 e prepare o roque. Mova o cavalo de g1 para f3.",
				dica: "Desenvolva pecas leves antes de sair com a dama cedo.",
				fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
				movimentoEsperado: { from: "g1", to: "f3" },
				destaques: [
					{ square: "g1", color: "rgba(74,222,128,0.6)" },
					{ square: "f3", color: "rgba(250,204,21,0.4)" },
				],
				respostaComputador: { from: "b8", to: "c6" },
			},
			{
				instrucao:
					"3. Bc4: coloque o bispo em uma diagonal ativa mirando f7, um ponto sensivel das pretas.",
				dica: "O bispo em c4 trabalha junto da dama para criar ameacas taticas.",
				fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
				movimentoEsperado: { from: "f1", to: "c4" },
				destaques: [
					{ square: "f1", color: "rgba(74,222,128,0.6)" },
					{ square: "c4", color: "rgba(250,204,21,0.4)" },
				],
				respostaComputador: { from: "g8", to: "f6" },
			},
			{
				instrucao:
					"4. d3: proteja o centro e abra a diagonal do bispo de c1 com seguranca.",
				dica: "Uma base solida no centro ajuda seu desenvolvimento sem enfraquecer o rei.",
				fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
				movimentoEsperado: { from: "d2", to: "d3" },
				destaques: [
					{ square: "d2", color: "rgba(74,222,128,0.6)" },
					{ square: "d3", color: "rgba(250,204,21,0.4)" },
				],
				respostaComputador: { from: "f8", to: "c5" },
			},
			{
				instrucao:
					"5. c3: fortaleça o centro e prepare d4 no proximo lance. Mova o peao de c2 para c3.",
				dica: "O plano de abertura deve combinar desenvolvimento, seguranca do rei e controle central.",
				fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 6 5",
				movimentoEsperado: { from: "c2", to: "c3" },
				destaques: [
					{ square: "c2", color: "rgba(74,222,128,0.6)" },
					{ square: "c3", color: "rgba(250,204,21,0.4)" },
					{ square: "d4", color: "rgba(250,204,21,0.3)" },
				],
			},
		],
	},
	"3": {
		id: "3",
		titulo: "Tática de Garfo",
		descricao:
			"Um garfo é quando uma peça ataca duas peças inimigas ao mesmo tempo, forçando o adversário a perder material.",
		passos: [
			{
				instrucao:
					"O Garfo do Cavalo! Um garfo ocorre quando uma peça ataca duas peças inimigas simultaneamente. O cavalo branco em d5 pode atacar o rei em e8 E a torre em a8 ao mesmo tempo. Encontre o garfo!",
				dica: "Mova o cavalo de d5 para c7 — ele atacará o rei e a torre de uma vez.",
				fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
				movimentoEsperado: { from: "d5", to: "c7" },
				destaques: [
					{ square: "d5", color: "rgba(74,222,128,0.6)" },
					{ square: "e8", color: "rgba(239,68,68,0.5)" },
					{ square: "a8", color: "rgba(239,68,68,0.5)" },
				],
				respostaComputador: { from: "e8", to: "d8" },
			},
			{
				instrucao:
					"Excelente! Agora encontre outro garfo de cavalo. O cavalo branco em f5 pode atacar simultaneamente o rei em g8 e a torre em c8. Qual é o movimento?",
				dica: "Mova o cavalo de f5 para e7 — ele atacará ambas as peças pretas.",
				fen: "2r3k1/8/8/5N2/8/8/8/5K2 w - - 0 1",
				movimentoEsperado: { from: "f5", to: "e7" },
				destaques: [
					{ square: "f5", color: "rgba(74,222,128,0.6)" },
					{ square: "g8", color: "rgba(239,68,68,0.5)" },
					{ square: "c8", color: "rgba(239,68,68,0.5)" },
				],
				respostaComputador: { from: "g8", to: "f8" },
			},
			{
				instrucao:
					"Último desafio! O cavalo branco em h5 pode realizar um garfo devastador. Encontre a casa certa para dar xeque ao rei em g8 E atacar a torre em e4 ao mesmo tempo!",
				dica: "Mova o cavalo de h5 para f6 — ele dará xeque ao rei e ameaçará a torre de uma vez.",
				fen: "6k1/8/8/7N/4r3/8/8/K7 w - - 0 1",
				movimentoEsperado: { from: "h5", to: "f6" },
				destaques: [
					{ square: "h5", color: "rgba(74,222,128,0.6)" },
					{ square: "g8", color: "rgba(239,68,68,0.5)" },
					{ square: "e4", color: "rgba(239,68,68,0.5)" },
				],
			},
		],
	},
	"4": {
		id: "4",
		titulo: "Finais Básicos",
		descricao: "Aprenda a dar xeque-mate com rei e torre contra rei.",
		passos: [
			{
				instrucao:
					"Rei e Torre contra Rei! Para dar xeque-mate, você precisa empurrar o rei inimigo para a borda do tabuleiro. Comece movendo a torre para a8 para restringir o rei inimigo.",
				dica: "Mova a torre de a1 para a7 para empurrar o rei para a última fileira.",
				fen: "4k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
				movimentoEsperado: { from: "a1", to: "a7" },
				destaques: [
					{ square: "a1", color: "rgba(74,222,128,0.6)" },
					{ square: "a7", color: "rgba(250,204,21,0.4)" },
				],
				respostaComputador: { from: "e8", to: "d8" },
			},
			{
				instrucao:
					"Ótimo! O rei foi empurrado. Agora mova o seu rei para o centro para ajudar a dar xeque-mate.",
				dica: "Mova o rei de e1 para e2 para aproximá-lo.",
				fen: "3k4/R7/8/8/8/8/8/4K3 w - - 2 2",
				movimentoEsperado: { from: "e1", to: "e2" },
				destaques: [
					{ square: "e1", color: "rgba(74,222,128,0.6)" },
					{ square: "e2", color: "rgba(250,204,21,0.4)" },
				],
				respostaComputador: { from: "d8", to: "c8" },
			},
		],
	},
};
