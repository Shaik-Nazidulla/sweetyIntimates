// src/utils/categoryUtils.js

/**
 * Convert a category name to URL-friendly slug
 * @param {string} name - Category name
 * @returns {string} - URL slug
 */
export const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Convert a URL slug back to a searchable format
 * @param {string} slug - URL slug
 * @returns {string} - Searchable name
 */
export const slugToName = (slug) => {
  return slug
    .replace(/-/g, ' ')
    .toLowerCase();
};

/**
 * Find category by slug or ID from categories array
 * @param {Array} categories - Array of categories
 * @param {string} identifier - Category slug or ID
 * @returns {Object|null} - Found category or null
 */
export const findCategoryByIdentifier = (categories, identifier) => {
  if (!categories || !identifier) return null;
  
  return categories.find(category => 
    category._id === identifier ||
    createSlug(category.name) === identifier ||
    category.name.toLowerCase() === identifier.toLowerCase()
  );
};

/**
 * Find subcategory by slug or ID from subcategories array
 * @param {Array} subcategories - Array of subcategories
 * @param {string} identifier - Subcategory slug or ID
 * @returns {Object|null} - Found subcategory or null
 */
export const findSubcategoryByIdentifier = (subcategories, identifier) => {
  if (!subcategories || !identifier) return null;
  
  return subcategories.find(subcategory => 
    subcategory._id === identifier ||
    createSlug(subcategory.name) === identifier ||
    subcategory.name.toLowerCase() === identifier.toLowerCase()
  );
};

/**
 * Generate breadcrumb navigation items
 * @param {Object} category - Category object
 * @param {Object} subcategory - Subcategory object (optional)
 * @returns {Array} - Array of breadcrumb items
 */
export const generateBreadcrumbs = (category, subcategory = null) => {
  const breadcrumbs = [
    { label: 'Home', path: '/', active: false }
  ];
  
  if (category) {
    breadcrumbs.push({
      label: category.name,
      path: `/products/${createSlug(category.name)}`,
      active: !subcategory
    });
  }
  
  if (subcategory && category) {
    breadcrumbs.push({
      label: subcategory.name,
      path: `/products/${createSlug(category.name)}/${createSlug(subcategory.name)}`,
      active: true
    });
  }
  
  return breadcrumbs;
};

/**
 * Generate category navigation path
 * @param {Object} category - Category object
 * @returns {string} - Category path
 */
export const getCategoryPath = (category) => {
  if (!category) return '/products';
  return `/products/${createSlug(category.name)}`;
};

/**
 * Generate subcategory navigation path
 * @param {Object} category - Category object
 * @param {Object} subcategory - Subcategory object
 * @returns {string} - Subcategory path
 */
export const getSubcategoryPath = (category, subcategory) => {
  if (!category || !subcategory) return '/products';
  return `/products/${createSlug(category.name)}/${createSlug(subcategory.name)}`;
};

/**
 * Extract category and subcategory identifiers from URL params
 * @param {Object} params - URL parameters
 * @returns {Object} - Object with category and subcategory identifiers
 */
export const extractIdentifiersFromParams = (params) => {
  return {
    categoryIdentifier: params.category,
    subcategoryIdentifier: params.subcategory
  };
};

/**
 * Validate if a category exists in the categories array
 * @param {Array} categories - Array of categories
 * @param {string} identifier - Category identifier
 * @returns {boolean} - True if category exists
 */
export const categoryExists = (categories, identifier) => {
  return findCategoryByIdentifier(categories, identifier) !== null;
};

/**
 * Validate if a subcategory exists in the subcategories array
 * @param {Array} subcategories - Array of subcategories
 * @param {string} identifier - Subcategory identifier
 * @returns {boolean} - True if subcategory exists
 */
export const subcategoryExists = (subcategories, identifier) => {
  return findSubcategoryByIdentifier(subcategories, identifier) !== null;
};

/**
 * Format page title based on category and subcategory
 * @param {Object} category - Category object
 * @param {Object} subcategory - Subcategory object (optional)
 * @param {string} defaultTitle - Default title if no category/subcategory
 * @returns {string} - Formatted page title
 */
export const formatPageTitle = (category, subcategory, defaultTitle = 'Products') => {
  if (subcategory) {
    return `${subcategory.name} - ${category?.name || 'Products'}`;
  }
  
  if (category) {
    return `${category.name} Collection`;
  }
  
  return defaultTitle;
};

/**
 * Get SEO meta description based on category and subcategory
 * @param {Object} category - Category object
 * @param {Object} subcategory - Subcategory object (optional)
 * @returns {string} - SEO meta description
 */
export const getMetaDescription = (category, subcategory) => {
  if (subcategory && subcategory.description) {
    return subcategory.description;
  }
  
  if (category && category.description) {
    return category.description;
  }
  
  return 'Buy ladies’ lingerie online - premium bras, panties & nightwear. Affordable prices, discreet packaging & fast delivery across India.';
};