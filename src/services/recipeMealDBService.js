// using an API

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Get all recipes (search for all meals)
export const getAllRecipes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/search.php?s=`);
        const data = await response.json();
        
        if (!data.meals) {
            return [];
        }
        
        // Transform MealDB format to simpler format
        return data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            image: meal.strMealThumb,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            youtube: meal.strYoutube,
            ingredients: getIngredients(meal)
        }));
    } catch (error) {
        throw new Error("Failed to fetch recipes from TheMealDB: " + error.message);
    }
};

// Get recipe by ID
export const getRecipeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
        const data = await response.json();
        
        if (!data.meals || data.meals.length === 0) {
            return null;
        }
        
        const meal = data.meals[0];
        return {
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            image: meal.strMealThumb,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            youtube: meal.strYoutube,
            ingredients: getIngredients(meal)
        };
    } catch (error) {
        throw new Error("Failed to fetch recipe from TheMealDB: " + error.message);
    }
};

// Search recipes by name
export const searchRecipes = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/search.php?s=${query}`);
        const data = await response.json();
        
        if (!data.meals) {
            return [];
        }
        
        return data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            image: meal.strMealThumb,
            tags: meal.strTags ? meal.strTags.split(',') : []
        }));
    } catch (error) {
        throw new Error("Failed to search recipes: " + error.message);
    }
};

// Get recipes by category
export const getRecipesByCategory = async (category) => {
    try {
        const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
        const data = await response.json();
        
        if (!data.meals) {
            return [];
        }
        
        return data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb
        }));
    } catch (error) {
        throw new Error("Failed to fetch recipes by category: " + error.message);
    }
};

// Get random recipe
export const getRandomRecipe = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/random.php`);
        const data = await response.json();
        
        if (!data.meals || data.meals.length === 0) {
            return null;
        }
        
        const meal = data.meals[0];
        return {
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            image: meal.strMealThumb,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            youtube: meal.strYoutube,
            ingredients: getIngredients(meal)
        };
    } catch (error) {
        throw new Error("Failed to fetch random recipe: " + error.message);
    }
};

// Helper function to extract ingredients from MealDB format
function getIngredients(meal) {
    const ingredients = [];
    
    // MealDB has ingredients in strIngredient1-20 and measures in strMeasure1-20
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure ? measure.trim() : ''
            });
        }
    }
    
    return ingredients;
}

// Note: TheMealDB is read-only, these would need your own database
export const createRecipe = async (data) => {
    throw new Error("TheMealDB API is read-only. Cannot create recipes.");
};

export const updateRecipe = async (id, data) => {
    throw new Error("TheMealDB API is read-only. Cannot update recipes.");
};

export const deleteRecipe = async (id) => {
    throw new Error("TheMealDB API is read-only. Cannot delete recipes.");
};