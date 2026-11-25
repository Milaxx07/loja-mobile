const URL_BASE_API = 'https://dummyjson.com/products';
const COTACAO_BRL = 5.45;

export const CATEGORIAS_LOJA = [
  { chave: 'Todos', rotulo: 'Todos' },
  { chave: 'smartphones', rotulo: 'Celulares' },
  { chave: 'laptops', rotulo: 'Notebooks' },
  { chave: 'fragrances', rotulo: 'Perfumes' },
  { chave: 'furniture', rotulo: 'Móveis' },
  { chave: 'sunglasses', rotulo: 'Óculos' },
];

const NOMES_CATEGORIAS_PT = {
  smartphones: 'Celulares',
  laptops: 'Notebooks',
  fragrances: 'Perfumes',
  furniture: 'Móveis',
  sunglasses: 'Óculos',
  beauty: 'Beleza',
  groceries: 'Mercado',
  'home-decoration': 'Decoração',
  'kitchen-accessories': 'Cozinha',
  'mens-shirts': 'Camisas Masculinas',
  'mens-shoes': 'Calçados Masculinos',
  'mens-watches': 'Relógios Masculinos',
  'mobile-accessories': 'Acessórios de Celular',
  'sports-accessories': 'Esportes',
  tablets: 'Tablets',
  tops: 'Blusas',
  'womens-bags': 'Bolsas Femininas',
  'womens-dresses': 'Vestidos',
  'womens-jewellery': 'Joias',
  'womens-shoes': 'Calçados Femininos',
  'womens-watches': 'Relógios Femininos',
};

const DICIONARIO_BUSCA_API = {
  celular: 'phone',
  celulares: 'phone',
  telefone: 'phone',
  notebook: 'laptop',
  notebooks: 'laptop',
  computador: 'laptop',
  perfume: 'eau',
  perfumes: 'eau',
  colonia: 'eau',
  sofa: 'sofa',
  sofá: 'sofa',
  cama: 'bed',
  cadeira: 'chair',
  mesa: 'table',
  oculos: 'glasses',
  óculos: 'glasses',
  batom: 'lipstick',
  mascara: 'mascara',
  máscara: 'mascara',
  maca: 'apple',
  maçã: 'apple',
  relogio: 'watch',
  relógio: 'watch',
  tenis: 'shoe',
  tênis: 'shoe',
  sapato: 'shoe',
  bolsa: 'bag',
  fone: 'earphones',
  carregador: 'charger',
};

