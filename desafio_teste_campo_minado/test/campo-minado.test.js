import test from 'node:test';
import assert from 'node:assert/strict';
import { CampoMinado } from '../src/campo-minado.js';

const bombasFixas = Array.from({ length: 40 }, (_, n) => [Math.floor(n / 14), n % 14]);

function jogoComBombas(...posicoes) {
  const ocupadas = new Set(posicoes.map(([l, c]) => `${l}:${c}`));
  for (let l = 3; ocupadas.size < 40; l++) {
    for (let c = 0; c < CampoMinado.COLUNAS && ocupadas.size < 40; c++) {
      ocupadas.add(`${l}:${c}`);
    }
  }
  return new CampoMinado([...ocupadas].map((chave) => chave.split(':').map(Number)));
}

test('CT01 - cria tabuleiro 18x14 com 40 bombas e nenhuma casa aberta', () => {
  const jogo = new CampoMinado(bombasFixas);
  assert.equal(jogo.estado.linhas, 18);
  assert.equal(jogo.estado.colunas, 14);
  assert.equal(jogo.estado.bombas, 40);
  assert.equal(jogo.estado.abertas, 0);
  assert.equal(jogo.estado.segurasRestantes, 212);
});

test('CT02 - revelar bomba encerra a partida com derrota', () => {
  const jogo = new CampoMinado(bombasFixas);
  assert.equal(jogo.bombaEm(0, 0), true);
  const estado = jogo.revelar(0, 0);
  assert.equal(estado.status, 'derrota');
  assert.equal(estado.abertas, 1);
  assert.throws(() => jogo.revelar(17, 13), /Partida encerrada/);
});

test('CT03 - conta bombas adjacentes inclusive na borda', () => {
  const jogo = jogoComBombas([0, 1], [1, 1]);
  assert.equal(jogo.bombasAdjacentes(0, 2), 2);
  assert.equal(jogo.bombasAdjacentes(0, 0), 2);
});

test('CT04 - expansão de casa vazia revela a área e alcança vitória', () => {
  const jogo = new CampoMinado(bombasFixas);
  const estado = jogo.revelar(17, 13);
  assert.equal(estado.status, 'vitoria');
  assert.equal(estado.abertas, 212);
});

test('CT05 - bandeira bloqueia revelação e pode ser removida', () => {
  const jogo = jogoComBombas([0, 12], [1, 12]);
  jogo.alternarBandeira(0, 13);
  assert.equal(jogo.estado.bandeiras, 1);
  assert.equal(jogo.estado.abertas, 0);
  jogo.revelar(0, 13);
  assert.equal(jogo.estado.abertas, 0);
  jogo.alternarBandeira(0, 13);
  jogo.revelar(0, 13);
  assert.equal(jogo.estado.abertas, 1);
});

test('CT06 - revelar a mesma casa não duplica a contagem', () => {
  const jogo = jogoComBombas([0, 12], [1, 12]);
  jogo.revelar(0, 13);
  const antes = jogo.estado.abertas;
  jogo.revelar(0, 13);
  assert.equal(jogo.estado.abertas, antes);
});

test('CT07 - rejeita coordenadas fora dos limites e fracionárias', () => {
  const jogo = new CampoMinado(bombasFixas);
  assert.throws(() => jogo.revelar(-1, 0), RangeError);
  assert.throws(() => jogo.revelar(18, 0), RangeError);
  assert.throws(() => jogo.revelar(0, 14), RangeError);
  assert.throws(() => jogo.revelar(1.5, 2), RangeError);
});

test('CT08 - rejeita quantidade, duplicidade e posição inválida de bombas', () => {
  assert.throws(() => new CampoMinado(bombasFixas.slice(0, 39)), /exatamente 40/);
  assert.throws(() => new CampoMinado([...bombasFixas.slice(0, 39), [0, 0]]), /duplicadas/);
  assert.throws(() => new CampoMinado([...bombasFixas.slice(0, 39), [18, 0]]), /inválida/);
  assert.throws(() => new CampoMinado([...bombasFixas.slice(0, 39), [0, 0, 1]]), /inválida/);
});

test('CT09 - permite 40 bandeiras e impede a quadragésima primeira', () => {
  const jogo = new CampoMinado(bombasFixas);
  let feitas = 0;
  for (let l = 0; l < 18 && feitas < 40; l++) {
    for (let c = 0; c < 14 && feitas < 40; c++) {
      if (!jogo.bombaEm(l, c)) {
        jogo.alternarBandeira(l, c);
        feitas++;
      }
    }
  }
  assert.equal(jogo.estado.bandeiras, 40);
  assert.throws(() => jogo.alternarBandeira(0, 0), /Limite de 40/);
});

test('CT10 - bandeira em casa segura impede vitória até sua remoção', () => {
  const jogo = new CampoMinado(bombasFixas);
  jogo.alternarBandeira(17, 13);
  for (let l = 0; l < 18; l++) {
    for (let c = 0; c < 14; c++) {
      if (!jogo.bombaEm(l, c) && !(l === 17 && c === 13)) jogo.revelar(l, c);
    }
  }
  assert.equal(jogo.estado.status, 'em andamento');
  jogo.alternarBandeira(17, 13);
  const final = jogo.revelar(17, 13);
  assert.equal(final.status, 'vitoria');
});

test('CT11 - criação padrão sorteia 40 posições únicas e válidas', () => {
  const jogo = new CampoMinado();
  assert.equal(jogo.estado.bombas, 40);
  assert.equal(jogo.estado.abertas, 0);
  let quantidade = 0;
  for (let l = 0; l < 18; l++) {
    for (let c = 0; c < 14; c++) {
      if (jogo.bombaEm(l, c)) quantidade++;
    }
  }
  assert.equal(quantidade, 40);
});
