/**
 * Models Page Specific JavaScript
 * Handles fetching, filtering, sorting, and displaying models.
 */

// Only import what's necessary - currentLanguage might be needed for date formatting later
import { currentLanguage } from './i18n.js';

// --- Mock Data (Replace with actual API call) ---
const allModels = [
    {
        id: 'sdxl-turbo',
        name: 'SDXL-Turbo',
        platform: 'Stability AI',
        description: 'Lightning-fast text-to-image generation based on Stable Diffusion XL.',
        likes: 4800,
        runs: 125000,
        dateAdded: '2024-04-15',
        category: 'Image Generation',
        tags: ['Image Generation', 'Real-time', 'Stable Diffusion'],
        logo: 'img/stability-logo.svg'
    },
    {
        id: 'mixtral-8x7b',
        name: 'Mixtral-8x7B',
        platform: 'Hugging Face',
        description: 'High-quality sparse mixture of experts language model (SMoE).',
        likes: 3200,
        runs: 89000,
        dateAdded: '2024-04-10',
        category: 'Text Generation',
        tags: ['Text Generation', 'LLM', 'Open Source'],
        logo: 'img/huggingface-logo.svg'
    },
    {
        id: 'stable-audio',
        name: 'Stable Audio',
        platform: 'Stability AI',
        description: 'Generate high-quality stereo music and sound effects from text prompts.',
        likes: 2100,
        runs: 45000,
        dateAdded: '2024-04-05',
        category: 'Audio Generation',
        tags: ['Audio Generation', 'Music', 'Sound Effects'],
        logo: 'img/stability-logo.svg'
    },
    {
        id: 'llama-3-70b',
        name: 'Llama 3 70B',
        platform: 'Replicate',
        description: 'Meta\'s latest large language model, instruction-tuned.',
        likes: 5500,
        runs: 150000,
        dateAdded: '2024-04-18',
        category: 'Text Generation',
        tags: ['LLM', 'Instruction-Tuned', 'Meta'],
        logo: 'img/replicate-logo.svg' // Assuming Replicate hosts it
    },
    {
        id: 'stable-diffusion-3',
        name: 'Stable Diffusion 3',
        platform: 'Stability AI',
        description: 'Next generation text-to-image model with improved prompt following.',
        likes: 6000,
        runs: 95000,
        dateAdded: '2024-03-20',
        category: 'Image Generation',
        tags: ['Image Generation', 'Diffusion', 'New'],
        logo: 'img/stability-logo.svg'
    },
    {
        id: 'whisper-large-v3',
        name: 'Whisper Large v3',
        platform: 'OpenAI',
        description: 'State-of-the-art speech-to-text transcription model.',
        likes: 4000,
        runs: 110000,
        dateAdded: '2024-02-15',
        category: 'Audio Processing',
        tags: ['Speech-to-Text', 'Transcription', 'OpenAI'],
        logo: 'img/openai-logo.png' // Placeholder logo
    },
    {
        id: 'wan2.1',
        name: 'Wan2.1',
        platform: 'Replicate',
        description: 'Specialized video generation supporting various styles.',
        likes: 3200,
        runs: 80000,
        dateAdded: '2024-02-10',
        category: 'Video Generation',
        tags: ['Video Generation', 'Animation'],
        logo: 'img/replicate-logo.svg'
    },
    // Add more mock models...
];

// --- DOM Elements ---
const newlyAddedContainer = document.querySelector('#new-models .models-preview-container');
const trendingContainer = document.querySelector('#trending-models .models-preview-container');
const popularContainer = document.querySelector('#popular-models .models-preview-container');
const modelCardTemplate = document.getElementById('model-card-template');

const purposeFilter = document.getElementById('purpose-filter');
const platformFilter = document.getElementById('platform-filter');
const sortFilter = document.getElementById('sort-filter');

// --- Functions ---

/**
 * Creates an HTML element for a single model card.
 * @param {object} model - The model data object.
 * @returns {HTMLElement} - The model card element.
 */
