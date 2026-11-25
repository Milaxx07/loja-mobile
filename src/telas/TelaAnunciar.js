import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { CORES, formatarDinheiro } from '../tema/tokens';
import { comprimirFotoProduto } from '../utilitarios/compressorImagem';

export function TelaAnunciar({
  anunciados = [],
  subAbaInicial = 'novo',
  aoPublicar,
  aoRemoverAnuncio,
}) {
  const [subAba, setSubAba] = useState(subAbaInicial);
  const [nome, setNome] = useState('');
  const [precoTexto, setPrecoTexto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoComprimida, setFotoComprimida] = useState(null);
  const [comprimindo, setComprimindo] = useState(false);

  useEffect(() => {
    setSubAba(subAbaInicial);
  }, [subAbaInicial]);

  const selecionarEComprimir = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão', 'Autorize o acesso à galeria para escolher a foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (resultado.canceled) return;

    setComprimindo(true);
    try {
      const dados = await comprimirFotoProduto(resultado.assets[0].uri);
      setFotoComprimida(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível comprimir a imagem.');
    } finally {
      setComprimindo(false);
    }
  };

  const enviarAnuncio = async () => {
    const preco = Number(precoTexto.replace(',', '.'));
    if (!nome.trim() || !preco || !descricao.trim() || !fotoComprimida) {
      Alert.alert('Atenção', 'Preencha todos os campos e escolha uma imagem.');
      return;
    }

    const novoProduto = {
      id: 'local_' + Date.now(),
      nome: nome.trim(),
      preco,
      precoAntigo: Number((preco * 1.15).toFixed(2)),
      categoria: 'smartphones',
      avaliacao: 5.0,
      vendidos: 1,
      descricao: descricao.trim(),
      imagem: fotoComprimida.uri,
    };

    await aoPublicar(novoProduto);
    setNome('');
    setPrecoTexto('');
    setDescricao('');
    setFotoComprimida(null);
    Alert.alert('Sucesso', 'Produto anunciado e salvo no SQLite!');
  };

  const confirmarRemocao = (item) => {
    if (Platform.OS === 'web') {
      const confirmado = window.confirm(
        `Deseja marcar "${item.nome}" como vendido e remover este anúncio?`
      );
      if (confirmado) aoRemoverAnuncio(item);
      return;
    }

    Alert.alert(
      'Marcar como vendido',
      `Deseja remover "${item.nome}" dos seus anúncios e da vitrine?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover anúncio',
          style: 'destructive',
          onPress: () => aoRemoverAnuncio(item),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={estilos.barraSubAbas}>
        <Pressable
          style={[estilos.subAba, subAba === 'novo' && estilos.subAbaAtiva]}
          onPress={() => setSubAba('novo')}
        >
          <Text
            style={[
              estilos.textoSubAba,
              subAba === 'novo' && estilos.textoSubAbaAtiva,
            ]}
          >
            Novo anúncio
          </Text>
        </Pressable>

        <Pressable
          style={[estilos.subAba, subAba === 'meus' && estilos.subAbaAtiva]}
          onPress={() => setSubAba('meus')}
        >
          <Text
            style={[
              estilos.textoSubAba,
              subAba === 'meus' && estilos.textoSubAbaAtiva,
            ]}
          >
            Meus anúncios ({anunciados.length})
          </Text>
        </Pressable>
      </View>

      {subAba === 'meus' ? (
        <ScrollView contentContainerStyle={estilos.container}>
          {anunciados.length === 0 ? (
            <View style={estilos.vazio}>
              <Ionicons name="pricetag-outline" size={54} color={CORES.linha} />
              <Text style={estilos.textoVazio}>
                Você ainda não possui anúncios publicados.
              </Text>
              <Pressable
                style={estilos.botaoPublicar}
                onPress={() => setSubAba('novo')}
              >
                <Text style={estilos.textoPublicar}>Criar anúncio</Text>
              </Pressable>
            </View>
          ) : (
            anunciados.map((item) => (
              <View key={item.id} style={estilos.cartaoAnuncio}>
                <Image
                  source={{ uri: item.imagem }}
                  style={estilos.miniaturaAnuncio}
                />
                <View style={{ flex: 1 }}>
                  <View style={estilos.linhaTopoAnuncio}>
                    <View style={estilos.seloAtivo}>
                      <Text style={estilos.textoSeloAtivo}>Publicado</Text>
                    </View>
                  </View>

                  <Text style={estilos.nomeAnuncio} numberOfLines={2}>
                    {item.nome}
                  </Text>
                  <Text style={estilos.precoAnuncio}>
                    {formatarDinheiro(item.preco)}
                  </Text>
                  <Text style={estilos.descricaoAnuncio} numberOfLines={2}>
                    {item.descricao}
                  </Text>

                  <Pressable
                    style={estilos.botaoRemover}
                    onPress={() => confirmarRemocao(item)}
                  >
                    <Ionicons
                      name="checkmark-done-outline"
                      size={16}
                      color={CORES.vermelho}
                    />
                    <Text style={estilos.textoBotaoRemover}>
                      Vendido · Remover anúncio
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={estilos.container}>
          <Pressable style={estilos.caixaFoto} onPress={selecionarEComprimir}>
            {fotoComprimida ? (
              <Image
                source={{ uri: fotoComprimida.uri }}
                style={estilos.imagemPrevia}
              />
            ) : (
              <View style={estilos.placeholderFoto}>
                <Ionicons name="camera-outline" size={34} color={CORES.cinza} />
                <Text style={estilos.textoFoto}>
                  {comprimindo
                    ? 'Comprimindo imagem...'
                    : 'Selecionar foto do produto'}
                </Text>
              </View>
            )}
          </Pressable>

          {fotoComprimida && (
            <View style={estilos.avisoCompressao}>
              <Text style={estilos.tituloCompressao}>
                Compressão aplicada com sucesso
              </Text>
              <Text style={estilos.detalheCompressao}>
                Original: {fotoComprimida.originalKB} KB → Comprimida:{' '}
                {fotoComprimida.comprimidaKB} KB (-{fotoComprimida.economia}%)
              </Text>
            </View>
          )}

          <Text style={estilos.rotulo}>Nome do produto</Text>
          <TextInput
            style={estilos.input}
            placeholder="Ex: Fone Bluetooth Sem Fio"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={estilos.rotulo}>Preço (R$)</Text>
          <TextInput
            style={estilos.input}
            placeholder="Ex: 149,90"
            keyboardType="decimal-pad"
            value={precoTexto}
            onChangeText={setPrecoTexto}
          />

          <Text style={estilos.rotulo}>Descrição</Text>
          <TextInput
            style={[estilos.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Detalhes do produto..."
            multiline
            value={descricao}
            onChangeText={setDescricao}
          />

          <Pressable style={estilos.botaoPublicar} onPress={enviarAnuncio}>
            <Text style={estilos.textoPublicar}>Publicar anúncio</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  barraSubAbas: {
    flexDirection: 'row',
    backgroundColor: CORES.branco,
    borderBottomWidth: 1,
    borderBottomColor: CORES.linha,
  },
  subAba: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subAbaAtiva: {
    borderBottomColor: CORES.laranja,
  },
  textoSubAba: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.cinza,
  },
  textoSubAbaAtiva: {
    color: CORES.laranja,
    fontWeight: '700',
  },
  container: { padding: 14, flexGrow: 1 },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  textoVazio: {
    color: CORES.cinza,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  cartaoAnuncio: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: CORES.branco,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: CORES.linha,
    marginBottom: 10,
  },
  miniaturaAnuncio: {
    width: 88,
    height: 88,
    borderRadius: 4,
    backgroundColor: '#EEEEEE',
  },
  linhaTopoAnuncio: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  seloAtivo: {
    backgroundColor: CORES.verdeClaro,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoSeloAtivo: {
    color: CORES.verde,
    fontSize: 11,
    fontWeight: '700',
  },
  nomeAnuncio: {
    fontSize: 15,
    fontWeight: '700',
    color: CORES.texto,
  },
  precoAnuncio: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.laranja,
    marginTop: 2,
  },
  descricaoAnuncio: {
    fontSize: 12,
    color: CORES.cinza,
    marginTop: 3,
  },
  botaoRemover: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: CORES.vermelho,
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  textoBotaoRemover: {
    color: CORES.vermelho,
    fontSize: 13,
    fontWeight: '700',
  },
  caixaFoto: {
    height: 180,
    backgroundColor: CORES.branco,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: CORES.linha,
    overflow: 'hidden',
    marginBottom: 10,
  },
  placeholderFoto: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  textoFoto: { color: CORES.cinza, fontSize: 14 },
  imagemPrevia: { width: '100%', height: '100%' },
  avisoCompressao: {
    backgroundColor: CORES.verdeClaro,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  tituloCompressao: { color: CORES.verde, fontWeight: '700', fontSize: 13 },
  detalheCompressao: { color: CORES.texto, fontSize: 12, marginTop: 2 },
  rotulo: { fontSize: 13, color: CORES.cinza, marginTop: 10, marginBottom: 4 },
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
  botaoPublicar: {
    marginTop: 18,
    backgroundColor: CORES.laranja,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  textoPublicar: { color: CORES.branco, fontWeight: '700', fontSize: 16 },
});