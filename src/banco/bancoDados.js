import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let bancoLocal = null;

export async function iniciarBancoDados() {
  if (Platform.OS === 'web') return;

  bancoLocal = await SQLite.openDatabaseAsync('lojasol.db');
  await bancoLocal.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS carrinho (
      id TEXT PRIMARY KEY NOT NULL,
      dados_json TEXT NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS favoritos (
      id TEXT PRIMARY KEY NOT NULL,
      dados_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS produtos_anunciados (
      id TEXT PRIMARY KEY NOT NULL,
      dados_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      email TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL,
      telefone TEXT DEFAULT '',
      cep TEXT DEFAULT '',
      endereco TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS sessao_atual (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email_usuario TEXT NOT NULL
    );
  `);
}

export async function registrarUsuarioBanco({ nome, email, senha }) {
  const emailLimpo = email.trim().toLowerCase();
  const novoUsuario = {
    nome: nome.trim(),
    email: emailLimpo,
    senha,
    telefone: '',
    cep: '',
    endereco: '',
  };

  if (Platform.OS === 'web') {
    const listaUsuarios = JSON.parse(localStorage.getItem('lojasol_usuarios') || '[]');
    if (listaUsuarios.some((u) => u.email === emailLimpo)) {
      throw new Error('Este e-mail já está cadastrado.');
    }
    listaUsuarios.push(novoUsuario);
    localStorage.setItem('lojasol_usuarios', JSON.stringify(listaUsuarios));
    localStorage.setItem('lojasol_sessao', emailLimpo);
    const { senha: _, ...dadosPublicos } = novoUsuario;
    return dadosPublicos;
  }

  const existente = await bancoLocal.getFirstAsync(
    'SELECT email FROM usuarios WHERE email = ?',
    [emailLimpo]
  );
  if (existente) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  await bancoLocal.runAsync(
    'INSERT INTO usuarios (email, nome, senha, telefone, cep, endereco) VALUES (?, ?, ?, ?, ?, ?)',
    [emailLimpo, novoUsuario.nome, senha, '', '', '']
  );
  await bancoLocal.runAsync(
    'INSERT OR REPLACE INTO sessao_atual (id, email_usuario) VALUES (1, ?)',
    [emailLimpo]
  );

  const { senha: _, ...dadosPublicos } = novoUsuario;
  return dadosPublicos;
}

export async function autenticarUsuarioBanco(email, senha) {
  const emailLimpo = email.trim().toLowerCase();

  if (Platform.OS === 'web') {
    const listaUsuarios = JSON.parse(localStorage.getItem('lojasol_usuarios') || '[]');
    const encontrado = listaUsuarios.find(
      (u) => u.email === emailLimpo && u.senha === senha
    );
    if (!encontrado) {
      throw new Error('E-mail ou senha incorretos.');
    }
    localStorage.setItem('lojasol_sessao', emailLimpo);
    const { senha: _, ...dadosPublicos } = encontrado;
    return dadosPublicos;
  }

  const encontrado = await bancoLocal.getFirstAsync(
    'SELECT email, nome, telefone, cep, endereco FROM usuarios WHERE email = ? AND senha = ?',
    [emailLimpo, senha]
  );
  if (!encontrado) {
    throw new Error('E-mail ou senha incorretos.');
  }

  await bancoLocal.runAsync(
    'INSERT OR REPLACE INTO sessao_atual (id, email_usuario) VALUES (1, ?)',
    [emailLimpo]
  );
  return encontrado;
}

export async function buscarUsuarioLogadoBanco() {
  if (Platform.OS === 'web') {
    const emailSessao = localStorage.getItem('lojasol_sessao');
    if (!emailSessao) return null;
    const listaUsuarios = JSON.parse(localStorage.getItem('lojasol_usuarios') || '[]');
    const encontrado = listaUsuarios.find((u) => u.email === emailSessao);
    if (!encontrado) return null;
    const { senha: _, ...dadosPublicos } = encontrado;
    return dadosPublicos;
  }

  const sessao = await bancoLocal.getFirstAsync(
    'SELECT email_usuario FROM sessao_atual WHERE id = 1'
  );
  if (!sessao?.email_usuario) return null;

  const usuario = await bancoLocal.getFirstAsync(
    'SELECT email, nome, telefone, cep, endereco FROM usuarios WHERE email = ?',
    [sessao.email_usuario]
  );
  return usuario || null;
}

export async function atualizarPerfilUsuarioBanco(usuarioAtualizado) {
  const emailLimpo = usuarioAtualizado.email.trim().toLowerCase();

  if (Platform.OS === 'web') {
    const listaUsuarios = JSON.parse(localStorage.getItem('lojasol_usuarios') || '[]');
    const atualizada = listaUsuarios.map((u) =>
      u.email === emailLimpo ? { ...u, ...usuarioAtualizado } : u
    );
    localStorage.setItem('lojasol_usuarios', JSON.stringify(atualizada));
    return usuarioAtualizado;
  }

  await bancoLocal.runAsync(
    'UPDATE usuarios SET nome = ?, telefone = ?, cep = ?, endereco = ? WHERE email = ?',
    [
      usuarioAtualizado.nome.trim(),
      usuarioAtualizado.telefone.trim(),
      usuarioAtualizado.cep.trim(),
      usuarioAtualizado.endereco.trim(),
      emailLimpo,
    ]
  );
  return usuarioAtualizado;
}

export async function encerrarSessaoBanco() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('lojasol_sessao');
    return;
  }
  await bancoLocal.runAsync('DELETE FROM sessao_atual WHERE id = 1');
}

export async function carregarEstadoBanco() {
  if (Platform.OS === 'web') {
    return {
      carrinho: JSON.parse(localStorage.getItem('lojasol_carrinho') || '{}'),
      favoritos: JSON.parse(localStorage.getItem('lojasol_favoritos') || '{}'),
      anunciados: JSON.parse(localStorage.getItem('lojasol_anunciados') || '[]'),
    };
  }

  const linhasCarrinho = await bancoLocal.getAllAsync('SELECT * FROM carrinho');
  const carrinho = {};
  for (const linha of linhasCarrinho) {
    carrinho[linha.id] = {
      produto: JSON.parse(linha.dados_json),
      quantidade: linha.quantidade,
    };
  }

  const linhasFavoritos = await bancoLocal.getAllAsync('SELECT * FROM favoritos');
  const favoritos = {};
  for (const linha of linhasFavoritos) {
    favoritos[linha.id] = JSON.parse(linha.dados_json);
  }

  const linhasAnunciados = await bancoLocal.getAllAsync(
    'SELECT * FROM produtos_anunciados ORDER BY rowid DESC'
  );
  const anunciados = linhasAnunciados.map((linha) => JSON.parse(linha.dados_json));

  return { carrinho, favoritos, anunciados };
}

export async function salvarItemCarrinhoBanco(produto, quantidade) {
  const idTexto = String(produto.id);

  if (Platform.OS === 'web') {
    const atual = JSON.parse(localStorage.getItem('lojasol_carrinho') || '{}');
    if (quantidade <= 0) delete atual[idTexto];
    else atual[idTexto] = { produto, quantidade };
    localStorage.setItem('lojasol_carrinho', JSON.stringify(atual));
    return;
  }

  if (quantidade <= 0) {
    await bancoLocal.runAsync('DELETE FROM carrinho WHERE id = ?', [idTexto]);
  } else {
    await bancoLocal.runAsync(
      'INSERT OR REPLACE INTO carrinho (id, dados_json, quantidade) VALUES (?, ?, ?)',
      [idTexto, JSON.stringify(produto), quantidade]
    );
  }
}

export async function limparCarrinhoBanco() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('lojasol_carrinho');
    return;
  }
  await bancoLocal.runAsync('DELETE FROM carrinho');
}

export async function alternarFavoritoBanco(produto, jaFavoritado) {
  const idTexto = String(produto.id);

  if (Platform.OS === 'web') {
    const atual = JSON.parse(localStorage.getItem('lojasol_favoritos') || '{}');
    if (jaFavoritado) delete atual[idTexto];
    else atual[idTexto] = produto;
    localStorage.setItem('lojasol_favoritos', JSON.stringify(atual));
    return;
  }

  if (jaFavoritado) {
    await bancoLocal.runAsync('DELETE FROM favoritos WHERE id = ?', [idTexto]);
  } else {
    await bancoLocal.runAsync(
      'INSERT OR REPLACE INTO favoritos (id, dados_json) VALUES (?, ?)',
      [idTexto, JSON.stringify(produto)]
    );
  }
}

export async function salvarAnuncioBanco(produto) {
  const idTexto = String(produto.id);

  if (Platform.OS === 'web') {
    const lista = JSON.parse(localStorage.getItem('lojasol_anunciados') || '[]');
    lista.unshift(produto);
    localStorage.setItem('lojasol_anunciados', JSON.stringify(lista));
    return;
  }

  await bancoLocal.runAsync(
    'INSERT OR REPLACE INTO produtos_anunciados (id, dados_json) VALUES (?, ?)',
    [idTexto, JSON.stringify(produto)]
  );
}

export async function removerAnuncioBanco(idProduto) {
  const idTexto = String(idProduto);

  if (Platform.OS === 'web') {
    const lista = JSON.parse(localStorage.getItem('lojasol_anunciados') || '[]');
    const filtrada = lista.filter((item) => String(item.id) !== idTexto);
    localStorage.setItem('lojasol_anunciados', JSON.stringify(filtrada));
    return;
  }

  await bancoLocal.runAsync('DELETE FROM produtos_anunciados WHERE id = ?', [idTexto]);
}