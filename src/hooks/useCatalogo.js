import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { buscarProdutosApi } from '../servicos/apiProdutos';

const TAMANHO_PAGINA = 10;

export function useCatalogo(busca, categoria) {
  const [produtosApi, setProdutosApi] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroRede, setErroRede] = useState('');
  const [totalRegistros, setTotalRegistros] = useState(0);

  const carregarPrimeiraPagina = useCallback(async () => {
    setCarregando(true);
    setErroRede('');
    try {
      const resultado = await buscarProdutosApi({
        pular: 0,
        limite: TAMANHO_PAGINA,
        termoBusca: busca,
        categoria,
      });
      setProdutosApi(resultado.produtos);
      setTotalRegistros(resultado.total);
    } catch (erro) {
      setErroRede(erro.message);
    } finally {
      setCarregando(false);
    }
  }, [busca, categoria]);

  useEffect(() => {
    const esperaDigitacao = setTimeout(() => {
      carregarPrimeiraPagina();
    }, 300);
    return () => clearTimeout(esperaDigitacao);
  }, [carregarPrimeiraPagina]);

  const carregarProximaPagina = async () => {
    if (carregando || carregandoMais || produtosApi.length >= totalRegistros) return;
    setCarregandoMais(true);
    try {
      const resultado = await buscarProdutosApi({
        pular: produtosApi.length,
        limite: TAMANHO_PAGINA,
        termoBusca: busca,
        categoria,
      });
      setProdutosApi((anteriores) => [...anteriores, ...resultado.produtos]);
    } catch (erro) {
      Alert.alert('Erro ao carregar mais', erro.message);
    } finally {
      setCarregandoMais(false);
    }
  };

  return {
    produtosApi,
    carregando,
    carregandoMais,
    erroRede,
    recarregar: carregarPrimeiraPagina,
    carregarProximaPagina,
  };
}