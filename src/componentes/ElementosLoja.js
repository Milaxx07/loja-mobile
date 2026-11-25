import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, formatarDinheiro, calcularDesconto } from '../tema/tokens';

export function CartaoProduto({
  produto,
  largura,
  favoritado,
  aoFavoritar,
  aoAbrir,
  aoAdicionar,
}) {
  const percentualOff = calcularDesconto(produto);

  return (
    <Pressable style={[estilos.cartao, { width: largura }]} onPress={() => aoAbrir(produto)}>
      <Image
        source={{ uri: produto.imagem }}
        style={[estilos.imagem, { height: largura }]}
        resizeMode="contain"
      />

      {percentualOff > 0 && (
        <View style={estilos.etiquetaDesconto}>
          <Text style={estilos.textoEtiqueta}>-{percentualOff}%</Text>
        </View>
      )}

      <Pressable style={estilos.botaoCoracao} onPress={() => aoFavoritar(produto)} hitSlop={8}>
        <Ionicons
          name={favoritado ? 'heart' : 'heart-outline'}
          size={20}
          color={favoritado ? CORES.vermelho : CORES.cinza}
        />
      </Pressable>

      <View style={estilos.corpo}>
        <Text style={estilos.nome} numberOfLines={3}>
          {produto.nome}
        </Text>
        <Text style={estilos.preco}>{formatarDinheiro(produto.preco)}</Text>
        <Text style={estilos.precoAntigo}>{formatarDinheiro(produto.precoAntigo)}</Text>
        <Text style={estilos.infoMini}>
          ★ {String(produto.avaliacao).replace('.', ',')} · {produto.vendidos} vendidos
        </Text>
        <Pressable style={estilos.botaoAdicionar} onPress={() => aoAdicionar(produto, 1)}>
          <Text style={estilos.textoAdicionar}>Adicionar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export function SeletorQuantidade({ valor, aoDiminuir, aoAumentar }) {
  return (
    <View style={estilos.seletor}>
      <Pressable onPress={aoDiminuir} style={estilos.botaoSeletor}>
        <Text style={estilos.simboloSeletor}>−</Text>
      </Pressable>
      <Text style={estilos.valorSeletor}>{valor}</Text>
      <Pressable onPress={aoAumentar} style={estilos.botaoSeletor}>
        <Text style={estilos.simboloSeletor}>+</Text>
      </Pressable>
    </View>
  );
}

export function LinhaResumo({ rotulo, valor, verde, grande }) {
  return (
    <View style={estilos.linhaResumo}>
      <Text
        style={{
          color: verde ? CORES.verde : CORES.texto,
          fontSize: grande ? 17 : 14,
          fontWeight: grande ? '700' : '400',
        }}
      >
        {rotulo}
      </Text>
      <Text
        style={{
          color: verde ? CORES.verde : grande ? CORES.laranja : CORES.texto,
          fontSize: grande ? 17 : 14,
          fontWeight: grande ? '700' : '400',
        }}
      >
        {valor}
      </Text>
    </View>
  );
}

export function EstadoVazio({ icone, mensagem, textoBotao, aoClicar }) {
  return (
    <View style={estilos.vazio}>
      <Ionicons name={icone} size={56} color={CORES.linha} />
      <Text style={estilos.textoVazio}>{mensagem}</Text>
      {!!textoBotao && (
        <Pressable style={estilos.botaoTentar} onPress={aoClicar}>
          <Text style={estilos.textoTentar}>{textoBotao}</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { backgroundColor: CORES.branco, borderRadius: 4, overflow: 'hidden' },
  imagem: { width: '100%', backgroundColor: '#F9F9F9' },
  etiquetaDesconto: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: CORES.amarelo,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoEtiqueta: { fontSize: 11, fontWeight: '700', color: CORES.texto },
  botaoCoracao: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFFCC',
    borderRadius: 14,
    padding: 4,
  },
  corpo: { padding: 8 },
  nome: { fontSize: 13, lineHeight: 17, color: CORES.texto, minHeight: 51 },
  preco: { fontSize: 17, fontWeight: '700', color: CORES.laranja, marginTop: 4 },
  precoAntigo: { fontSize: 12, color: CORES.cinza, textDecorationLine: 'line-through' },
  infoMini: { fontSize: 12, color: CORES.cinza, marginTop: 2 },
  botaoAdicionar: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: CORES.laranja,
    borderRadius: 4,
    paddingVertical: 6,
    alignItems: 'center',
  },
  textoAdicionar: { color: CORES.laranja, fontWeight: '600', fontSize: 13 },
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: 4,
  },
  botaoSeletor: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  simboloSeletor: { fontSize: 18, color: CORES.texto },
  valorSeletor: { minWidth: 30, textAlign: 'center', fontWeight: '600' },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  textoVazio: { color: CORES.cinza, marginTop: 8, textAlign: 'center', fontSize: 14 },
  botaoTentar: {
    marginTop: 14,
    backgroundColor: CORES.laranja,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 4,
  },
  textoTentar: { color: CORES.branco, fontWeight: '700' },
});