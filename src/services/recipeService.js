// using json file provided in the data folder

import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/recipes.json");

export const getAllRecipes = () => {
	return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

export const getRecipeById = (id) => {
	const recipes = getAllRecipes();
	return recipes.find(r => r.id === Number(id));
};

export const createRecipe = (data) => {
	const recipes = getAllRecipes();

	const newRecipe = {
		id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
		...data
	};

	recipes.push(newRecipe);

	fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));

	return newRecipe;
};

export const updateRecipe = (id, data) => {
	const recipes = getAllRecipes();
	const index = recipes.findIndex(r => r.id === Number(id));
	if (index === -1) return null;

	recipes[index] = { ...recipes[index], ...data };

	fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));

	return recipes[index];
};

export const deleteRecipe = (id) => {
	const recipes = getAllRecipes();
	const updated = recipes.filter(r => r.id !== Number(id));

	if (updated.length === recipes.length) return false;

	fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
	return true;
};
