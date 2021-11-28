import axios from "axios";
import debug from "debug";
import externalApis from "./externalApis.js";
import messageService from "./messageService.js";

const itemsServiceDebug = debug("app:itemsService");
const defaultCurrency = "ARS";
const itemMapper = (item) => {
  const amount = item.prices.prices.find(
    (p) => p.currency_id === defaultCurrency
  ).amount;
  return {
    id: item.id,
    title: item.title,
    price: {
      currency: defaultCurrency,
      amount,
      decimals: 0,
    },
    picture: item.thumbnail,
    condition: item.condition,
    free_shipping: item.shipping.free_shipping,
  };
};

function itemsService() {
  const getCategoryPath = async (categoryId) => {
    const callerName = "getCategories";
    try {
      const { data } = await axios.get(externalApis.categoryById(categoryId));
      return data.path_from_root;
    } catch (err) {
      itemsServiceDebug(messageService.error(callerName)(err));
    }
  };

  const getItemsBySearchQuery = async (query, maxResults) => {
    const callerName = "getItemsBySearchQuery";
    try {
      const {
        data: { results },
      } = await axios.get(externalApis.itemSearch(query));

      const truncatedResults = maxResults
        ? results.slice(0, maxResults)
        : results;

      const reducedResponse = truncatedResults.reduce(
        (sum, curr) => {
          if (!sum.categories.length) sum.categories.push(curr.category_id);
          sum.items.push(itemMapper(curr));
          return sum;
        },
        {
          author: { name: "", lastName: "" },
          categories: [],
          items: [],
        }
      );

      const categoryPath = await getCategoryPath(reducedResponse.categories[0]);
      reducedResponse.categories = categoryPath.map((c) => c.name);

      itemsServiceDebug(
        messageService.success(callerName)(
          `Fetched ${truncatedResults.length} items`
        )
      );

      return reducedResponse;
    } catch (err) {
      if (axios.isCancel(err)) {
        itemsServiceDebug(
          messageService.error(callerName)(err, "Request cancelled")
        );
      } else {
        itemsServiceDebug(messageService.error(callerName)(err));
      }
    }
  };

  const getDetailByItemId = async (id) => {
    try {
      const { data: item } = await axios.get(externalApis.itemById(id));
      const { data: itemDescription } = await axios.get(
        externalApis.itemDetailById(id)
      );
      itemsServiceDebug(
        "getDetailByItemId",
        JSON.stringify({ item, itemDescription })
      );
    } catch (err) {}
  };

  return {
    getCategories: getCategoryPath,
    getDetailByItemId,
    getItemsBySearchQuery,
  };
}

export default itemsService();