const CATALOGO_PORTUGUES = {
  1: {
    nome: 'Máscara de Cílios Essence Lash Princess Volume',
    descricao:
      'Máscara de cílios com efeito volume e alongamento intenso. Escova cônica de alta precisão que define fio a fio sem formar grumos.',
  },
  2: {
    nome: 'Paleta de Sombras 9 Cores com Espelho Integrado',
    descricao:
      'Paleta compacta com tons neutros e cintilantes de alta pigmentação, textura aveludada e espelho interno para retoques práticos.',
  },
  3: {
    nome: 'Pó Facial Translúcido Solto Velvet Touch',
    descricao:
      'Pó facial ultrafino que controla o brilho excessivo ao longo do dia e sela a maquiagem com acabamento natural e toque seco.',
  },
  4: {
    nome: 'Batom Vermelho Cremoso Clássico Alta Cobertura',
    descricao:
      'Batom de acabamento cremoso com pigmentação intensa desde a primeira aplicação e fórmula hidratante que não resseca os lábios.',
  },
  5: {
    nome: 'Esmalte Vermelho Intenso Efeito Gel 10ml',
    descricao:
      'Esmalte de secagem rápida com brilho espelhado de longa duração e pincel anatômico para aplicação uniforme.',
  },
  6: {
    nome: 'Perfume Calvin Klein CK One Eau de Toilette 100ml',
    descricao:
      'Fragrância unissex cítrica aromática leve e refrescante, com notas de bergamota, chá verde, jasmim e almíscar branco.',
  },
  7: {
    nome: 'Perfume Chanel Coco Noir Eau de Parfum 100ml',
    descricao:
      'Fragrância feminina sofisticada e envolvente com acordes amadeirados, notas de toranja, rosa, jasmim e patchouli.',
  },
  8: {
    nome: "Perfume Dior J'adore Eau de Parfum 100ml",
    descricao:
      'Perfume feminino floral luminoso que combina essências de ylang-ylang, rosa damascena e jasmim grandiflorum.',
  },
  9: {
    nome: 'Perfume Dolce & Gabbana Dolce Shine Eau de Parfum 75ml',
    descricao:
      'Fragrância floral frutada radiante com notas vibrantes de manga, toranja, jasmim e madeiras claras.',
  },
  10: {
    nome: 'Perfume Gucci Bloom Eau de Parfum 100ml',
    descricao:
      'Perfume feminino floral branco marcante elaborado com extrato natural de tuberosa, jasmim sambac e rangoon creeper.',
  },
  11: {
    nome: 'Cama de Casal Clássica Estofada Annibale Colombo',
    descricao:
      'Cama de casal com estrutura reforçada em madeira maciça, cabeceira estofada de acabamento artesanal e design clássico.',
  },
  12: {
    nome: 'Sofá 3 Lugares em Couro Natural Annibale Colombo',
    descricao:
      'Sofá amplo revestido em couro legítimo de alta resistência, assentos com espuma de alta densidade e pés em madeira.',
  },
  13: {
    nome: 'Mesa de Cabeceira em Madeira Cerejeira com Gaveta',
    descricao:
      'Criado-mudo compacto produzido em madeira cerejeira africana, com gaveta deslizante e nicho inferior organizador.',
  },
  14: {
    nome: 'Cadeira Executiva Ergonômica Knoll Saarinen',
    descricao:
      'Cadeira de escritório e conferência com concha anatômica estofada, apoio para braços e base giratória em alumínio.',
  },
  15: {
    nome: 'Gabinete de Banheiro em Madeira com Cuba e Espelho',
    descricao:
      'Conjunto completo para banheiro com gabinete suspenso resistente à umidade, cuba cerâmica integrada e espelheira.',
  },
  16: {
    nome: 'Maçã Gala Fresca Selecionada (Pacote 1kg)',
    descricao:
      'Maçãs gala frescas, crocantes e naturalmente doces, colhidas e selecionadas para consumo in natura ou sucos.',
  },
  17: {
    nome: 'Contrafilé Bovino Resfriado em Bifes (1kg)',
    descricao:
      'Corte nobre de contrafilé bovino macio e suculento, embalado a vácuo para preservar o frescor e o sabor.',
  },
  18: {
    nome: 'Ração Seca Premium para Gatos Adultos 3kg',
    descricao:
      'Alimento completo balanceado com proteínas selecionadas, taurina e minerais que auxiliam na saúde do trato urinário.',
  },
  19: {
    nome: 'Filé de Peito de Frango sem Osso Congelado (1kg)',
    descricao:
      'Filés de peito de frango limpos, sem pele e sem osso, práticos para grelhar, assar ou desfiar no dia a dia.',
  },
  20: {
    nome: 'Óleo de Soja Refinado Tipo 1 Garrafa 900ml',
    descricao:
      'Óleo vegetal refinado leve e versátil para frituras, refogados e preparos culinários diários.',
  },
  21: {
    nome: 'Pepino Japonês Fresco Selecionado (500g)',
    descricao:
      'Pepinos frescos de casca fina e textura crocante, ideais para saladas, conservas e pratos frios.',
  },
  22: {
    nome: 'Ração Seca Premium para Cães Adultos 10kg',
    descricao:
      'Nutrição completa para cães adultos de todos os portes, rica em ômega 3 e 6 para pelagem saudável e digestão equilibrada.',
  },
  23: {
    nome: 'Ovos Brancos Grandes Selecionados (Bandeja 12 un.)',
    descricao:
      'Ovos brancos frescos de granja, classificados e acondicionados em embalagem protetora com 12 unidades.',
  },
  24: {
    nome: 'Postas de Salmão Fresco Selecionado (800g)',
    descricao:
      'Postas altas de salmão rico em ômega 3, prontas para grelhar, assar ou preparar receitas orientais.',
  },
  25: {
    nome: 'Pimentão Verde Fresco Selecionado (500g)',
    descricao:
      'Pimentões verdes firmes e aromáticos, ideais para refogados, recheios, saladas e molhos caseiros.',
  },
  26: {
    nome: 'Pimenta Verde Fresca Aromática (200g)',
    descricao:
      'Pimentas verdes frescas de picância equilibrada para realçar temperos, molhos e pratos regionais.',
  },
  27: {
    nome: 'Mel Silvestre Puro Orgânico Pote de Vidro 500g',
    descricao:
      'Mel de abelhas 100% puro, sem adição de açúcares ou conservantes, extraído de floradas silvestres.',
  },
  28: {
    nome: 'Sorvete Cremoso Napolitano Pote 1,5 Litro',
    descricao:
      'Sorvete cremoso nos sabores chocolate, morango e creme, ideal para sobremesas em família.',
  },
  29: {
    nome: 'Suco de Laranja 100% Integral Garrafa 1 Litro',
    descricao:
      'Suco de laranja pasteurizado sem adição de açúcar, água ou conservantes, com sabor natural da fruta.',
  },
  30: {
    nome: 'Kiwi Verde Fresco Importado (Bandeja 600g)',
    descricao:
      'Kiwis frescos ricos em vitamina C e fibras, com polpa suculenta e equilíbrio entre doçura e acidez.',
  },
  78: {
    nome: 'Notebook Apple MacBook Pro 14" Chip M3 Cinza-Espacial',
    descricao:
      'Notebook profissional com tela Liquid Retina XDR de 14,2 polegadas, 16GB de memória unificada, SSD de 512GB e bateria de longa duração.',
  },
  79: {
    nome: 'Notebook Asus Zenbook Pro Duo Tela Dupla OLED 15.6"',
    descricao:
      'Notebook de alto desempenho com tela principal 4K OLED, segunda tela sensível ao toque ScreenPad Plus, processador Intel Core i7 e 16GB RAM.',
  },
  80: {
    nome: 'Notebook Huawei MateBook X Pro 13.9" Ultrafino',
    descricao:
      'Ultrabook leve em corpo metálico com tela FullView 3K sensível ao toque, 16GB de RAM, SSD NVMe de 512GB e leitor biométrico.',
  },
  81: {
    nome: 'Notebook Conversível 2 em 1 Lenovo Yoga 920 13.9"',
    descricao:
      'Notebook conversível com dobradiça 360 graus, tela Full HD touchscreen, processador Intel Core i7, 16GB de RAM e SSD de 512GB.',
  },
  82: {
    nome: 'Notebook Dell XPS 13 9300 Tela Infinita Full HD+',
    descricao:
      'Notebook compacto premium construído em alumínio usinado e fibra de carbono, tela InfinityEdge de 13,4", Intel Core i7 e 16GB RAM.',
  },
  121: {
    nome: 'Smartphone Apple iPhone 5s 32GB Prateado Desbloqueado',
    descricao:
      'Smartphone compacto com tela Retina de 4 polegadas, sensor biométrico Touch ID, câmera iSight de 8MP e corpo em alumínio.',
  },
  122: {
    nome: 'Smartphone Apple iPhone 6 64GB Cinza-Espacial',
    descricao:
      'Smartphone com tela Retina HD de 4,7 polegadas, chip A8, câmera de 8MP com gravação em Full HD e desbloqueio por digital.',
  },
  123: {
    nome: 'Smartphone Apple iPhone 13 Pro 256GB Grafite',
    descricao:
      'Smartphone com tela Super Retina XDR ProMotion de 120Hz, chip A15 Bionic, sistema de câmera tripla Pro e conectividade 5G.',
  },
  124: {
    nome: 'Smartphone Apple iPhone X 64GB Tela OLED Prateado',
    descricao:
      'Smartphone com tela Super Retina OLED de 5,8 polegadas sem bordas, reconhecimento facial Face ID e câmera dupla de 12MP.',
  },
  125: {
    nome: 'Smartphone Oppo A57 64GB 4GB RAM Dual Chip Preto',
    descricao:
      'Smartphone com tela HD+ de 6,56 polegadas, bateria de 5000mAh com carregamento rápido de 33W e som estéreo duplo.',
  },
  126: {
    nome: 'Smartphone Oppo F19 Pro+ 5G 128GB 8GB RAM',
    descricao:
      'Smartphone 5G fino e leve com tela Super AMOLED de 6,43 polegadas, câmera quádrupla de 48MP e carregamento ultrarrápido.',
  },
  127: {
    nome: 'Smartphone Oppo K1 64GB Tela AMOLED Azul',
    descricao:
      'Smartphone com tela Super AMOLED de 6,4 polegadas, leitor de digitais integrado sob o display e câmera frontal de 25MP.',
  },
  128: {
    nome: 'Smartphone Realme C35 128GB 4GB RAM Câmera 50MP',
    descricao:
      'Smartphone com design ultrafino, tela Full HD+ de 6,6 polegadas, câmera principal de 50MP com IA e bateria de 5000mAh.',
  },
  129: {
    nome: 'Smartphone Realme X 128GB 8GB RAM Tela AMOLED',
    descricao:
      'Smartphone com tela AMOLED de 6,53 polegadas sem entalhe, câmera frontal retrátil pop-up e sensor traseiro Sony de 48MP.',
  },
  130: {
    nome: 'Smartphone Realme XT 128GB 8GB RAM Câmera 64MP',
    descricao:
      'Smartphone equipado com câmera quádrupla de 64MP, processador Snapdragon 712, tela Super AMOLED e carregamento VOOC 3.0.',
  },
  131: {
    nome: 'Smartphone Samsung Galaxy S7 32GB Preto',
    descricao:
      'Smartphone resistente à água (IP68) com tela Super AMOLED Quad HD de 5,1 polegadas, câmera Dual Pixel de 12MP e carregamento sem fio.',
  },
  132: {
    nome: 'Smartphone Samsung Galaxy S8 64GB Tela Infinita',
    descricao:
      'Smartphone com display infinito Super AMOLED curvo de 5,8 polegadas, leitor de íris e digital, câmera de 12MP e proteção IP68.',
  },
  133: {
    nome: 'Smartphone Samsung Galaxy S10 128GB 8GB RAM Branco',
    descricao:
      'Smartphone com tela Dynamic AMOLED de 6,1 polegadas, leitor ultrassônico na tela, câmera tripla ultra-wide e compartilhamento de bateria.',
  },
  134: {
    nome: 'Smartphone Vivo S1 128GB 6GB RAM Azul',
    descricao:
      'Smartphone com tela Super AMOLED de 6,38 polegadas, desbloqueio biométrico na tela, câmera frontal de 32MP e bateria de 4500mAh.',
  },
  135: {
    nome: 'Smartphone Vivo V9 64GB 4GB RAM Preto',
    descricao:
      'Smartphone com tela FullView de 6,3 polegadas, câmera dupla traseira com modo retrato e selfie de 24MP com inteligência artificial.',
  },
  136: {
    nome: 'Smartphone Vivo X21 128GB 6GB RAM Preto',
    descricao:
      'Smartphone com acabamento em vidro 3D, tela Super AMOLED de 6,28 polegadas, leitor biométrico integrado e câmera dupla de 12MP.',
  },
  154: {
    nome: 'Óculos de Sol Clássico Armação Preta Lentes UV400',
    descricao:
      'Óculos de sol unissex com armação leve em acetato preto fosco e lentes escuras com proteção total contra raios UVA e UVB.',
  },
  155: {
    nome: 'Óculos de Sol Retrô Tartaruga Lentes Polarizadas',
    descricao:
      'Óculos de sol estilo clássico com acabamento tartaruga, dobradiças metálicas reforçadas e lentes polarizadas antirreflexo.',
  },
  156: {
    nome: 'Óculos de Sol Esportivo Verde e Preto UV400',
    descricao:
      'Óculos de sol leve com hastes anatômicas antiderrapantes, ideal para atividades ao ar livre, corrida e direção.',
  },
  157: {
    nome: 'Óculos de Sol Estilizado Festas e Eventos',
    descricao:
      'Óculos de design moderno e despojado com armação resistente e lentes coloridas com proteção solar UV.',
  },
  158: {
    nome: 'Óculos de Sol Aviador Clássico Proteção UV',
    descricao:
      'Óculos de sol modelo aviador com estrutura metálica fina, apoio nasal ajustável e lentes degradê com filtro solar.',
  },
};