function createModelCard(model) {
    if (!modelCardTemplate) return null;

    const card = modelCardTemplate.content.cloneNode(true).querySelector('.model-card');
    card.dataset.modelId = model.id;

    const logo = card.querySelector('.platform-logo');
    const date = card.querySelector('.model-date');
    const title = card.querySelector('.model-title');
    const description = card.querySelector('.model-description');
    const runs = card.querySelector('.metric.runs span');
    const likes = card.querySelector('.metric.likes span');
    const tagsContainer = card.querySelector('.model-tags');
    const compareBtn = card.querySelector('.add-to-comparison-btn');

    if (logo) logo.src = model.logo || 'img/platform-placeholder.svg'; // Use placeholder if no logo
    if (logo) logo.alt = `${model.platform || 'Unknown'} Logo`;
    if (date) date.textContent = `Added ${new Date(model.dateAdded).toLocaleDateString()}`;
    if (title) title.textContent = model.name;
    if (description) description.textContent = model.description;
    if (runs) runs.textContent = formatMetric(model.runs);
    if (likes) likes.textContent = formatMetric(model.likes);

    if (tagsContainer && model.tags) {
        tagsContainer.innerHTML = ''; // Clear existing
        model.tags.slice(0, 3).forEach(tag => { // Show max 3 tags
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
    }

    if (compareBtn) {
        compareBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering card click if any
            addToComparison(model.id);
        });
    }

    // Add click listener to the card itself (optional)
    card.addEventListener('click', () => {
        // Navigate to model detail page (implementation needed)
        console.log(`Navigate to details for model: ${model.id}`);
        // window.location.href = `/models/${model.id}`; 
    });

    return card;
}

/**
 * Populates a container with model cards.
 * @param {HTMLElement} container - The container element.
 * @param {Array<object>} models - Array of model objects.
 * @param {number} limit - Maximum number of models to display.
 */
function populateModelContainer(container, models, limit = 3) {
    if (!container) return;
    container.innerHTML = ''; // Clear previous content
    models.slice(0, limit).forEach(model => {
        const card = createModelCard(model);
        if (card) {
            container.appendChild(card);
        }
    });
}

/**
 * Formats large numbers for display (e.g., 125000 -> 125K).
 * @param {number} num - The number to format.
 * @returns {string} - The formatted string.
 */
function formatMetric(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    } else {
        return num.toString();
    }
}

/**
 * Filters and sorts models based on current filter selections.
 * TODO: Implement actual filtering/sorting logic if needed beyond the curated sections.
 */
function updateFilteredModels() {
    const purpose = purposeFilter.value;
    const platform = platformFilter.value;
    const sortBy = sortFilter.value;

    console.log(`Filtering/Sorting: Purpose=${purpose}, Platform=${platform}, SortBy=${sortBy}`);
    // This function would typically fetch/filter data and update a main grid
    // For now, it only logs the selections as the main view shows curated lists
}

// --- Comparison Logic (Basic Example) ---
let comparisonList = [];

function addToComparison(modelId) {
    if (comparisonList.includes(modelId)) {
        console.log(`${modelId} already in comparison.`);
        return;
    }
    if (comparisonList.length >= 3) { // Example limit
        alert('Maximum comparison items reached (3).'); // Replace with better UI
        return;
    }
    comparisonList.push(modelId);
    console.log(`Added ${modelId} to comparison. Current list:`, comparisonList);
    updateComparisonUI();
}

function updateComparisonUI() {
    // TODO: Implement UI update for comparison bar/preview
    console.log('Updating comparison UI...');
}

// --- Initialization ---
function initializeModelsPage() {
    // Populate curated sections
    const sortedByDate = [...allModels].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    const sortedByRuns = [...allModels].sort((a, b) => b.runs - a.runs);
    const sortedByLikes = [...allModels].sort((a, b) => b.likes - a.likes);
    // Basic trending score (example: combine likes and recentness)
    const trending = [...allModels].sort((a, b) => {
        const scoreA = a.likes * 0.6 + (new Date(a.dateAdded).getTime() / (1000 * 60 * 60 * 24)) * 0.4;
        const scoreB = b.likes * 0.6 + (new Date(b.dateAdded).getTime() / (1000 * 60 * 60 * 24)) * 0.4;
        return scoreB - scoreA;
    });

    populateModelContainer(newlyAddedContainer, sortedByDate, 4); // Show 4 new models
    populateModelContainer(trendingContainer, trending, 4);        // Show 4 trending models
    populateModelContainer(popularContainer, sortedByRuns, 4);     // Show 4 popular (by runs)

    // Add event listeners to filters
    if (purposeFilter) purposeFilter.addEventListener('change', updateFilteredModels);
    if (platformFilter) platformFilter.addEventListener('change', updateFilteredModels);
    if (sortFilter) sortFilter.addEventListener('change', updateFilteredModels);

    console.log('Models page initialized.');
}

document.addEventListener('DOMContentLoaded', initializeModelsPage); 