// src/utils/categoryMapper.js
export const categoryNameToIdMap = {
  'bras': '68b550d2baaa97467a91403f', // Replace with actual category IDs from your API
  'panties': 'category-id-2',
  'sleep-lingerie': 'category-id-3',
  'apparel': 'category-id-4',
  'beauty': 'category-id-5',
  'clearance': 'category-id-6',
};

export const getCategoryIdByName = (categoryName) => {
  return categoryNameToIdMap[categoryName] || categoryName;
};