import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '../tema/tokens';
import {
  autenticarUsuarioBanco,
  registrarUsuarioBanco,
} from '../banco/bancoDados';

export function TelaLogin({
  modoInicialCadastro = false,
  aoAutenticar,
  aoVerSomenteProdutos,
}) {
  const { width: larguraTela } = useWindowDimensions();
  const larguraCartao = Math.min(larguraTela - 32, 440);

  const [modoCadastro, setModoCadastro] = useState(modoInicialCadastro);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    setModoCadastro(modoInicialCadastro);
    setMensagemErro('');
  }, [modoInicialCadastro]);

  const alternarModo = (novoModoCadastro) => {
    setModoCadastro(novoModoCadastro);
    setMensagemErro('');
    setConfirmarSenha('');
  };

  const validarCampos = () => {
    if (modoCadastro && nomeCompleto.trim().length < 3) {
      return 'Informe seu nome completo (mínimo 3 letras).';
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return 'Informe um endereço de e-mail válido.';
    }
    if (senha.length < 4) {
      return 'A senha deve ter pelo menos 4 caracteres.';
    }
    if (modoCadastro && senha !== confirmarSenha) {
      return 'As senhas digitadas não coincidem.';
    }
    return '';
  };

  const lidarComEnvio = async () => {
    const erroValidacao = validarCampos();
    if (erroValidacao) {
      setMensagemErro(erroValidacao);
      return;
    }

    setMensagemErro('');
    setProcessando(true);
    try {
      const usuarioAutenticado = modoCadastro
        ? await registrarUsuarioBanco({
            nome: nomeCompleto,
            email,
            senha,
          })
        : await autenticarUsuarioBanco(email, senha);

      aoAutenticar(usuarioAutenticado);
    } catch (erro) {
      setMensagemErro(erro.message || 'Não foi possível concluir o acesso.');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <SafeAreaView style={estilos.safe}>
      <StatusBar backgroundColor={CORES.laranja} barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.rolagem}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecalhoMarca}>
            <View style={estilos.circuloLogo}>
              <Ionicons name="sunny" size={32} color={CORES.laranja} />
            </View>
            <Text style={estilos.nomeMarca}>LojaSol</Text>
            <Text style={estilos.subtituloMarca}>
              Ofertas todos os dias direto no seu celular
            </Text>
          </View>

          <View style={[estilos.cartaoAuth, { width: larguraCartao }]}>
            <View style={estilos.seletorAbas}>
              <Pressable
                style={[estilos.abaModo, !modoCadastro && estilos.abaModoAtiva]}
                onPress={() => alternarModo(false)}
              >
                <Text
                  style={[
                    estilos.textoAbaModo,
                    !modoCadastro && estilos.textoAbaModoAtiva,
                  ]}
                >
                  Entrar
                </Text>
              </Pressable>

              <Pressable
                style={[estilos.abaModo, modoCadastro && estilos.abaModoAtiva]}
                onPress={() => alternarModo(true)}
              >
                <Text
                  style={[
                    estilos.textoAbaModo,
                    modoCadastro && estilos.textoAbaModoAtiva,
                  ]}
                >
                  Criar conta
                </Text>
              </Pressable>
            </View>

            <Text style={estilos.tituloCartao}>
              {modoCadastro ? 'Crie sua conta grátis' : 'Bem-vindo de volta'}
            </Text>
            <Text style={estilos.descricaoCartao}>
              {modoCadastro
                ? 'Preencha seus dados para salvar favoritos, anúncios e pedidos.'
                : 'Acesse sua conta para gerenciar seu carrinho e seus anúncios.'}
            </Text>

            {modoCadastro && (
              <>
                <Text style={estilos.rotulo}>Nome completo</Text>
                <View style={estilos.campoEntrada}>
                  <Ionicons name="person-outline" size={18} color={CORES.cinza} />
                  <TextInput
                    style={estilos.input}
                    placeholder="Seu nome completo"
                    placeholderTextColor={CORES.cinza}
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                  />
                </View>
              </>
            )}

            <Text style={estilos.rotulo}>E-mail</Text>
            <View style={estilos.campoEntrada}>
              <Ionicons name="mail-outline" size={18} color={CORES.cinza} />
              <TextInput
                style={estilos.input}
                placeholder="voce@email.com"
                placeholderTextColor={CORES.cinza}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={estilos.rotulo}>Senha</Text>
            <View style={estilos.campoEntrada}>
              <Ionicons name="lock-closed-outline" size={18} color={CORES.cinza} />
              <TextInput
                style={estilos.input}
                placeholder="Digite sua senha"
                placeholderTextColor={CORES.cinza}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <Pressable
                onPress={() => setMostrarSenha((anterior) => !anterior)}
                hitSlop={8}
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={CORES.cinza}
                />
              </Pressable>
            </View>

            {modoCadastro && (
              <>
                <Text style={estilos.rotulo}>Confirmar senha</Text>
                <View style={estilos.campoEntrada}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={CORES.cinza}
                  />
                  <TextInput
                    style={estilos.input}
                    placeholder="Repita a senha"
                    placeholderTextColor={CORES.cinza}
                    secureTextEntry={!mostrarSenha}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                  />
                </View>
              </>
            )}

            {!!mensagemErro && (
              <View style={estilos.caixaErro}>
                <Ionicons name="alert-circle-outline" size={16} color={CORES.vermelho} />
                <Text style={estilos.textoErro}>{mensagemErro}</Text>
              </View>
            )}

            <Pressable
              style={[estilos.botaoPrincipal, processando && { opacity: 0.7 }]}
              onPress={lidarComEnvio}
              disabled={processando}
            >
              {processando ? (
                <ActivityIndicator color={CORES.branco} />
              ) : (
                <Text style={estilos.textoBotaoPrincipal}>
                  {modoCadastro ? 'Cadastrar e entrar' : 'Entrar na loja'}
                </Text>
              )}
            </Pressable>

            <View style={estilos.divisorOu}>
              <View style={estilos.linhaDivisor} />
              <Text style={estilos.textoOu}>ou</Text>
              <View style={estilos.linhaDivisor} />
            </View>

            <Pressable
              style={estilos.botaoSecundario}
              onPress={aoVerSomenteProdutos}
              disabled={processando}
            >
              <Ionicons name="storefront-outline" size={18} color={CORES.laranja} />
              <Text style={estilos.textoBotaoSecundario}>Ver somente produtos</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  rolagem: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cabecalhoMarca: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circuloLogo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nomeMarca: {
    fontSize: 26,
    fontWeight: '800',
    color: CORES.laranja,
  },
  subtituloMarca: {
    fontSize: 13,
    color: CORES.cinza,
    marginTop: 2,
  },
  cartaoAuth: {
    backgroundColor: CORES.branco,
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: CORES.linha,
  },
  seletorAbas: {
    flexDirection: 'row',
    backgroundColor: CORES.fundo,
    borderRadius: 6,
    padding: 4,
    marginBottom: 16,
  },
  abaModo: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 4,
  },
  abaModoAtiva: {
    backgroundColor: CORES.branco,
  },
  textoAbaModo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.cinza,
  },
  textoAbaModoAtiva: {
    color: CORES.laranja,
    fontWeight: '700',
  },
  tituloCartao: {
    fontSize: 19,
    fontWeight: '700',
    color: CORES.texto,
  },
  descricaoCartao: {
    fontSize: 13,
    color: CORES.cinza,
    marginTop: 4,
    marginBottom: 8,
  },
  rotulo: {
    fontSize: 13,
    color: CORES.cinza,
    marginTop: 10,
    marginBottom: 4,
  },
  campoEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: CORES.branco,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: CORES.texto,
  },
  caixaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
  },
  textoErro: {
    color: CORES.vermelho,
    fontSize: 13,
    flex: 1,
  },
  botaoPrincipal: {
    marginTop: 16,
    backgroundColor: CORES.laranja,
    borderRadius: 4,
    paddingVertical: 13,
    alignItems: 'center',
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontWeight: '700',
    fontSize: 15,
  },
  divisorOu: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: CORES.linha,
  },
  textoOu: {
    fontSize: 12,
    color: CORES.cinza,
  },
  botaoSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: CORES.laranja,
    backgroundColor: CORES.laranjaClaro,
    borderRadius: 4,
    paddingVertical: 11,
  },
  textoBotaoSecundario: {
    color: CORES.laranja,
    fontWeight: '700',
    fontSize: 14,
  },
});