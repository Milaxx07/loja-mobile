import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '../tema/tokens';
import { atualizarPerfilUsuarioBanco } from '../banco/bancoDados';

function obterIniciais(nome) {
  const partes = String(nome || 'US')
    .trim()
    .split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function TelaPerfil({
  usuario,
  totalFavoritos,
  totalAnuncios,
  totalCarrinho,
  aoAtualizarUsuario,
  aoNavegarAba,
  aoAbrirMeusAnuncios,
  aoAbrirAutenticacao,
  aoSair,
}) {
  const [nomeEditado, setNomeEditado] = useState(usuario?.nome || '');
  const [telefoneEditado, setTelefoneEditado] = useState(usuario?.telefone || '');
  const [cepEditado, setCepEditado] = useState(usuario?.cep || '');
  const [enderecoEditado, setEnderecoEditado] = useState(usuario?.endereco || '');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNomeEditado(usuario?.nome || '');
    setTelefoneEditado(usuario?.telefone || '');
    setCepEditado(usuario?.cep || '');
    setEnderecoEditado(usuario?.endereco || '');
  }, [usuario]);

  if (!usuario) {
    return (
      <ScrollView contentContainerStyle={estilos.containerVisitante}>
        <View style={estilos.cartaoVisitante}>
          <View style={estilos.avatarVisitante}>
            <Ionicons name="person-outline" size={34} color={CORES.laranja} />
          </View>

          <Text style={estilos.tituloVisitante}>Você está navegando sem conta</Text>
          <Text style={estilos.descricaoVisitante}>
            Entre na sua conta ou cadastre-se gratuitamente para salvar favoritos,
            publicar anúncios e finalizar compras.
          </Text>

          <Pressable
            style={estilos.botaoEntrarVisitante}
            onPress={() => aoAbrirAutenticacao(false)}
          >
            <Ionicons name="log-in-outline" size={20} color={CORES.branco} />
            <Text style={estilos.textoBotaoSalvar}>Fazer login</Text>
          </Pressable>

          <Pressable
            style={estilos.botaoCriarContaVisitante}
            onPress={() => aoAbrirAutenticacao(true)}
          >
            <Ionicons name="person-add-outline" size={19} color={CORES.laranja} />
            <Text style={estilos.textoCriarContaVisitante}>Criar conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const salvarAlteracoes = async () => {
    if (nomeEditado.trim().length < 3) {
      Alert.alert('Nome inválido', 'Informe seu nome completo com pelo menos 3 letras.');
      return;
    }

    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilUsuarioBanco({
        ...usuario,
        nome: nomeEditado,
        telefone: telefoneEditado,
        cep: cepEditado,
        endereco: enderecoEditado,
      });
      aoAtualizarUsuario(atualizado);
      Alert.alert('Perfil atualizado', 'Seus dados foram salvos no banco local.');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do perfil.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarSaida = () => {
    Alert.alert('Sair da conta', 'Deseja encerrar sua sessão atual?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: aoSair },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.cartaoUsuario}>
        <View style={estilos.avatar}>
          <Text style={estilos.textoAvatar}>{obterIniciais(usuario.nome)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={estilos.nomeUsuario}>{usuario.nome}</Text>
          <Text style={estilos.emailUsuario}>{usuario.email}</Text>
          <View style={estilos.seloVerificado}>
            <Ionicons name="checkmark-circle" size={14} color={CORES.verde} />
            <Text style={estilos.textoSelo}>Conta ativa no SQLite</Text>
          </View>
        </View>
      </View>

      <View style={estilos.gradeResumo}>
        <Pressable
          style={estilos.itemResumo}
          onPress={() => aoNavegarAba('favoritos')}
        >
          <Text style={estilos.numeroResumo}>{totalFavoritos}</Text>
          <Text style={estilos.rotuloResumo}>Favoritos</Text>
        </Pressable>

        <Pressable style={estilos.itemResumo} onPress={aoAbrirMeusAnuncios}>
          <Text style={estilos.numeroResumo}>{totalAnuncios}</Text>
          <Text style={estilos.rotuloResumo}>Anúncios</Text>
        </Pressable>

        <Pressable
          style={estilos.itemResumo}
          onPress={() => aoNavegarAba('carrinho')}
        >
          <Text style={estilos.numeroResumo}>{totalCarrinho}</Text>
          <Text style={estilos.rotuloResumo}>No carrinho</Text>
        </Pressable>
      </View>

      <View style={estilos.caixaFormulario}>
        <Text style={estilos.tituloSecao}>Dados pessoais e entrega padrão</Text>
        <Text style={estilos.subtituloSecao}>
          Essas informações preenchem automaticamente a finalização de compra.
        </Text>

        <Text style={estilos.rotulo}>Nome completo</Text>
        <TextInput
          style={estilos.input}
          value={nomeEditado}
          onChangeText={setNomeEditado}
          placeholder="Seu nome completo"
        />

        <Text style={estilos.rotulo}>Telefone / WhatsApp</Text>
        <TextInput
          style={estilos.input}
          value={telefoneEditado}
          onChangeText={setTelefoneEditado}
          keyboardType="phone-pad"
          placeholder="(91) 99999-9999"
        />

        <Text style={estilos.rotulo}>CEP</Text>
        <TextInput
          style={estilos.input}
          value={cepEditado}
          onChangeText={setCepEditado}
          keyboardType="number-pad"
          maxLength={9}
          placeholder="66000-000"
        />

        <Text style={estilos.rotulo}>Endereço e número</Text>
        <TextInput
          style={estilos.input}
          value={enderecoEditado}
          onChangeText={setEnderecoEditado}
          placeholder="Rua, número e bairro"
        />

        <Pressable
          style={[estilos.botaoSalvar, salvando && { opacity: 0.7 }]}
          onPress={salvarAlteracoes}
          disabled={salvando}
        >
          <Text style={estilos.textoBotaoSalvar}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </Text>
        </Pressable>
      </View>

      <Pressable style={estilos.botaoSair} onPress={confirmarSaida}>
        <Ionicons name="log-out-outline" size={20} color={CORES.vermelho} />
        <Text style={estilos.textoBotaoSair}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 24,
  },
  containerVisitante: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  cartaoVisitante: {
    backgroundColor: CORES.branco,
    borderRadius: 8,
    padding: 22,
    borderWidth: 1,
    borderColor: CORES.linha,
    alignItems: 'center',
  },
  avatarVisitante: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: CORES.laranjaClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tituloVisitante: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.texto,
    textAlign: 'center',
  },
  descricaoVisitante: {
    fontSize: 13,
    color: CORES.cinza,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 18,
  },
  botaoEntrarVisitante: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: CORES.laranja,
    borderRadius: 4,
    paddingVertical: 13,
    marginBottom: 10,
  },
  botaoCriarContaVisitante: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: CORES.laranja,
    backgroundColor: CORES.laranjaClaro,
    borderRadius: 4,
    paddingVertical: 12,
  },
  textoCriarContaVisitante: {
    color: CORES.laranja,
    fontWeight: '700',
    fontSize: 15,
  },
  cartaoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CORES.branco,
    padding: 14,
    borderRadius: 4,
    marginBottom: 10,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAvatar: {
    fontSize: 20,
    fontWeight: '800',
    color: CORES.texto,
  },
  nomeUsuario: {
    fontSize: 17,
    fontWeight: '700',
    color: CORES.texto,
  },
  emailUsuario: {
    fontSize: 13,
    color: CORES.cinza,
    marginTop: 2,
  },
  seloVerificado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  textoSelo: {
    fontSize: 12,
    color: CORES.verde,
    fontWeight: '600',
  },
  gradeResumo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  itemResumo: {
    flex: 1,
    backgroundColor: CORES.branco,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  numeroResumo: {
    fontSize: 19,
    fontWeight: '800',
    color: CORES.laranja,
  },
  rotuloResumo: {
    fontSize: 12,
    color: CORES.cinza,
    marginTop: 2,
  },
  caixaFormulario: {
    backgroundColor: CORES.branco,
    padding: 14,
    borderRadius: 4,
    marginBottom: 12,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.texto,
  },
  subtituloSecao: {
    fontSize: 12,
    color: CORES.cinza,
    marginTop: 2,
    marginBottom: 6,
  },
  rotulo: {
    fontSize: 13,
    color: CORES.cinza,
    marginTop: 10,
    marginBottom: 4,
  },
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
  botaoSalvar: {
    marginTop: 16,
    backgroundColor: CORES.laranja,
    borderRadius: 4,
    paddingVertical: 13,
    alignItems: 'center',
  },
  textoBotaoSalvar: {
    color: CORES.branco,
    fontWeight: '700',
    fontSize: 15,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.vermelho,
    borderRadius: 4,
    paddingVertical: 12,
  },
  textoBotaoSair: {
    color: CORES.vermelho,
    fontWeight: '700',
    fontSize: 15,
  },
});