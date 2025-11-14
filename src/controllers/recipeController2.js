// with API
import * as recipeService from "../services/recipeMealDBService.js"; // ← Changed import

export const getRecipes = async (req, res) => {
    try {
        const { search, category } = req.query;
        
        let recipes;
        if (search) {
            recipes = await recipeService.searchRecipes(search);
        } else if (category) {
            recipes = await recipeService.getRecipesByCategory(category);
        } else {
            recipes = await recipeService.getAllRecipes();
        }
        
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.getRecipeById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRandomRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.getRandomRecipe();
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const newRecipe = await recipeService.createRecipe(req.body);
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const updated = await recipeService.updateRecipe(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const deleted = await recipeService.deleteRecipe(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};