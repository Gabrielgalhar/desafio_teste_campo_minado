# Campo Minado - 18 x 14 e 40 bombas

**Colaborador:** Gabriel Galhardone.

**Identificação acadêmica:** preencher com os dados do aluno antes da entrega.

## Desafio

Implementação de um Campo Minado em JavaScript com tabuleiro de 18 linhas por 14 colunas, totalizando 252 casas. O jogo utiliza exatamente 40 bombas e 212 casas seguras.

O projeto foi organizado para separar o motor da aplicação dos testes automatizados. A implementação usa módulos ES e a API nativa de testes do Node.js, sem dependências externas.

### Regras implementadas

- Coordenadas iniciam em zero: linhas 0 a 17 e colunas 0 a 13.
- Revelar bomba encerra a partida com derrota.
- Revelar todas as 212 casas seguras encerra a partida com vitória.
- Casas vazias expandem a revelação por busca iterativa.
- Casas com bandeira não são abertas.
- Bandeiras podem ser adicionadas ou removidas até o limite de 40.
- Números contam bombas nas oito posições vizinhas.
- Casas já abertas não são contadas novamente.
- Ações são bloqueadas depois de vitória ou derrota.
- A primeira jogada não possui proteção especial.
- O construtor aceita posições fixas de bombas para facilitar testes determinísticos.
- Sem posições informadas, as 40 bombas são sorteadas com `node:crypto`, sem repetição.

## Estrutura

```text
campo-minado/
├── .github/
│   └── workflows/
│       └── testes.yml
├── evidencias/
│   ├── testes.log
│   └── coverage.log
├── src/
│   └── campo-minado.js
├── test/
│   └── campo-minado.test.js
├── package.json
└── README.md
```

## Requisito

Node.js 22 ou superior. O projeto não possui dependências externas.

Não é necessário executar `npm install`.

## Executar os testes

No terminal, dentro da pasta do projeto:

```bash
npm test
```

O comando executa os 11 casos de teste usando `node:test` e `node:assert/strict`.

## Gerar cobertura e evidências

Depois dos testes, execute:

```bash
npm run coverage
```

O comando utiliza a cobertura nativa do Node.js e apresenta no terminal as métricas de linhas, funções e ramificações.

As evidências entregues na pasta `evidencias/` foram geradas a partir das execuções reais dos comandos:

```bash
npm test
npm run coverage
```

## Casos de teste

| Caso | Comportamento verificado |
|---|---|
| CT01 | Tabuleiro 18x14, 40 bombas e nenhuma casa aberta |
| CT02 | Revela bomba e encerra com derrota |
| CT03 | Conta bombas adjacentes inclusive na borda |
| CT04 | Expansão de casa vazia revela área e alcança vitória |
| CT05 | Bandeira bloqueia revelação e pode ser removida |
| CT06 | Revelar a mesma casa não duplica a contagem |
| CT07 | Coordenações fora dos limites e fracionárias |
| CT08 | Quantidade incorreta, duplicidade e posições inválidas |
| CT09 | Permite 40 bandeiras e bloqueia a quadragésima primeira |
| CT10 | Bandeira em casa segura impede vitória até sua remoção |
| CT11 | Sorteio padrão cria 40 posições válidas e únicas |

## Exemplo de uso

```js
import { CampoMinado } from './src/campo-minado.js';

const bombas = Array.from(
  { length: 40 },
  (_, n) => [Math.floor(n / 14), n % 14]
);

const jogo = new CampoMinado(bombas);
jogo.revelar(17, 13);

console.log(jogo.estado.status);
```

## Evidências

A pasta `evidencias/` contém a saída dos testes e da cobertura executados no ambiente de entrega. O objetivo é permitir a conferência dos resultados sem depender de uma execução anterior.

A cobertura deve ser interpretada como uma métrica de código exercitado pelos testes; ela não constitui prova de ausência de defeitos.
