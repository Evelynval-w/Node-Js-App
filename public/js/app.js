const API_BASE = '/api';

// DOM Elements
const recipesContainer = document.getElementById('recipesContainer');
const usersContainer = document.getElementById('usersContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const loading = document.getElementById('loading');

// Navigation
document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show/hide sections
        if (page === 'recipes') {
            recipesContainer.classList.remove('d-none');
            usersContainer.classList.add('d-none');
            loadRecipes();
        } else if (page === 'users') {
            recipesContainer.classList.add('d-none');
            usersContainer.classList.remove('d-none');
            loadUsers();
        }
    });
});

// Load all recipes
async function loadRecipes(searchQuery = '') {
    showLoading();
    try {
        const url = searchQuery 
            ? `${API_BASE}/recipes?search=${searchQuery}`
            : `${API_BASE}/recipes`;
            
        const response = await fetch(url);
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        recipesContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">Failed to load recipes</div>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// Display recipes
function displayRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">No recipes found</div>
            </div>
        `;
        return;
    }
    
    recipesContainer.innerHTML = recipes.map(recipe => `
        <div class="col">
            <div class="card recipe-card" onclick="showRecipeDetails('${recipe.id}')">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                <span class="badge badge-category">${recipe.category || 'Recipe'}</span>
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <p class="card-text text-muted">
                        <i class="fas fa-map-marker-alt"></i> ${recipe.area || 'International'}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

// Show recipe details in modal
async function showRecipeDetails(id) {
    try {
        const response = await fetch(`${API_BASE}/recipes/${id}`);
        const recipe = await response.json();
        
        document.getElementById('recipeModalTitle').textContent = recipe.name;
        document.getElementById('recipeModalBody').innerHTML = `
            <img src="${recipe.image}" class="img-fluid rounded mb-3" alt="${recipe.name}">
            
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="fas fa-tag"></i> Category</h6>
                    <p>${recipe.category}</p>
                </div>
                <div class="col-md-6">
                    <h6><i class="fas fa-globe"></i> Cuisine</h6>
                    <p>${recipe.area}</p>
                </div>
            </div>
            
            <h6 class="mt-3"><i class="fas fa-list"></i> Ingredients</h6>
            <div class="ingredient-list">
                ${recipe.ingredients.map(ing => `
                    <div class="ingredient-item">
                        <strong>${ing.ingredient}</strong>: ${ing.measure}
                    </div>
                `).join('')}
            </div>
            
            <h6 class="mt-3"><i class="fas fa-book"></i> Instructions</h6>
            <p>${recipe.instructions}</p>
            
            ${recipe.youtube ? `
                <a href="${recipe.youtube}" target="_blank" class="btn btn-danger">
                    <i class="fab fa-youtube"></i> Watch on YouTube
                </a>
            ` : ''}
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading recipe details:', error);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const users = await response.json();
        
        document.getElementById('usersTable').innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>
                    <button class="btn btn-sm btn-primary">Edit</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Search recipes
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    loadRecipes(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        loadRecipes(query);
    }
});

// Random recipe
randomBtn.addEventListener('click', async () => {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/recipes/random`);
        const recipe = await response.json();
        showRecipeDetails(recipe.id);
    } catch (error) {
        console.error('Error loading random recipe:', error);
    } finally {
        hideLoading();
    }
});

// Loading helpers
function showLoading() {
    loading.classList.remove('d-none');
}

function hideLoading() {
    loading.classList.add('d-none');
}

// Initial load
loadRecipes();