/**
 * Dicionário centralizado de seletores DOM do Google Maps.
 * Facilita manutenção isolada caso o Google altere nomes de classes.
 */
export const MapsSelectors = {
  // Container principal com scroll do feed de resultados
  feedContainer: 'div[role="feed"]',

  // Cards individuais de cada estabelecimento na lista
  resultCard: 'div.Nv2PK',

  // Link e título principal do card
  cardLink: 'a.hfpxzc',
  cardTitle: 'div.qBF1Pd',

  // Avaliações: nota em estrelas e quantidade de reviews
  ratingText: 'span.MW4etd',
  reviewCountText: 'span.UY7F9',

  // Container de dados complementares (categoria, endereço, telefone, site)
  infoContainer: 'div.W4Efsd',

  // Links externos (website, redes sociais)
  externalLink: 'a.lcr4fd',

  // Elemento que sinaliza o final dos resultados na região
  endOfFeedNotice: 'div.HlvSq'
} as const;
