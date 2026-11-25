import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  StatusBar,
  Platform,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, formatarDinheiro, calcularDesconto } from './src/tema/tokens';
import {
  iniciarBancoDados,
  carregarEstadoBanco,
  salvarItemCarrinhoBanco,
  limparCarrinhoBanco,
  alternarFavoritoBanco,
  salvarAnuncioBanco,
  removerAnuncioBanco,
  buscarUsuarioLogadoBanco,
  encerrarSessaoBanco,
} from './src/banco/bancoDados';
import { CATEGORIAS_LOJA } from './src/servicos/apiProdutos';
import { useCatalogo } from './src/hooks/useCatalogo';
import {
  CartaoProduto,
  SeletorQuantidade,
  LinhaResumo,
  EstadoVazio,
} from './src/componentes/ElementosLoja';
import { TelaAnunciar } from './src/telas/TelaAnunciar';
import { TelaLogin } from './src/telas/TelaLogin';
import { TelaPerfil } from './src/telas/TelaPerfil';

const ORDENS = [
  { chave: 'rel', titulo: 'Mais vendidos' },
  { chave: 'menor', titulo: 'Menor preço' },
  { chave: 'maior', titulo: 'Maior preço' },
  { chave: 'nota', titulo: 'Avaliação' },
];

export default function App() {
  const { width: larguraTela, height: alturaTela } = useWindowDimensions();
  const numeroColunas = larguraTela > alturaTela ? 3 : 2;
  const larguraCartao = (larguraTela - (numeroColunas + 1) * 8) / numeroColunas;

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [exibirTelaLogin, setExibirTelaLogin] = useState(true);
  const [abrirEmCadastro, setAbrirEmCadastro] = useState(false);
  const [aba, setAba] = useState('inicio');
  const [subAbaAnunciar, setSubAbaAnunciar] = useState('novo');
  const [carrinho, setCarrinho] = useState({});
  const [favoritos, setFavoritos] = useState({});
  const [anunciados, setAnunciados] = useState([]);
  const [cupom, setCupom] = useState('');
  const [cupomTexto, setCupomTexto] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('rel');
  const [produtoAberto, setProdutoAberto] = useState(null);
  const [quantidadeModal, setQuantidadeModal] = useState(1);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    cep: '',
    endereco: '',
    pagamento: 'Pix',
  });
  const [erroCheckout, setErroCheckout] = useState('');
  const [bancoPronto, setBancoPronto] = useState(false);

  const {
    produtosApi,
    carregando,
    carregandoMais,
    erroRede,
    recarregar,
    carregarProximaPagina,
  } = useCatalogo(busca, categoria);

  const sincronizarFormularioComUsuario = (dadosUsuario) => {
    if (!dadosUsuario) return;
    setFormulario((anterior) => ({
      ...anterior,
      nome: dadosUsuario.nome || anterior.nome,
      email: dadosUsuario.email || anterior.email,
      cep: dadosUsuario.cep || anterior.cep,
      endereco: dadosUsuario.endereco || anterior.endereco,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        await iniciarBancoDados();
        const [estadoSalvo, usuarioAtivo] = await Promise.all([
          carregarEstadoBanco(),
          buscarUsuarioLogadoBanco(),
        ]);
        setCarrinho(estadoSalvo.carrinho);
        setFavoritos(estadoSalvo.favoritos);
        setAnunciados(estadoSalvo.anunciados);
        if (usuarioAtivo) {
          setUsuarioLogado(usuarioAtivo);
          sincronizarFormularioComUsuario(usuarioAtivo);
          setExibirTelaLogin(false);
        }
      } catch (erro) {
        Alert.alert('Erro no banco', 'Não foi possível abrir o SQLite local.');
      } finally {
        setBancoPronto(true);
      }
    })();
  }, []);

  const abrirTelaAutenticacao = (modoCadastro = false) => {
    setProdutoAberto(null);
    setAbrirEmCadastro(modoCadastro);
    setExibirTelaLogin(true);
  };

  const solicitarLogin = (mensagem) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${mensagem}\n\nDeseja ir para a tela de login agora?`)) {
        abrirTelaAutenticacao(false);
      }
      return;
    }

    Alert.alert('Conta necessária', mensagem, [
      { text: 'Continuar vendo', style: 'cancel' },
      { text: 'Criar conta', onPress: () => abrirTelaAutenticacao(true) },
      { text: 'Fazer login', onPress: () => abrirTelaAutenticacao(false) },
    ]);
  };

  const lidarComAutenticacao = (dadosUsuario) => {
    setUsuarioLogado(dadosUsuario);
    sincronizarFormularioComUsuario(dadosUsuario);
    setExibirTelaLogin(false);
    setAba('inicio');
  };

  const lidarComVerSomenteProdutos = () => {
    setUsuarioLogado(null);
    setExibirTelaLogin(false);
    setAba('inicio');
  };

  const lidarComAtualizacaoPerfil = (dadosAtualizados) => {
    setUsuarioLogado(dadosAtualizados);
    sincronizarFormularioComUsuario(dadosAtualizados);
  };

  const lidarComSaida = async () => {
    try {
      await encerrarSessaoBanco();
      setUsuarioLogado(null);
      setAbrirEmCadastro(false);
      setExibirTelaLogin(true);
      setAba('inicio');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
    }
  };

  const listaExibida = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const base =
      aba === 'favoritos'
        ? Object.values(favoritos)
        : [
            ...anunciados.filter(
              (p) =>
                (categoria === 'Todos' || p.categoria === categoria) &&
                (!termo || p.nome.toLowerCase().includes(termo))
            ),
            ...produtosApi,
          ];

    const comparadores = {
      rel: (a, b) => b.vendidos - a.vendidos,
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      nota: (a, b) => b.avaliacao - a.avaliacao,
    };

    return [...base].sort(comparadores[ordem]);
  }, [aba, favoritos, anunciados, produtosApi, categoria, busca, ordem]);

  const entradasCarrinho = usuarioLogado ? Object.values(carrinho) : [];
  const totalItens = entradasCarrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const totalFavoritosLogado = usuarioLogado ? Object.keys(favoritos).length : 0;
  const subtotal = entradasCarrinho.reduce(
    (soma, item) => soma + item.produto.preco * item.quantidade,
    0
  );
  const abatimento = cupom === 'SOL10' ? subtotal * 0.1 : 0;
  const frete = totalItens === 0 || subtotal >= 199 || cupom === 'FRETEGRATIS' ? 0 : 19.9;
  const totalFinal = subtotal - abatimento + frete;

  const adicionarAoCarrinho = async (produto, qtd = 1) => {
    if (!usuarioLogado) {
      solicitarLogin('Entre na sua conta ou cadastre-se para adicionar produtos ao carrinho.');
      return false;
    }
    try {
      const idTexto = String(produto.id);
      const novaQtd = (carrinho[idTexto]?.quantidade || 0) + qtd;
      setCarrinho((atual) => ({ ...atual, [idTexto]: { produto, quantidade: novaQtd } }));
      await salvarItemCarrinhoBanco(produto, novaQtd);
      return true;
    } catch (erro) {
      Alert.alert('Erro no banco', 'Não foi possível salvar o item no carrinho.');
      return false;
    }
  };

  const alterarQuantidade = async (produto, delta) => {
    try {
      const idTexto = String(produto.id);
      const novaQtd = (carrinho[idTexto]?.quantidade || 0) + delta;
      setCarrinho((atual) => {
        const copia = { ...atual };
        if (novaQtd <= 0) delete copia[idTexto];
        else copia[idTexto] = { produto, quantidade: novaQtd };
        return copia;
      });
      await salvarItemCarrinhoBanco(produto, novaQtd);
    } catch (erro) {
      Alert.alert('Erro no banco', 'Não foi possível atualizar a quantidade.');
    }
  };

  const alternarFavorito = async (produto) => {
    if (!usuarioLogado) {
      solicitarLogin('Entre na sua conta ou cadastre-se para salvar produtos nos favoritos.');
      return;
    }
    try {
      const idTexto = String(produto.id);
      const jaExiste = Boolean(favoritos[idTexto]);
      setFavoritos((atual) => {
        const copia = { ...atual };
        if (jaExiste) delete copia[idTexto];
        else copia[idTexto] = produto;
        return copia;
      });
      await alternarFavoritoBanco(produto, jaExiste);
    } catch (erro) {
      Alert.alert('Erro no banco', 'Não foi possível atualizar os favoritos.');
    }
  };

  const publicarAnuncio = async (novoProduto) => {
    try {
      await salvarAnuncioBanco(novoProduto);
      setAnunciados((atual) => [novoProduto, ...atual]);
      setAba('inicio');
    } catch (erro) {
      Alert.alert('Erro ao publicar', 'Não foi possível salvar o anúncio no SQLite.');
    }
  };

  const removerAnuncio = async (produtoRemovido) => {
    try {
      const idTexto = String(produtoRemovido.id);
      await removerAnuncioBanco(idTexto);
      setAnunciados((atual) =>
        atual.filter((item) => String(item.id) !== idTexto)
      );

      if (carrinho[idTexto]) {
        setCarrinho((atual) => {
          const copia = { ...atual };
          delete copia[idTexto];
          return copia;
        });
        await salvarItemCarrinhoBanco(produtoRemovido, 0);
      }

      if (favoritos[idTexto]) {
        setFavoritos((atual) => {
          const copia = { ...atual };
          delete copia[idTexto];
          return copia;
        });
        await alternarFavoritoBanco(produtoRemovido, true);
      }
    } catch (erro) {
      Alert.alert('Erro ao remover', 'Não foi possível excluir o anúncio do SQLite.');
    }
  };

  const aplicarCupom = () => {
    const codigo = cupomTexto.trim().toUpperCase();
    if (!codigo) return setCupom('');
    if (codigo === 'SOL10' || codigo === 'FRETEGRATIS') setCupom(codigo);
    else Alert.alert('Cupom inválido', 'Os cupons disponíveis são SOL10 e FRETEGRATIS.');
  };

  const abrirCheckout = () => {
    sincronizarFormularioComUsuario(usuarioLogado);
    setErroCheckout('');
    setPedidoConfirmado(null);
    setCheckoutAberto(true);
  };

  const confirmarPedido = async () => {
    if (formulario.nome.trim().length < 3)
      return setErroCheckout('Informe seu nome completo.');
    if (!/^\S+@\S+\.\S+$/.test(formulario.email.trim()))
      return setErroCheckout('Informe um e-mail válido.');
    if (formulario.cep.replace(/\D/g, '').length !== 8)
      return setErroCheckout('O CEP precisa ter 8 números.');
    if (formulario.endereco.trim().length < 5)
      return setErroCheckout('Informe o endereço com número.');

    try {
      setErroCheckout('');
      await limparCarrinhoBanco();
      setPedidoConfirmado({
        numero: 'SOL-' + Math.floor(100000 + Math.random() * 900000),
        total: totalFinal,
        pagamento: formulario.pagamento,
        email: formulario.email.trim(),
      });
      setCarrinho({});
      setCupom('');
      setCupomTexto('');
    } catch (erro) {
      Alert.alert('Erro no banco', 'Não foi possível concluir o pedido no SQLite.');
    }
  };

  if (!bancoPronto) return null;

  if (exibirTelaLogin) {
    return (
      <TelaLogin
        modoInicialCadastro={abrirEmCadastro}
        aoAutenticar={lidarComAutenticacao}
        aoVerSomenteProdutos={lidarComVerSomenteProdutos}
      />
    );
  }

  return (
    <SafeAreaView style={estilos.safe}>
      <StatusBar backgroundColor={CORES.laranja} barStyle="light-content" />

      <View style={estilos.topo}>
        {aba === 'inicio' ? (
          <View style={estilos.busca}>
            <Ionicons name="search" size={18} color={CORES.cinza} />
            <TextInput
              style={estilos.buscaInput}
              placeholder="Buscar produtos"
              placeholderTextColor={CORES.cinza}
              value={busca}
              onChangeText={setBusca}
            />
            {!!busca && (
              <Pressable onPress={() => setBusca('')}>
                <Ionicons name="close-circle" size={18} color={CORES.cinza} />
              </Pressable>
            )}
          </View>
        ) : (
          <Text style={estilos.tituloTopo}>
            {aba === 'favoritos'
              ? 'Favoritos'
              : aba === 'anunciar'
              ? 'Anúncios'
              : aba === 'perfil'
              ? 'Meu perfil'
              : 'Meu carrinho'}
          </Text>
        )}
      </View>

      {aba === 'inicio' && (
        <>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingVertical: 10 }}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {CATEGORIAS_LOJA.map((cat) => (
                <Pressable
                  key={cat.chave}
                  onPress={() => setCategoria(cat.chave)}
                  style={[estilos.chip, categoria === cat.chave && estilos.chipAtivo]}
                >
                  <Text
                    style={[
                      estilos.chipTexto,
                      categoria === cat.chave && { color: CORES.branco },
                    ]}
                  >
                    {cat.rotulo}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8 }}
            >
              {ORDENS.map((itemOrdem) => (
                <Pressable
                  key={itemOrdem.chave}
                  onPress={() => setOrdem(itemOrdem.chave)}
                  style={[
                    estilos.ordem,
                    ordem === itemOrdem.chave && { borderBottomColor: CORES.laranja },
                  ]}
                >
                  <Text
                    style={[
                      estilos.ordemTexto,
                      ordem === itemOrdem.chave && {
                        color: CORES.laranja,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {itemOrdem.titulo}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {carregando ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={CORES.laranja} />
            </View>
          ) : erroRede ? (
            <EstadoVazio
              icone="cloud-offline-outline"
              mensagem={erroRede}
              textoBotao="Tentar novamente"
              aoClicar={recarregar}
            />
          ) : (
            <FlatList
              key={`inicio-${numeroColunas}`}
              data={listaExibida}
              keyExtractor={(item) => String(item.id)}
              numColumns={numeroColunas}
              onEndReached={carregarProximaPagina}
              onEndReachedThreshold={0.4}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={5}
              renderItem={({ item }) => (
                <CartaoProduto
                  produto={item}
                  largura={larguraCartao}
                  favoritado={Boolean(usuarioLogado && favoritos[String(item.id)])}
                  aoFavoritar={alternarFavorito}
                  aoAbrir={(prod) => {
                    setQuantidadeModal(1);
                    setProdutoAberto(prod);
                  }}
                  aoAdicionar={adicionarAoCarrinho}
                />
              )}
              ListEmptyComponent={
                <EstadoVazio icone="search" mensagem="Nenhum produto encontrado." />
              }
              ListFooterComponent={
                carregandoMais ? (
                  <ActivityIndicator
                    style={{ marginVertical: 16 }}
                    color={CORES.laranja}
                  />
                ) : null
              }
              columnWrapperStyle={{ paddingHorizontal: 8, gap: 8 }}
              contentContainerStyle={{ paddingBottom: 16, gap: 8, flexGrow: 1 }}
            />
          )}
        </>
      )}

      {aba === 'favoritos' &&
        (!usuarioLogado ? (
          <EstadoVazio
            icone="heart-outline"
            mensagem="Faça login ou crie uma conta para ver e salvar seus produtos favoritos."
            textoBotao="Fazer login ou criar conta"
            aoClicar={() => abrirTelaAutenticacao(false)}
          />
        ) : (
          <FlatList
            key={`favoritos-${numeroColunas}`}
            data={listaExibida}
            keyExtractor={(item) => String(item.id)}
            numColumns={numeroColunas}
            renderItem={({ item }) => (
              <CartaoProduto
                produto={item}
                largura={larguraCartao}
                favoritado={Boolean(favoritos[String(item.id)])}
                aoFavoritar={alternarFavorito}
                aoAbrir={(prod) => {
                  setQuantidadeModal(1);
                  setProdutoAberto(prod);
                }}
                aoAdicionar={adicionarAoCarrinho}
              />
            )}
            ListEmptyComponent={
              <EstadoVazio
                icone="heart-outline"
                mensagem="Você ainda não favoritou nenhum produto."
              />
            }
            columnWrapperStyle={{ paddingHorizontal: 8, gap: 8 }}
            contentContainerStyle={{ paddingVertical: 12, gap: 8, flexGrow: 1 }}
          />
        ))}

      {aba === 'anunciar' &&
        (!usuarioLogado ? (
          <EstadoVazio
            icone="pricetag-outline"
            mensagem="Faça login ou crie uma conta para publicar e gerenciar seus anúncios."
            textoBotao="Fazer login ou criar conta"
            aoClicar={() => abrirTelaAutenticacao(false)}
          />
        ) : (
          <TelaAnunciar
            anunciados={anunciados}
            subAbaInicial={subAbaAnunciar}
            aoPublicar={publicarAnuncio}
            aoRemoverAnuncio={removerAnuncio}
          />
        ))}

      {aba === 'perfil' && (
        <TelaPerfil
          usuario={usuarioLogado}
          totalFavoritos={totalFavoritosLogado}
          totalAnuncios={anunciados.length}
          totalCarrinho={totalItens}
          aoAtualizarUsuario={lidarComAtualizacaoPerfil}
          aoNavegarAba={setAba}
          aoAbrirMeusAnuncios={() => {
            setSubAbaAnunciar('meus');
            setAba('anunciar');
          }}
          aoAbrirAutenticacao={abrirTelaAutenticacao}
          aoSair={lidarComSaida}
        />
      )}

      {aba === 'carrinho' &&
        (!usuarioLogado ? (
          <EstadoVazio
            icone="cart-outline"
            mensagem="Faça login ou crie uma conta para adicionar itens ao carrinho e finalizar compras."
            textoBotao="Fazer login ou criar conta"
            aoClicar={() => abrirTelaAutenticacao(false)}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {entradasCarrinho.length === 0 ? (
              <EstadoVazio icone="cart-outline" mensagem="Seu carrinho está vazio." />
            ) : (
              <ScrollView contentContainerStyle={{ padding: 12 }}>
                {entradasCarrinho.map(({ produto, quantidade }) => (
                  <View key={produto.id} style={estilos.itemCarrinho}>
                    <Image source={{ uri: produto.imagem }} style={estilos.imagemCarrinho} />
                    <View style={{ flex: 1 }}>
                      <Text style={estilos.nomeProduto} numberOfLines={2}>
                        {produto.nome}
                      </Text>
                      <Text style={estilos.precoProduto}>
                        {formatarDinheiro(produto.preco * quantidade)}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 6,
                        }}
                      >
                        <SeletorQuantidade
                          valor={quantidade}
                          aoDiminuir={() => alterarQuantidade(produto, -1)}
                          aoAumentar={() => alterarQuantidade(produto, 1)}
                        />
                        <Pressable onPress={() => alterarQuantidade(produto, -quantidade)}>
                          <Text style={{ color: CORES.vermelho }}>Remover</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}

                <View style={estilos.caixa}>
                  <Text style={estilos.rotulo}>Cupom de desconto</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      style={[estilos.input, { flex: 1 }]}
                      placeholder="SOL10 ou FRETEGRATIS"
                      autoCapitalize="characters"
                      value={cupomTexto}
                      onChangeText={setCupomTexto}
                    />
                    <Pressable style={estilos.botaoCupom} onPress={aplicarCupom}>
                      <Text style={{ color: CORES.branco, fontWeight: '700' }}>Aplicar</Text>
                    </Pressable>
                  </View>
                  {!!cupom && (
                    <Text style={{ color: CORES.verde, marginTop: 6 }}>
                      Cupom {cupom} aplicado
                    </Text>
                  )}
                </View>

                <View style={estilos.caixa}>
                  <LinhaResumo
                    rotulo={`Subtotal (${totalItens} itens)`}
                    valor={formatarDinheiro(subtotal)}
                  />
                  {abatimento > 0 && (
                    <LinhaResumo
                      rotulo="Desconto"
                      valor={'− ' + formatarDinheiro(abatimento)}
                      verde
                    />
                  )}
                  <LinhaResumo
                    rotulo="Frete"
                    valor={frete ? formatarDinheiro(frete) : 'Grátis'}
                  />
                  <View style={estilos.separador} />
                  <LinhaResumo rotulo="Total" valor={formatarDinheiro(totalFinal)} grande />
                </View>

                <Pressable style={estilos.botaoGrande} onPress={abrirCheckout}>
                  <Text style={estilos.textoBotaoGrande}>Finalizar compra</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        ))}

      <View style={estilos.barraAbas}>
        {[
          ['inicio', 'home-outline', 'Início'],
          ['favoritos', 'heart-outline', 'Favoritos'],
          ['anunciar', 'add-circle-outline', 'Anunciar'],
          ['carrinho', 'cart-outline', 'Carrinho'],
          ['perfil', 'person-outline', 'Perfil'],
        ].map(([chaveAba, icone, rotulo]) => (
          <Pressable
            key={chaveAba}
            style={estilos.aba}
            onPress={() => {
              if (chaveAba === 'anunciar') setSubAbaAnunciar('novo');
              setAba(chaveAba);
            }}
          >
            <View>
              <Ionicons
                name={icone}
                size={22}
                color={aba === chaveAba ? CORES.laranja : CORES.cinza}
              />
              {chaveAba === 'carrinho' && totalItens > 0 && (
                <View style={estilos.badge}>
                  <Text style={estilos.badgeTexto}>{totalItens}</Text>
                </View>
              )}
              {chaveAba === 'favoritos' && totalFavoritosLogado > 0 && (
                <View style={estilos.badge}>
                  <Text style={estilos.badgeTexto}>{totalFavoritosLogado}</Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 11,
                color: aba === chaveAba ? CORES.laranja : CORES.cinza,
              }}
            >
              {rotulo}
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={Boolean(produtoAberto)}
        animationType="slide"
        onRequestClose={() => setProdutoAberto(null)}
      >
        {produtoAberto && (
          <SafeAreaView style={{ flex: 1, backgroundColor: CORES.branco }}>
            <ScrollView>
              <Image
                source={{ uri: produtoAberto.imagem }}
                style={{ width: larguraTela, height: Math.min(larguraTela, 320) }}
                resizeMode="contain"
              />
              <Pressable
                style={estilos.botaoFechar}
                onPress={() => setProdutoAberto(null)}
              >
                <Ionicons name="close" size={22} color={CORES.texto} />
              </Pressable>

              <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: CORES.laranja }}>
                  {formatarDinheiro(produtoAberto.preco)}
                </Text>
                <Text style={estilos.infoMini}>
                  <Text style={{ textDecorationLine: 'line-through' }}>
                    {formatarDinheiro(produtoAberto.precoAntigo)}
                  </Text>{' '}
                  {calcularDesconto(produtoAberto)}% OFF · ou 10x de{' '}
                  {formatarDinheiro(produtoAberto.preco / 10)}
                </Text>
                <Text style={{ fontSize: 18, marginTop: 10, color: CORES.texto }}>
                  {produtoAberto.nome}
                </Text>
                <Text style={[estilos.infoMini, { marginTop: 4 }]}>
                  ★ {String(produtoAberto.avaliacao).replace('.', ',')} ·{' '}
                  {produtoAberto.vendidos} vendidos · {produtoAberto.categoria}
                </Text>
                <Text style={{ marginTop: 12, lineHeight: 21, color: CORES.texto }}>
                  {produtoAberto.descricao}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 14,
                  }}
                >
                  <Text style={estilos.rotulo}>Quantidade</Text>
                  <SeletorQuantidade
                    valor={quantidadeModal}
                    aoDiminuir={() => setQuantidadeModal(Math.max(1, quantidadeModal - 1))}
                    aoAumentar={() => setQuantidadeModal(quantidadeModal + 1)}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={estilos.rodapeModal}>
              <Pressable
                style={[estilos.botaoRodape, { backgroundColor: CORES.laranjaClaro }]}
                onPress={async () => {
                  const adicionou = await adicionarAoCarrinho(produtoAberto, quantidadeModal);
                  if (adicionou) setProdutoAberto(null);
                }}
              >
                <Text style={{ color: CORES.laranja, fontWeight: '700' }}>
                  Adicionar ao carrinho
                </Text>
              </Pressable>
              <Pressable
                style={[estilos.botaoRodape, { backgroundColor: CORES.laranja }]}
                onPress={async () => {
                  const adicionou = await adicionarAoCarrinho(produtoAberto, quantidadeModal);
                  if (adicionou) {
                    setProdutoAberto(null);
                    abrirCheckout();
                  }
                }}
              >
                <Text style={{ color: CORES.branco, fontWeight: '700' }}>Comprar agora</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        )}
      </Modal>

      <Modal
        visible={checkoutAberto}
        animationType="slide"
        onRequestClose={() => setCheckoutAberto(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: CORES.branco }}>
          {pedidoConfirmado ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
              <Ionicons name="checkmark-circle" size={72} color={CORES.verde} />
              <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 8 }}>
                Pedido confirmado
              </Text>
              <Text style={{ marginTop: 8 }}>
                Número do pedido:{' '}
                <Text style={{ fontWeight: '700' }}>{pedidoConfirmado.numero}</Text>
              </Text>
              <Text style={{ marginTop: 6, textAlign: 'center', color: CORES.cinza }}>
                Total de {formatarDinheiro(pedidoConfirmado.total)} pago via{' '}
                {pedidoConfirmado.pagamento}. Os detalhes foram enviados para{' '}
                {pedidoConfirmado.email}.
              </Text>
              <Pressable
                style={[estilos.botaoGrande, { marginTop: 24, alignSelf: 'stretch' }]}
                onPress={() => {
                  setCheckoutAberto(false);
                  setPedidoConfirmado(null);
                  setAba('inicio');
                }}
              >
                <Text style={estilos.textoBotaoGrande}>Continuar comprando</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: '700' }}>Finalizar compra</Text>
                <Pressable onPress={() => setCheckoutAberto(false)}>
                  <Ionicons name="close" size={26} color={CORES.texto} />
                </Pressable>
              </View>

              <Text style={estilos.rotulo}>Nome completo</Text>
              <TextInput
                style={estilos.input}
                value={formulario.nome}
                onChangeText={(valor) => setFormulario({ ...formulario, nome: valor })}
              />

              <Text style={estilos.rotulo}>E-mail</Text>
              <TextInput
                style={estilos.input}
                value={formulario.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(valor) => setFormulario({ ...formulario, email: valor })}
              />

              <Text style={estilos.rotulo}>CEP</Text>
              <TextInput
                style={estilos.input}
                value={formulario.cep}
                keyboardType="number-pad"
                maxLength={9}
                placeholder="00000-000"
                onChangeText={(valor) => setFormulario({ ...formulario, cep: valor })}
              />

              <Text style={estilos.rotulo}>Endereço e número</Text>
              <TextInput
                style={estilos.input}
                value={formulario.endereco}
                onChangeText={(valor) => setFormulario({ ...formulario, endereco: valor })}
              />

              <Text style={estilos.rotulo}>Forma de pagamento</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['Pix', 'Cartão', 'Boleto'].map((forma) => (
                  <Pressable
                    key={forma}
                    onPress={() => setFormulario({ ...formulario, pagamento: forma })}
                    style={[
                      estilos.opcaoPagamento,
                      formulario.pagamento === forma && estilos.opcaoPagamentoAtiva,
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          formulario.pagamento === forma ? CORES.laranja : CORES.texto,
                        fontWeight: formulario.pagamento === forma ? '700' : '400',
                      }}
                    >
                      {forma}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={[estilos.caixa, { marginTop: 18 }]}>
                <LinhaResumo rotulo="Subtotal" valor={formatarDinheiro(subtotal)} />
                {abatimento > 0 && (
                  <LinhaResumo
                    rotulo="Desconto"
                    valor={'− ' + formatarDinheiro(abatimento)}
                    verde
                  />
                )}
                <LinhaResumo
                  rotulo="Frete"
                  valor={frete ? formatarDinheiro(frete) : 'Grátis'}
                />
                <View style={estilos.separador} />
                <LinhaResumo rotulo="Total" valor={formatarDinheiro(totalFinal)} grande />
              </View>

              {!!erroCheckout && (
                <Text style={{ color: CORES.vermelho, marginTop: 10 }}>{erroCheckout}</Text>
              )}

              <Pressable
                style={[estilos.botaoGrande, { marginTop: 14 }]}
                onPress={confirmarPedido}
              >
                <Text style={estilos.textoBotaoGrande}>Confirmar pedido</Text>
              </Pressable>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topo: {
    backgroundColor: CORES.laranja,
    padding: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  tituloTopo: { color: CORES.branco, fontSize: 20, fontWeight: '700', paddingHorizontal: 4 },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.branco,
    borderRadius: 4,
    paddingHorizontal: 10,
    gap: 6,
  },
  buscaInput: { flex: 1, paddingVertical: 8, fontSize: 15, color: CORES.texto },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.linha,
    marginHorizontal: 4,
  },
  chipAtivo: { backgroundColor: CORES.laranja, borderColor: CORES.laranja },
  chipTexto: { color: CORES.texto, fontSize: 13 },
  ordem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  ordemTexto: { color: CORES.cinza, fontSize: 13 },
  infoMini: { fontSize: 12, color: CORES.cinza, marginTop: 2 },
  itemCarrinho: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: CORES.branco,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  imagemCarrinho: { width: 80, height: 80, borderRadius: 4, backgroundColor: '#EEEEEE' },
  nomeProduto: { fontSize: 13, color: CORES.texto, minHeight: 34 },
  precoProduto: { fontSize: 17, fontWeight: '700', color: CORES.laranja, marginTop: 2 },
  caixa: { backgroundColor: CORES.branco, padding: 12, borderRadius: 4, marginBottom: 8 },
  rotulo: { fontSize: 13, color: CORES.cinza, marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 15,
    backgroundColor: CORES.branco,
    color: CORES.texto,
  },
  botaoCupom: {
    backgroundColor: CORES.texto,
    borderRadius: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  separador: { height: 1, backgroundColor: CORES.linha, marginVertical: 6 },
  botaoGrande: {
    backgroundColor: CORES.laranja,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  textoBotaoGrande: { color: CORES.branco, fontWeight: '700', fontSize: 16 },
  barraAbas: {
    flexDirection: 'row',
    backgroundColor: CORES.branco,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
  },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 2 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: CORES.amarelo,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeTexto: { fontSize: 10, fontWeight: '700', color: CORES.texto },
  botaoFechar: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFFDD',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rodapeModal: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
  },
  botaoRodape: { flex: 1, borderRadius: 4, paddingVertical: 13, alignItems: 'center' },
  opcaoPagamento: {
    flex: 1,
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  opcaoPagamentoAtiva: {
    borderColor: CORES.laranja,
    backgroundColor: CORES.laranjaClaro,
  },
});