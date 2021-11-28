const externalApis = {
  itemSearch: (query) =>
    `https://api.mercadolibre.com/sites/MLA/search?q=${query}`,
  itemById: (id) => `https://api.mercadolibre.com/items/${id}`,
  itemDetailById: (id) =>
    `https://api.mercadolibre.com/items/${id}/description`,
  categoryById: (id) => `https://api.mercadolibre.com/categories/${id}`,
};

export default externalApis;
