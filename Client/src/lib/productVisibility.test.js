import test from "node:test";
import assert from "node:assert/strict";

import {
  PUBLIC_PRODUCT_CATEGORIES,
  filterPublicProducts,
  isPublicProductCategory,
} from "./productVisibility.js";

test("public category list excludes hidden weapon categories", () => {
  assert.equal(isPublicProductCategory("Shastra (Weapons)"), false);
  assert.equal(isPublicProductCategory("Miniature Weapons"), false);
  assert.equal(isPublicProductCategory("Shilekhana (Weapon Vault)"), false);
  assert.equal(isPublicProductCategory("Frame Collection"), false);
  assert.equal(PUBLIC_PRODUCT_CATEGORIES.includes("Maharaj"), true);
  assert.equal(PUBLIC_PRODUCT_CATEGORIES.includes("Shastra (Weapons)"), false);
  assert.equal(PUBLIC_PRODUCT_CATEGORIES.includes("Frame Collection"), false);
});

test("public products exclude hidden weapon categories", () => {
  const products = [
    { id: "1", category: "Maharaj" },
    { id: "2", product_category: "Shastra (Weapons)" },
    { id: "3", category: "Miniature Weapons" },
    { id: "4", category: "Shilekhana (Weapon Vault)" },
    { id: "5", product_category: "Spiritual Statues" },
    { id: "6", product_category: "Frame Collection" },
  ];

  assert.deepEqual(
    filterPublicProducts(products).map((product) => product.id),
    ["1", "5"],
  );
});
