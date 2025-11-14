// Configuration
const API_BASE = '/api';
let apiKey = localStorage.getItem('apiKey') || '';

// DOM Elements
const recipesSection = document.getElementById('recipesSection');
const usersSection = document.getElementById('usersSection');
const recipesGrid = document.getElementById('recipesGrid');
const usersTable = document.getElementById('usersTable');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const loading = document.getElementById('loading');
const recipesTab = document.getElementById('recipesTab');
const usersTab = document.getElementById('usersTab');
const apiKeyAlert = document.getElementById('apiKeyAlert');

// Helper Functions
const showLoading = () => loading.classList.remove('d-none');
const hideLoading = () => loading.classList.add('d-none');
const showApiKeyAlert = () => apiKeyAlert?.classList.remove('d-none');
const hideApiKeyAlert = () => apiKeyAlert?.classList.add('d-none');

function promptForApiKey() {
    const key = prompt('Enter your API key to access user management:');
    if (key) {
        apiKey = key;
        localStorage.setItem('apiKey', key);
        hideApiKeyAlert();
        loadUsers();
    }
}

// Simple Fetch Helper
async function fetchAPI(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (apiKey && url.includes('/users')) headers['x-api-key'] = apiKey;
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401 || response.status === 403) {
        if (url.includes('/users')) throw new Error('API_KEY_REQUIRED');
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Request failed');
    }
    return response.status === 204 ? null : response.json();
}

// Navigation
recipesTab.addEventListener('click', (e) => {
    e.preventDefault();
    recipesSection.classList.remove('d-none');
    usersSection.classList.add('d-none');
    recipesTab.classList.add('active');
    usersTab.classList.remove('active');
    loadRecipes();
});

usersTab.addEventListener('click', (e) => {
    e.preventDefault();
    recipesSection.classList.add('d-none');
    usersSection.classList.remove('d-none');
    recipesTab.classList.remove('active');
    usersTab.classList.add('active');
    loadUsers();
});

// ==================== RECIPES ====================

