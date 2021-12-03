import axios from "axios";
import debug from "debug";
import { itemDetailMapper, itemMapper } from "../Utils/utilFunctions.js";
import externalApis from "./externalApis.js";
import messageService from "./messageService.js";
import author from "../Utils/author.js";

const itemsServiceDebug = debug("app:itemsService");

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
          author,
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
    const callerName = "getDetailByItemId";
    try {
      const { data: item } = await axios.get(externalApis.itemById(id));
      const {
        data: { plain_text: itemDescription },
      } = await axios.get(externalApis.itemDetailById(id));
      itemsServiceDebug(messageService.success(callerName)("Fetched items"));
      return {
        author,
        item: {
          ...itemDetailMapper(item),
          description: itemDescription,
        },
      };
    } catch (err) {
      itemsServiceDebug(messageService.error(callerName)(err));
    }
  };

  return {
    getCategoryPath,
    getDetailByItemId,
    getItemsBySearchQuery,
  };
}

export default itemsService();
