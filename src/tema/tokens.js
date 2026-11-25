export const CORES = {
  laranja: '#F26B1D',
  laranjaClaro: '#FFF1E6',
  amarelo: '#FFC93C',
  fundo: '#F4F4F4',
  branco: '#FFFFFF',
  texto: '#222222',
  cinza: '#777777',
  linha: '#E3E3E3',
  verde: '#2E7D32',
  verdeClaro: '#E8F5E9',
  vermelho: '#D32F2F',
};

export const formatarDinheiro = (valor) =>
  'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',');

export const calcularDesconto = (produto) =>
  produto.precoAntigo > produto.preco
    ? Math.round((1 - produto.preco / produto.precoAntigo) * 100)
    : 0;