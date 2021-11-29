const getDecimals = (num) => {
  const decimalSplitChar = ".";
  const numAsString = num.toString();
  const splitNumber = numAsString.split(decimalSplitChar);
  if (splitNumber.length === 1) return 0;
  return splitNumber[1].length;
};

const defaultCurrency = "ARS";

export const itemMapper = (item) => {
  const amount = item.prices.prices.find(
    (p) => p.currency_id === defaultCurrency
  ).amount;
  const decimals = getDecimals(amount);
  return {
    id: item.id,
    title: item.title,
    price: {
      currency: defaultCurrency,
      amount,
      decimals,
    },
    picture: item.thumbnail,
    condition: item.condition,
    free_shipping: item.shipping.free_shipping,
  };
};
export const itemDetailMapper = (item) => ({
  id: item.id,
  title: item.title,
  price: {
    currency: item.currency_id,
    amount: item.price,
    decimals: getDecimals(item.price),
  },
  pictures: item.pictures.map((p) => p.secure_url),
  condition: item.condition,
  free_shipping: item.shipping.free_shipping_flag,
  sold_quantity: item.sold_quantity,
});
