export const PUBLIC_PRODUCT_CATEGORIES = [
  "Mavala",
  "Maharaj",
  "Miniatures",
  "Spiritual Statues",
  "Car Dashboard",
  "Symbolic & Cultural Artefacts",
  "Sanch",
  "Keychains",
  "Jewellery",
  "Historical Legends",
  "Badges",
  "Taxidermy",
];

const HIDDEN_PRODUCT_CATEGORIES = [
  "Shastra (Weapons)",
  "Shastra (Weopons)",
  "Miniature Weapons",
  "Miniature Weopons",
  "Shilekhana",
  "Shilekhana (Weapon Vault)",
  "Frame Collection",
];

export const normalizeProductCategory = (category) =>
  category
    ? category
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "")
    : "";

const hiddenCategoryKeys = new Set(
  HIDDEN_PRODUCT_CATEGORIES.map(normalizeProductCategory),
);

export const isPublicProductCategory = (category) =>
  !hiddenCategoryKeys.has(normalizeProductCategory(category));

export const filterPublicProducts = (products) =>
  products.filter((product) =>
    isPublicProductCategory(product.product_category || product.category),
  );
