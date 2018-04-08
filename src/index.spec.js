const { normalize, denormalize, schema } = require("normalizr");

describe("normalizr", () => {
  const article = new schema.Entity("articles");
  const node = new schema.Entity("nodes", { articles: [article] });
  const arrayOfNodes = new schema.Array(node);

  describe("normalize()", () => {
    it("extracts the entities", () => {
      const nodesWithArticles = [
        {
          id: "1",
          title: "Chicken",
          articles: [
            {
              id: "1001",
              subject: "Greatness in Chicken"
            }
          ]
        }
      ];

      const expected = {
        entities: {
          articles: { "1001": { id: "1001", subject: "Greatness in Chicken" } },
          nodes: { "1": { articles: ["1001"], id: "1", title: "Chicken" } }
        },
        result: ["1"]
      };

      const normalizedData = normalize(nodesWithArticles, arrayOfNodes);
      expect(normalizedData).toEqual(expected);
    });
  });

  describe("denormalize()", () => {
    it("converts entities into an object tree", () => {
      const entities = {
        articles: { "1001": { id: "1001", subject: "Greatness in Chicken" } },
        nodes: { "1": { articles: ["1001"], id: "1", title: "Chicken" } }
      };

      const nodeInput = ["1"];
      const expected = [
        {
          articles: [{ id: "1001", subject: "Greatness in Chicken" }],
          id: "1",
          title: "Chicken"
        }
      ];
      const denormalizedData = denormalize(nodeInput, arrayOfNodes, entities);
      expect(denormalizedData).toEqual(expected);
    });
  });
});
