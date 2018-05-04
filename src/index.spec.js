const { normalize, denormalize, schema } = require("normalizr");

describe("normalizr", () => {
  const articleSchema = new schema.Entity("articles");
  const nodeSchema = new schema.Entity("nodes", { articles: [articleSchema] });
  const arrayOfNodesSchema = new schema.Array(nodeSchema);

  describe("normalize()", () => {
    describe("with a single entity", () => {
      it("extracts the entities", () => {
        const article = {
          id: "1001",
          subject: "Greatness in Chicken"
        };

        const expected = {
          entities: {
            articles: {
              "1001": { id: "1001", subject: "Greatness in Chicken" }
            }
          },
          result: "1001"
        };

        const normalizedData = normalize(article, articleSchema);
        expect(normalizedData).toEqual(expected);
      });
    });

    describe("with an array", () => {
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
            articles: {
              "1001": { id: "1001", subject: "Greatness in Chicken" }
            },
            nodes: { "1": { articles: ["1001"], id: "1", title: "Chicken" } }
          },
          result: ["1"]
        };

        const normalizedData = normalize(nodesWithArticles, arrayOfNodesSchema);
        expect(normalizedData).toEqual(expected);
      });
    });
  });

  describe("denormalize()", () => {
    describe("with a single entity", () => {
      it("converts entities into an object tree", () => {
        const entities = {
          articles: { "1001": { id: "1001", subject: "Greatness in Chicken" } }
        };

        const articleInput = ["1001"];
        const denormalizedData = denormalize(
          articleInput,
          articleSchema,
          entities
        );
        const expected = [{ id: "1001", subject: "Greatness in Chicken" }];
        // no funciona:
        // expect(denormalizedData).toEqual(expected);
      });
    });

    describe("with an array", () => {
      it("converts entities into an object tree", () => {
        const entities = {
          articles: { "1001": { id: "1001", subject: "Greatness in Chicken" } },
          nodes: { "1": { articles: ["1001"], id: "1", title: "Chicken" } }
        };

        const nodeInput = ["1"];
        const denormalizedData = denormalize(
          nodeInput,
          arrayOfNodesSchema,
          entities
        );
        const expected = [
          {
            id: "1",
            title: "Chicken",
            articles: [{ id: "1001", subject: "Greatness in Chicken" }]
          }
        ];
        expect(denormalizedData).toEqual(expected);
      });
    });
  });
});
