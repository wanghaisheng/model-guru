/**
 * Model Guru - Models Page Script
 *
 * Handles fetching, filtering, sorting, and displaying AI models.
 */
import { currentLanguage } from './i18n.js';

// --- DOM Elements ---
const newlyAddedContainer = document.querySelector('#new-models .models-preview-container');
const trendingContainer = document.querySelector('#trending-models .models-preview-container');
const popularContainer = document.querySelector('#popular-models .models-preview-container');
const filteredModelsContainer = document.getElementById('filtered-models-container');
const filteredSection = document.getElementById('filtered-models-section');
const noResultsMessage = document.getElementById('no-results-message');

const purposeFilter = document.getElementById('purpose-filter');
const platformFilter = document.getElementById('platform-filter');
const sortFilter = document.getElementById('sort-filter');
const modelCardTemplate = document.getElementById('model-card-template');

// --- Helper Functions ---
function formatMetric(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    return num.toString();
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

// --- Core Logic Functions ---
function createModelCard(model) {
    if (!modelCardTemplate) {
        console.error('Model card template not found!');
        return null;
    }
    const cardClone = modelCardTemplate.content.cloneNode(true);
    const cardElement = cardClone.querySelector('.model-card');

    cardElement.dataset.modelId = model.id;
    cardElement.querySelector('.platform-logo').src = model.logo || 'img/platform-placeholder.svg';
    cardElement.querySelector('.platform-logo').alt = `${model.platform} Logo`;
    cardElement.querySelector('.model-date').textContent = timeAgo(model.dateAdded);
    cardElement.querySelector('.model-title').textContent = model.name;
    cardElement.querySelector('.model-description').textContent = model.description;
    cardElement.querySelector('.metric.runs span').textContent = formatMetric(model.runs);
    cardElement.querySelector('.metric.likes span').textContent = formatMetric(model.likes);

    const tagsContainer = cardElement.querySelector('.model-tags');
    tagsContainer.innerHTML = ''; // Clear existing tags
    model.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });

    const comparisonBtn = cardElement.querySelector('.add-to-comparison-btn');
    comparisonBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToComparison(model.id);
    });

    return cardElement;
}

function populateModelContainer(container, models, limit = null) {
    if (!container) {
        console.error('Target container not found:', container);
        return;
    }
    container.innerHTML = '';
    const modelsToDisplay = limit ? models.slice(0, limit) : models;

    if (modelsToDisplay.length === 0) {
        if (container === filteredModelsContainer && noResultsMessage) {
            noResultsMessage.style.display = 'block';
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted-color);">No models to display.</p>';
        }
    } else {
        if (container === filteredModelsContainer && noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
        modelsToDisplay.forEach(model => {
            const card = createModelCard(model);
            if (card) {
                container.appendChild(card);
            }
        });
    }
}

