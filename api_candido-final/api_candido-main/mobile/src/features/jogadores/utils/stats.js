export function computeStats(jogadores = []) {
  const total = jogadores.length;
  const soma = (campo) => jogadores.reduce((acc, j) => acc + (Number(j[campo]) || 0), 0);

  return {
    total,
    nivelMedio: total ? Math.round(soma('nivel') / total) : 0,
    totalMoedas: soma('moedas'),
    maiorXp: total ? Math.max(...jogadores.map((j) => Number(j.xp) || 0)) : 0,
    ranking: [...jogadores].sort((a, b) => b.xp - a.xp).slice(0, 3),
  };
}
