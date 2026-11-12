import { randomInt } from 'node:crypto';

export class CampoMinado {
  static LINHAS = 18;
  static COLUNAS = 14;
  static BOMBAS = 40;

  constructor(posicoesBombas) {
    this.totalCasas = CampoMinado.LINHAS * CampoMinado.COLUNAS;
    this.bombas = new Set();
    this.abertas = new Set();
    this.bandeiras = new Set();
    this.status = 'em andamento';

    const posicoes = posicoesBombas ?? CampoMinado.#sortearBombas();
    CampoMinado.#validarBombas(posicoes);
    for (const [linha, coluna] of posicoes) {
      this.bombas.add(this.#chave(linha, coluna));
    }
  }

  get estado() {
    return {
      status: this.status,
      linhas: CampoMinado.LINHAS,
      colunas: CampoMinado.COLUNAS,
      bombas: CampoMinado.BOMBAS,
      abertas: this.abertas.size,
      bandeiras: this.bandeiras.size,
      segurasRestantes: this.totalCasas - CampoMinado.BOMBAS - this.abertas.size,
    };
  }

  revelar(linha, coluna) {
    this.#validarCoordenada(linha, coluna);
    this.#validarPartidaAtiva();
    const chave = this.#chave(linha, coluna);

    if (this.bandeiras.has(chave) || this.abertas.has(chave)) return this.estado;

    if (this.bombas.has(chave)) {
      this.abertas.add(chave);
      this.status = 'derrota';
      return this.estado;
    }

    this.#abrirArea(linha, coluna);
    if (this.abertas.size === this.totalCasas - CampoMinado.BOMBAS) {
      this.status = 'vitoria';
    }
    return this.estado;
  }

  alternarBandeira(linha, coluna) {
    this.#validarCoordenada(linha, coluna);
    this.#validarPartidaAtiva();
    const chave = this.#chave(linha, coluna);

    if (this.abertas.has(chave)) return this.estado;
    if (this.bandeiras.has(chave)) {
      this.bandeiras.delete(chave);
      return this.estado;
    }
    if (this.bandeiras.size >= CampoMinado.BOMBAS) {
      throw new Error('Limite de 40 bandeiras atingido');
    }
    this.bandeiras.add(chave);
    return this.estado;
  }

  bombaEm(linha, coluna) {
    this.#validarCoordenada(linha, coluna);
    return this.bombas.has(this.#chave(linha, coluna));
  }

  bombasAdjacentes(linha, coluna) {
    this.#validarCoordenada(linha, coluna);
    let total = 0;
    for (const [vizinhaLinha, vizinhaColuna] of this.#vizinhas(linha, coluna)) {
      if (this.bombas.has(this.#chave(vizinhaLinha, vizinhaColuna))) total++;
    }
    return total;
  }

  #abrirArea(linha, coluna) {
    const fila = [[linha, coluna]];
    const visitadas = new Set();

    while (fila.length > 0) {
      const [atualLinha, atualColuna] = fila.shift();
      const atual = this.#chave(atualLinha, atualColuna);
      if (visitadas.has(atual) || this.bandeiras.has(atual) || this.abertas.has(atual)) continue;

      visitadas.add(atual);
      this.abertas.add(atual);

      if (this.bombasAdjacentes(atualLinha, atualColuna) === 0) {
        for (const [vizinhaLinha, vizinhaColuna] of this.#vizinhas(atualLinha, atualColuna)) {
          const vizinha = this.#chave(vizinhaLinha, vizinhaColuna);
          if (!visitadas.has(vizinha) && !this.bandeiras.has(vizinha) && !this.bombas.has(vizinha)) {
            fila.push([vizinhaLinha, vizinhaColuna]);
          }
        }
      }
    }
  }

  #vizinhas(linha, coluna) {
    const resultado = [];
    for (let dl = -1; dl <= 1; dl++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dl === 0 && dc === 0) continue;
        const l = linha + dl;
        const c = coluna + dc;
        if (l >= 0 && l < CampoMinado.LINHAS && c >= 0 && c < CampoMinado.COLUNAS) {
          resultado.push([l, c]);
        }
      }
    }
    return resultado;
  }

  #chave(linha, coluna) {
    return `${linha}:${coluna}`;
  }

  #validarCoordenada(linha, coluna) {
    if (!Number.isInteger(linha) || !Number.isInteger(coluna) || linha < 0 || linha >= CampoMinado.LINHAS || coluna < 0 || coluna >= CampoMinado.COLUNAS) {
      throw new RangeError('Coordenada inválida');
    }
  }

  #validarPartidaAtiva() {
    if (this.status !== 'em andamento') throw new Error('Partida encerrada');
  }

  static #validarBombas(posicoes) {
    if (!Array.isArray(posicoes) || posicoes.length !== CampoMinado.BOMBAS) {
      throw new Error('É necessário informar exatamente 40 bombas');
    }
    const vistas = new Set();
    for (const posicao of posicoes) {
      if (!Array.isArray(posicao) || posicao.length !== 2 || !Number.isInteger(posicao[0]) || !Number.isInteger(posicao[1]) || posicao[0] < 0 || posicao[0] >= CampoMinado.LINHAS || posicao[1] < 0 || posicao[1] >= CampoMinado.COLUNAS) {
        throw new Error('Posição de bomba inválida');
      }
      const chave = `${posicao[0]}:${posicao[1]}`;
      if (vistas.has(chave)) throw new Error('Posições de bomba duplicadas');
      vistas.add(chave);
    }
  }

  static #sortearBombas() {
    const conjunto = new Set();
    while (conjunto.size < CampoMinado.BOMBAS) {
      conjunto.add(randomInt(0, CampoMinado.LINHAS * CampoMinado.COLUNAS));
    }
    return [...conjunto].map((numero) => [Math.floor(numero / CampoMinado.COLUNAS), numero % CampoMinado.COLUNAS]);
  }
}
