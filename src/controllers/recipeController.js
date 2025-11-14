import * as recipeService from "../services/recipeService.js";

export const getRecipes = (req, res) => {
	res.json(recipeService.getAllRecipes());
};

export const getRecipe = (req, res) => {
	const recipe = recipeService.getRecipeById(req.params.id);
	if (!recipe) return res.status(404).json({ message: "Recipe not found" });

	res.json(recipe);
};

export const createRecipe = (req, res) => {
	const newRecipe = recipeService.createRecipe(req.body);
	res.status(201).json(newRecipe);
};

export const updateRecipe = (req, res) => {
	const updated = recipeService.updateRecipe(req.params.id, req.body);
	if (!updated) return res.status(404).json({ message: "Recipe not found" });

	res.json(updated);
};

export const deleteRecipe = (req, res) => {
	const deleted = recipeService.deleteRecipe(req.params.id);
	if (!deleted) return res.status(404).json({ message: "Recipe not found" });

	res.status(204).send();
};
