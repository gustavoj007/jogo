# Caça-palavras de Arquitetura Computacional

Jogo de caça-palavras com tema de corrida de endurance (WEC), feito em HTML, CSS e JavaScript puros, para treinar os termos de Tópicos de Arquitetura Computacional (Sprint 3).

**Jogue aqui:** [https://gustavoj007.github.io/jogo/](https://gustavoj007.github.io/jogo/)

## Como jogar

1. Leia a lista **Termos procurados**: cada termo tem uma pista e o número de letras. Nas duas primeiras fases, também a letra inicial.
2. Encontre a palavra no tabuleiro e **arraste do primeiro ao último caractere**, em linha reta (na horizontal, na vertical ou na diagonal). No celular, você também pode tocar na primeira letra e depois na última.
3. Travou? Clique num termo da lista e use o botão **Dica**. Cada termo aceita até 2 dicas: a 1ª marca a casa onde ele começa (e, nas duas primeiras fases, diz para qual lado segue); a 2ª marca também a última letra e diz a direção. Dica sem efeito, como clicar num termo que já usou as 2, não conta no contador.
4. Cada termo achado ganha uma cor de classe e uma posição (P1, P2...) pela ordem de chegada. O contador mostra "X de 5 palavras".
5. Ao achar os 5 termos, avance para a próxima fase. Ao terminar as 3 fases, aparece a bandeira quadriculada com o tempo total.
6. **Reiniciar** volta à fase 1, zera tempo e dicas e sorteia tudo de novo.

No teclado: setas movem o cursor, Enter marca a primeira e a última letra, Esc cancela.

## Sorteio das palavras

O código guarda um banco com os 16 termos da lista. A cada partida, o jogo sorteia 15 deles e os divide em 3 fases de 5 palavras. Nenhum termo se repete entre as fases. Em cada fase, a posição e a direção das palavras também são sorteadas.

| Fase | Nome | Direções das palavras | Ajudas |
|---|---|---|---|
| 1 | Qualificação | → ↓ ↘ | pista, nº de letras, letra inicial e direção na 1ª dica |
| 2 | Corrida | → ↓ ↘ ↗ ← (algumas de trás para frente) | pista, nº de letras, letra inicial e direção na 1ª dica |
| 3 | 24 Horas | todas as 8 direções | pista e nº de letras; a 1ª dica só mostra onde começa |

O tabuleiro cresce nas fases seguintes (12x12, 14x14 e 16x16) e nunca é menor que a maior palavra sorteada para a fase.

## Banco de palavras e pistas

| Termo | Pista |
|---|---|
| CPU | Componente que busca, decodifica e executa as instruções dos programas. |
| ULA | Parte da CPU que faz as contas e as operações lógicas. |
| UC (Unidade de Controle) | Parte do processador que coordena e comanda o trabalho dos demais componentes. |
| registradores | Minúsculos espaços dentro da CPU, os mais velozes, que guardam o dado em uso. |
| RAM | Memória principal e volátil, onde ficam programas e dados em uso. |
| ROM | Memória não volátil gravada na fabricação, cujo conteúdo o usuário não altera. |
| EEPROM | Memória não volátil que permite regravar dados byte a byte, comum em microcontroladores. |
| Flash | Memória não volátil regravável, apagada em blocos, usada em pen drives e celulares. |
| cache | Memória pequena e veloz que guarda cópias de dados muito usados perto da CPU. |
| memória de massa (armazenamento) | Guarda arquivos e programas de forma permanente e em grande volume, como HD ou SSD. |
| DMA | Mecanismo que move dados entre periféricos e a RAM sem ocupar a CPU. |
| address bus (barramento de endereço) | Via de mão única pela qual a CPU informa qual posição de memória acessar. |
| data bus (barramento de dados) | Caminho bidirecional que transporta o conteúdo trocado entre CPU, memória e periféricos. |
| microcontrolador | Chip único que reúne processador, memória e portas de entrada e saída, comum no Arduino. |
| dual core | Processador com um par de núcleos de execução. |
| quad core | Processador com quatro núcleos de execução. |

## Estrutura do projeto

- `index.html`: estrutura da página
- `style.css`: visual inspirado no WEC (asfalto, zebra, bandeira quadriculada e cores de classe)
- `script.js`: banco de termos, sorteio das fases e do tabuleiro, seleção por arraste ou toque, dicas, contador e reinício