async function loadRecipes(searchQuery = '') {
    showLoading();
    try {
        const url = searchQuery ? `${API_BASE}/recipes?search=${searchQuery}` : `${API_BASE}/recipes`;
        const recipes = await fetchAPI(url);
        displayRecipes(recipes);
    } catch (error) {
        recipesGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Failed to load recipes: ${error.message}
                </div>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

function displayRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
        recipesGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle fa-3x mb-3"></i>
                    <h4>No recipes found</h4>
                    <p>Try a different search term</p>
                </div>
            </div>
        `;
        return;
    }
    
    recipesGrid.innerHTML = recipes.map(recipe => `
        <div class="col">
            <div class="card recipe-card" onclick="showRecipeDetails('${recipe.id}')">
                <div class="position-relative">
                    <img src="${recipe.image}" class="recipe-card-img" alt="${recipe.name}"
                         onerror="this.src='https://via.placeholder.com/300x220?text=No+Image'">
                    <span class="recipe-badge">${recipe.category || 'Recipe'}</span>
                </div>
                <div class="recipe-card-body">
                    <h5 class="recipe-title">${recipe.name}</h5>
                    <p class="recipe-area mb-2">
                        <i class="fas fa-globe-americas"></i> ${recipe.area || 'International'}
                    </p>
                    ${recipe.tags && recipe.tags.length > 0 ? `
                        <div class="mt-2">
                            ${recipe.tags.slice(0, 2).map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

async function showRecipeDetails(id) {
    try {
        const recipe = await fetchAPI(`${API_BASE}/recipes/${id}`);
        
        document.getElementById('recipeModalTitle').textContent = recipe.name || 'Recipe';
        document.getElementById('recipeModalBody').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'}" 
                         class="recipe-modal-img mb-3" alt="${recipe.name}"
                         onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3">Recipe Information</h5>
                    <p><strong><i class="fas fa-tag"></i> Category:</strong> ${recipe.category || 'N/A'}</p>
                    <p><strong><i class="fas fa-globe"></i> Cuisine:</strong> ${recipe.area || 'N/A'}</p>
                    ${recipe.tags && recipe.tags.length > 0 ? `
                        <p><strong><i class="fas fa-hashtag"></i> Tags:</strong> ${recipe.tags.join(', ')}</p>
                    ` : ''}
                    ${recipe.youtube ? `
                        <a href="${recipe.youtube}" target="_blank" class="btn btn-danger mb-3">
                            <i class="fab fa-youtube"></i> Watch on YouTube
                        </a>
                    ` : ''}
                </div>
            </div>
            <hr class="my-4">
            <h5 class="mb-3"><i class="fas fa-list-ul"></i> Ingredients</h5>
            <div class="ingredient-list mb-4">
                ${recipe.ingredients && recipe.ingredients.length > 0 
                    ? recipe.ingredients.map(ing => `
                        <div class="ingredient-item">
                            <span class="ingredient-name">${ing.ingredient || 'Unknown'}</span>
                            <span class="ingredient-measure">${ing.measure || ''}</span>
                        </div>
                    `).join('')
                    : '<p class="text-muted p-3">No ingredients listed</p>'
                }
            </div>
            <h5 class="mb-3"><i class="fas fa-book-open"></i> Instructions</h5>
            <div class="instructions-text">${recipe.instructions || 'No instructions available'}</div>
        `;
        
        new bootstrap.Modal(document.getElementById('recipeModal')).show();
    } catch (error) {
        console.error('Recipe details error:', error);
        alert(`Failed to load recipe: ${error.message}`);
    }
}

searchBtn.addEventListener('click', () => loadRecipes(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && loadRecipes(searchInput.value.trim()));

// Random Recipe Button
randomBtn.addEventListener('click', async () => {
    console.log('Random button clicked');
    showLoading();
    try {
        console.log('Fetching random recipe from:', `${API_BASE}/recipes/random`);
        const recipe = await fetchAPI(`${API_BASE}/recipes/random`);
        console.log('Random recipe received:', recipe);
        hideLoading();
        
        if (recipe && recipe.id) {
            showRecipeDetails(recipe.id);
        } else {
            throw new Error('Invalid recipe data received');
        }
    } catch (error) {
        hideLoading();
        console.error('Random recipe error:', error);
        alert(`Failed to load random recipe: ${error.message}`);
    }
});

// ==================== USERS ====================

async function loadUsers() {
    try {
        const users = await fetchAPI(`${API_BASE}/users`);
        hideApiKeyAlert();
        
        if (!users || users.length === 0) {
            usersTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-4">
                        <i class="fas fa-users fa-3x mb-3 d-block"></i>
                        <p>No users found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        usersTable.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.email || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="editUser(${user.id}, '${user.name}', '${user.email || ''}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="handleDeleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        if (error.message === 'API_KEY_REQUIRED') showApiKeyAlert();
        usersTable.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger py-4">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3 d-block"></i>
                    <p>Failed to load users: ${error.message}</p>
                    ${error.message === 'API_KEY_REQUIRED' ? '<p><small>Please set your API key in the browser console: localStorage.setItem("apiKey", "your-key")</small></p>' : ''}
                </td>
            </tr>
        `;
    }
}

document.getElementById('addUserBtn')?.addEventListener('click', () => {
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    new bootstrap.Modal(document.getElementById('userModal')).show();
});

function editUser(id, name, email) {
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    new bootstrap.Modal(document.getElementById('userModal')).show();
}

document.getElementById('saveUserBtn')?.addEventListener('click', async () => {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    if (!name) return alert('Name is required');
    
    try {
        const userData = { name, email };
        await fetchAPI(`${API_BASE}/users${id ? `/${id}` : ''}`, {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(userData)
        });
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        loadUsers();
    } catch (error) {
        if (error.message === 'API_KEY_REQUIRED') {
            alert('API key required. Please set it in console: localStorage.setItem("apiKey", "your-key")');
        } else {
            alert(`Failed to save user: ${error.message}`);
        }
    }
});

async function handleDeleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        await fetchAPI(`${API_BASE}/users/${id}`, { method: 'DELETE' });
        loadUsers();
    } catch (error) {
        alert(`Failed to delete user: ${error.message}`);
    }
}

// Initialize
loadRecipes();
console.log('%c🍕 Recipe App Ready!', 'color: #e74c3c; font-size: 16px; font-weight: bold;');
console.log('%c🔑 API Key:', 'color: #3498db; font-weight: bold;', apiKey ? '✅ Set' : '❌ Not set');
if (!apiKey) {
    console.log('%cTo set API key:', 'color: #f39c12; font-weight: bold;', 'localStorage.setItem("apiKey", "your-key")');
}