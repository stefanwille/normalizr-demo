import { normalize, schema } from "normalizr";

describe("normalizr", () => {
  describe("normalize()", () => {
    const article = schema.Entity("articles");
    const node = schema.Entity("nodes", {
      articles: article
    });

    it("extracts the entities", () => {
      const nodesWithArticles = [
        {
          id: 1,
          title: "Chicken",
          articles: [
            {
              id: 1001,
              subject: "Greatness in Chicken"
            }
          ]
        }
      ];

      const result = normalize(nodesWithArticles, node);
      expect(result).toEqual([]);
    });
  });
});