function getFilteredAndSortedModels(sourceModels) {
    const selectedPurpose = purposeFilter ? purposeFilter.value : '';
    const selectedPlatform = platformFilter ? platformFilter.value : '';
    const sortBy = sortFilter ? sortFilter.value : 'newest';

    let filteredModels = [...sourceModels]; // Create a copy to avoid modifying the original

    if (selectedPurpose) {
        filteredModels = filteredModels.filter(model => model.category === selectedPurpose);
    }

    if (selectedPlatform) {
        filteredModels = filteredModels.filter(model => model.platform === selectedPlatform);
    }

    switch (sortBy) {
        case 'newest':
            filteredModels.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'oldest':
             filteredModels.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
             break;
        case 'mostLikes':
            filteredModels.sort((a, b) => b.likes - a.likes);
            break;
        case 'mostRuns':
            filteredModels.sort((a, b) => b.runs - a.runs);
            break;
        case 'trending':
            filteredModels.sort((a, b) => (b.likes + b.runs / 10) - (a.likes + a.runs / 10));
            break;
        case 'alphabetical':
            filteredModels.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    return filteredModels;
}

function updateFilteredModelsDisplay() {
     if (!allModels || !filteredSection || !filteredModelsContainer || !document.getElementById('new-models')) {
        console.error("Required elements for filtering not found.");
        return;
    }
    const filteredModels = getFilteredAndSortedModels(allModels);

    document.getElementById('new-models').style.display = 'none';
    document.getElementById('trending-models').style.display = 'none';
    document.getElementById('popular-models').style.display = 'none';
    filteredSection.style.display = 'block';

    populateModelContainer(filteredModelsContainer, filteredModels);

    filteredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Comparison Logic (Placeholder) ---
let comparisonList = [];
const MAX_COMPARISON = 3;

function addToComparison(modelId) {
    if (comparisonList.includes(modelId)) {
        console.log(`Model ${modelId} already in comparison.`);
        return;
    }
    if (comparisonList.length >= MAX_COMPARISON) {
        alert(`You can only compare up to ${MAX_COMPARISON} models.`);
        return;
    }
    comparisonList.push(modelId);
    console.log('Comparison List:', comparisonList);
    updateComparisonUI();
}

function updateComparisonUI() {
    console.log('Updating comparison UI...');
}

// --- Mock Data (Moved Lower) ---
const allModels = [
    { id: 'sdxl-turbo', name: 'SDXL Turbo', platform: 'stability', description: 'Lightning-fast image generation with high quality.', likes: 4800, runs: 125000, dateAdded: '2024-07-15', category: 'image', tags: ['Image Generation', 'Real-time', 'SDXL'], logo: 'img/stability-logo.svg' },
    { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', platform: 'huggingface', description: 'Powerful mixture-of-experts language model.', likes: 3200, runs: 89000, dateAdded: '2024-06-20', category: 'text', tags: ['Text Generation', 'LLM', 'MoE'], logo: 'img/huggingface-logo.svg' },
    { id: 'stable-audio', name: 'Stable Audio', platform: 'stability', description: 'High-quality music and sound generation.', likes: 2100, runs: 45000, dateAdded: '2024-07-01', category: 'audio', tags: ['Audio Generation', 'Music', 'Sound Effects'], logo: 'img/stability-logo.svg' },
    { id: 'gpt-4o', name: 'GPT-4o', platform: 'openai', description: 'OpenAI's flagship multimodal model with text, audio, and vision capabilities.', likes: 98000, runs: 2500000, dateAdded: '2024-05-13', category: 'text', tags: ['Text Generation', 'Multimodal', 'Vision', 'Audio'], logo: 'img/openai-logo.svg' },
    { id: 'llama-3-70b', name: 'Llama 3 70B', platform: 'replicate', description: 'Large language model from Meta, known for strong reasoning and coding.', likes: 75000, runs: 1800000, dateAdded: '2024-04-18', category: 'text', tags: ['Text Generation', 'LLM', 'Open Source', 'Meta'], logo: 'img/replicate-logo.svg' },
    { id: 'wan2.1', name: 'Wan 2.1', platform: 'replicate', description: 'Video generation model focused on style transfer and animation.', likes: 32000, runs: 800000, dateAdded: '2024-02-10', category: 'video', tags: ['Video Generation', 'Animation', 'Style Transfer'], logo: 'img/replicate-logo.svg' },
    { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', platform: 'stability', description: 'Latest iteration of Stable Diffusion with improved text understanding.', likes: 6000, runs: 150000, dateAdded: '2024-06-10', category: 'image', tags: ['Image Generation', 'Text-to-Image', 'SD3'], logo: 'img/stability-logo.svg' },
    { id: 'whisper-large-v3', name: 'Whisper Large V3', platform: 'openai', description: 'State-of-the-art speech-to-text transcription model.', likes: 45000, runs: 1200000, dateAdded: '2023-11-06', category: 'audio', tags: ['Audio Processing', 'Transcription', 'Speech-to-Text'], logo: 'img/openai-logo.svg' },
    { id: 'zeroscope-v2-xl', name: 'ZeroScope V2 XL', platform: 'huggingface', description: 'Text-to-video generation model optimized for quality and coherence.', likes: 15000, runs: 300000, dateAdded: '2024-03-05', category: 'video', tags: ['Video Generation', 'Text-to-Video', 'Open Source'], logo: 'img/huggingface-logo.svg' },
];

// --- Initialization Logic ---
function initializeModelsPage() {
    // Get containers and template
    const newModelsContainer = document.querySelector('#new-models .models-preview-container');
    const trendingModelsContainer = document.querySelector('#trending-models .models-preview-container');
    const popularModelsContainer = document.querySelector('#popular-models .models-preview-container');
    const filteredModelsContainer = document.getElementById('filtered-models-container');
    const noResultsMessage = document.getElementById('no-results-message');
    const filteredSection = document.getElementById('filtered-models-section');
    const modelCardTemplate = document.getElementById('model-card-template');

    // Check if template exists
    if (!modelCardTemplate) {
        console.error("Model card template not found! Cannot populate models.");
        return; // Stop initialization if template is missing
    }

    // --- Populate Initial Curated Sections ---
    if (!allModels || allModels.length === 0) {
        console.warn("No models data available to populate sections.");
    } else {
        try {
            // Newly Added (Sort by dateAdded descending)
            const newlyAddedModels = [...allModels].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            if (newModelsContainer) {
                populateModelContainer(newModelsContainer, newlyAddedModels, 4); // Show latest 4
            } else {
                console.warn("New models container not found (#new-models .models-preview-container)");
            }

            // Trending This Week (Sort by runs descending)
            const trendingModels = [...allModels].sort((a, b) => (b.runs || 0) - (a.runs || 0));
             if (trendingModelsContainer) {
                populateModelContainer(trendingModelsContainer, trendingModels, 4); // Show top 4 by runs
            } else {
                 console.warn("Trending models container not found (#trending-models .models-preview-container)");
            }

            // Most Popular This Month (Sort by likes descending)
            const popularModels = [...allModels].sort((a, b) => (b.likes || 0) - (a.likes || 0));
            if (popularModelsContainer) {
                populateModelContainer(popularModelsContainer, popularModels, 4); // Show top 4 by likes
            } else {
                console.warn("Popular models container not found (#popular-models .models-preview-container)");
            }
        } catch (error) {
            console.error("Error populating curated sections:", error);
        }
    }

    // --- Setup Filters ---
    const purposeFilter = document.getElementById('purpose-filter');
    const platformFilter = document.getElementById('platform-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (!purposeFilter || !platformFilter || !sortFilter || !filteredModelsContainer || !noResultsMessage || !filteredSection) {
        console.warn("One or more filter/display elements not found. Filtering UI might be incomplete.");
    } else {
        // Add event listeners only if all required elements are found
        purposeFilter.addEventListener('change', updateFilteredModelsDisplay);
        platformFilter.addEventListener('change', updateFilteredModelsDisplay);
        sortFilter.addEventListener('change', updateFilteredModelsDisplay);

        // Initial population of the filtered view (optional, can be empty initially)
        // updateFilteredModelsDisplay(); // Uncomment if you want filters applied on load
    }

    // Note: The updateFilteredModelsDisplay function handles showing/hiding sections
}

// --- Wait for DOM Ready ---
document.addEventListener('DOMContentLoaded', initializeModelsPage); 