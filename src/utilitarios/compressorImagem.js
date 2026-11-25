import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

async function obterTamanhoBytes(uri) {
  if (Platform.OS === 'web') {
    const resposta = await fetch(uri);
    const arquivoBlob = await resposta.blob();
    return arquivoBlob.size || 0;
  }
  const info = await FileSystem.getInfoAsync(uri);
  return info?.size || 0;
}

export async function comprimirFotoProduto(uriOriginal) {
  let bytesAntes = 0;
  try {
    bytesAntes = await obterTamanhoBytes(uriOriginal);
  } catch (erro) {}

  const manipulada = await ImageManipulator.manipulateAsync(
    uriOriginal,
    [{ resize: { width: 800 } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
  );

  let bytesDepois = 0;
  try {
    bytesDepois = await obterTamanhoBytes(manipulada.uri);
  } catch (erro) {}

  const originalKB = bytesAntes ? (bytesAntes / 1024).toFixed(1) : 'N/D';
  const comprimidaKB = bytesDepois ? (bytesDepois / 1024).toFixed(1) : 'N/D';
  const economia =
    bytesAntes > 0 && bytesDepois > 0
      ? Math.max(0, Math.round(((bytesAntes - bytesDepois) / bytesAntes) * 100))
      : 0;

  console.log(
    `[Compressão LojaSol] Original: ${originalKB} KB -> Comprimida: ${comprimidaKB} KB (-${economia}%)`
  );

  return {
    uri: manipulada.uri,
    originalKB,
    comprimidaKB,
    economia,
  };
}