const TERMOS_FALLBACK_PT = [
  [/\bStainless Steel\b/gi, 'em Aço Inox'],
  [/\bBamboo\b/gi, 'de Bambu'],
  [/\bWooden\b/gi, 'de Madeira'],
  [/\bElectric\b/gi, 'Elétrico'],
  [/\bDigital\b/gi, 'Digital'],
  [/\bWireless\b/gi, 'Sem Fio'],
  [/\bBluetooth\b/gi, 'Bluetooth'],
  [/\bSmart Watch\b/gi, 'Relógio Inteligente Smartwatch'],
  [/\bWatch\b/gi, 'Relógio'],
  [/\bHeadphones\b/gi, 'Fones de Ouvido'],
  [/\bEarphones\b/gi, 'Fones de Ouvido'],
  [/\bCharger\b/gi, 'Carregador'],
  [/\bPower Bank\b/gi, 'Carregador Portátil Power Bank'],
  [/\bBackpack\b/gi, 'Mochila'],
  [/\bHandbag\b/gi, 'Bolsa'],
  [/\bBag\b/gi, 'Bolsa'],
  [/\bShoes\b/gi, 'Tênis'],
  [/\bSneakers\b/gi, 'Tênis Casual'],
  [/\bShirt\b/gi, 'Camisa'],
  [/\bDress\b/gi, 'Vestido'],
  [/\bLamp\b/gi, 'Luminária'],
  [/\bPlant\b/gi, 'Planta Decorativa'],
  [/\bVase\b/gi, 'Vaso Decorativo'],
  [/\bFrame\b/gi, 'Porta-Retrato'],
  [/\bPan\b/gi, 'Frigideira'],
  [/\bPot\b/gi, 'Panela'],
  [/\bKnife\b/gi, 'Faca'],
  [/\bSpoon\b/gi, 'Colher'],
  [/\bFork\b/gi, 'Garfo'],
  [/\bPlate\b/gi, 'Prato'],
  [/\bCup\b/gi, 'Xícara'],
  [/\bBottle\b/gi, 'Garrafa'],
  [/\bToaster\b/gi, 'Torradeira'],
  [/\bBlender\b/gi, 'Liquidificador'],
  [/\bKettle\b/gi, 'Chaleira'],
  [/\bFootball\b/gi, 'Bola de Futebol'],
  [/\bBasketball\b/gi, 'Bola de Basquete'],
  [/\bTennis\b/gi, 'Tênis'],
  [/\bBlack\b/gi, 'Preto'],
  [/\bWhite\b/gi, 'Branco'],
  [/\bRed\b/gi, 'Vermelho'],
  [/\bBlue\b/gi, 'Azul'],
  [/\bGreen\b/gi, 'Verde'],
  [/\bSilver\b/gi, 'Prateado'],
  [/\bGold\b/gi, 'Dourado'],
];

