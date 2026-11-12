# Campo minado - 18 x 14 e 40 bombas

**Colaborador:** Gabriel Galhardone Felipe.

**Identificação acadêmica:** NOME: Gabriel Galhardone Felipe. RA:24021292-2. TURMA: ESOFT-6S-B.

## Especificação do desafio

Base: [desafios da disciplina](https://github.com/JoaoChoma/teste_software_2026/blob/main/desafios.md). Implementação e testes em JavaScript, conforme solicitado. Este projeto é independente e deve ser publicado em um repositório chamado **desafio_teste_campo_minado**.

Tabuleiro de 18 linhas e 14 colunas, totalizando 252 casas, exatamente 40 bombas e 212 casas seguras. Coordenadas começam em zero: linhas 0 a 17 e colunas 0 a 13. A orientação 18 linhas x 14 colunas foi escolhida porque o enunciado não especifica os eixos.

Revelar uma bomba causa derrota. Revelar todas as casas seguras causa vitória. Casas sem bombas vizinhas expandem a revelação por uma busca iterativa, preservando casas com bandeira. Os números contam as bombas nas até oito casas vizinhas. Uma casa já aberta não é contada novamente.

Bandeiras podem ser alternadas em casas fechadas, até o limite de 40. Uma casa com bandeira não pode ser aberta antes de remover a marcação. As ações ficam bloqueadas após vitória ou derrota. A primeira jogada não tem proteção especial: pode atingir uma bomba, regra declarada por não estar definida no enunciado.

O construtor aceita as 40 posições das bombas para reproduzir os testes. Sem argumento, usa sorteio com `node:crypto`, sem repetições. Os testes de regras usam posições fixas; o teste do construtor padrão verifica apenas propriedades invariantes, sem esperar um tabuleiro específico.

## Executar

Requisito: Node.js 22 ou superior, com npm. O projeto não possui dependências externas; não é necessário executar `npm install`.

```bash
npm test
npm run coverage
```

O primeiro comando executa todos os testes com `node:test` e `node:assert/strict`. O segundo acrescenta o relatório de cobertura nativo do Node. O processo termina com código diferente de zero se algum teste falhar.

## Exemplo de uso

```javascript
import { CampoMinado } from './src/campo-minado.js';
const bombas = Array.from({ length: 40 }, (_, n) => [Math.floor(n / 14), n % 14]);
const jogo = new CampoMinado(bombas);
jogo.revelar(17, 13);
console.log(jogo.estado.status); // vitoria
```

Os exemplos são executados como módulos ES, em um arquivo `.js` dentro deste projeto. A lógica fica em [src/campo-minado.js](src/campo-minado.js) e os testes em [test/campo-minado.test.js](test/campo-minado.test.js).

## Casos de teste e funcionamento

Cada teste prepara uma partida independente, executa uma ação pública do motor e compara o resultado ou o estado esperado. Operações inválidas são verificadas com `assert.throws`; quando relevante, o estado anterior e posterior também é comparado. Os testes não substituem a implementação por mocks.

| Caso | Comportamento verificado |
|---|---|
| CT01 | tabuleiro 18x14, 40 bombas e nenhuma casa aberta |
| CT02 | revela bomba e encerra com derrota |
| CT03 | conta bombas adjacentes inclusive na borda |
| CT04 | expansao de casa vazia revela area e alcanca vitoria |
| CT05 | bandeira bloqueia revelacao e pode ser removida |
| CT06 | revelar a mesma casa nao duplica a contagem |
| CT07 | rejeita coordenadas fora dos limites e fracionarias |
| CT08 | rejeita quantidade incorreta, duplicadas e posicoes invalidas |
| CT09 | permite 40 bandeiras e impede a quadragesima primeira |
| CT10 | bandeira em casa segura impede vitoria ate sua remocao |
| CT11 | sorteio padrao cria partida com a configuracao exigida |

## Evidências da execução

Execução em 12/11/2026, Node.js 22.19.0: **11 testes aprovados, zero falhas, zero ignorados**. Saída completa em [evidencias/testes.log](evidencias/testes.log).

Cobertura do arquivo de produção: **100.00% de linhas, 100.00% de ramificações e 100.00% de funções**. Os percentuais são do arquivo `src/campo-minado.js`; não foi usada a média que inclui o código dos testes. Cobertura indica código exercitado e não prova ausência de defeitos ou atendimento de variantes não especificadas.

## Organização e entrega

`src/` contém o motor do jogo; `test/` contém os casos automatizados; `evidencias/` registra o resultado real. O projeto não exige navegador, banco ou interface gráfica. Há uma configuração de GitHub Actions para repetir os testes a cada push ou pull request.

O professor exige um repositório por desafio e aceita no máximo cinco para avaliação. Este pacote permite revisar o projeto individualmente antes de escolher quais cinco serão enviados. Não há histórico de contribuição artificial: commits devem registrar as contribuições reais dos integrantes.