function traduzirTextoFallback(textoOriginal) {
  let resultado = String(textoOriginal || '');
  for (const [padrao, substituicao] of TERMOS_FALLBACK_PT) {
    resultado = resultado.replace(padrao, substituicao);
  }
  return resultado;
}

function traduzirCategoria(chaveCategoria) {
  return NOMES_CATEGORIAS_PT[chaveCategoria] || 'Diversos';
}

function traduzirTermoBuscaParaApi(termoDigitado) {
  const normalizado = termoDigitado.trim().toLowerCase();
  if (!normalizado) return '';
  return DICIONARIO_BUSCA_API[normalizado] || normalizado;
}

export async function buscarProdutosApi({
  pular = 0,
  limite = 10,
  termoBusca = '',
  categoria = 'Todos',
}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 8000);

  try {
    let url = `${URL_BASE_API}?limit=${limite}&skip=${pular}`;

    if (termoBusca.trim()) {
      const consultaApi = traduzirTermoBuscaParaApi(termoBusca);
      url = `${URL_BASE_API}/search?q=${encodeURIComponent(
        consultaApi
      )}&limit=${limite}&skip=${pular}`;
    } else if (categoria !== 'Todos') {
      url = `${URL_BASE_API}/category/${encodeURIComponent(
        categoria
      )}?limit=${limite}&skip=${pular}`;
    }

    const resposta = await fetch(url, { signal: controlador.signal });
    if (!resposta.ok) {
      throw new Error(`Erro na API (status ${resposta.status}).`);
    }

    const json = await resposta.json();

    const produtosFormatados = json.products.map((item) => {
      const precoAtual = Number((item.price * COTACAO_BRL).toFixed(2));
      const percentual = item.discountPercentage || 12;
      const precoAntigo = Number((precoAtual / (1 - percentual / 100)).toFixed(2));
      const traducaoExata = CATALOGO_PORTUGUES[item.id];
      const categoriaPt = traduzirCategoria(item.category);

      const nomePortugues = traducaoExata
        ? traducaoExata.nome
        : traduzirTextoFallback(item.title);

      const descricaoPortuguesa = traducaoExata
        ? traducaoExata.descricao
        : `${nomePortugues} da categoria ${categoriaPt}. Produto selecionado com garantia de qualidade, envio rápido e nota fiscal.`;

      return {
        id: String(item.id),
        nome: nomePortugues,
        preco: precoAtual,
        precoAntigo,
        categoria: categoriaPt,
        avaliacao: Number(item.rating.toFixed(1)),
        vendidos: item.stock * 7 + 14,
        descricao: descricaoPortuguesa,
        imagem: item.thumbnail,
      };
    });

    return {
      produtos: produtosFormatados,
      total: json.total,
    };
  } catch (erro) {
    if (erro.name === 'AbortError') {
      throw new Error('A conexão demorou demais. Verifique sua internet.');
    }
    throw new Error(erro.message || 'Falha ao carregar os produtos.');
  } finally {
    clearTimeout(temporizador);
  }
}