// 初始化下拉菜单
function initDropdowns() {
    const modelSelect = document.querySelector('.model-select');
    const sortSelect = document.querySelector('.sort-select');
    
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            const selectedModel = e.target.value;
            if (selectedModel) {
                addModelToComparison(selectedModel);
                e.target.value = ''; // Reset selection
            }
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortMethod = e.target.value;
            sortModels(sortMethod);
        });
    }
}

// 添加模型到比较区域
function addModelToComparison(modelName) {
    const model = availableModels.find(m => m.name === modelName);
    if (model && !isModelInComparison(model)) {
        const modelCard = createModelCard(model);
        document.querySelector('.model-comparison').appendChild(modelCard);
        updateComparisonState();
        updateComparisonVisual(model);
    }
}

// 更新可视化比较结果
function updateComparisonVisual(model) {
    const visualArea = document.querySelector('.model-comparison-visual');
    if (!visualArea) return;

    // 创建或更新比较结果表格
    let comparisonTable = visualArea.querySelector('.comparison-table');
    if (!comparisonTable) {
        comparisonTable = document.createElement('table');
        comparisonTable.className = 'comparison-table';
        visualArea.appendChild(comparisonTable);
    }

    // 添加表头
    if (!comparisonTable.querySelector('thead')) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Metrics</th>
            <th>${model.name}</th>
        `;
        thead.appendChild(headerRow);
        comparisonTable.appendChild(thead);
    }

    // 添加数据行
    const tbody = comparisonTable.querySelector('tbody') || document.createElement('tbody');
    if (!comparisonTable.querySelector('tbody')) {
        comparisonTable.appendChild(tbody);
    }

    // 添加模型数据
    const metrics = [
        { name: 'Accuracy', value: model.accuracy || 'N/A' },
        { name: 'Speed', value: model.speed || 'N/A' },
        { name: 'Quality', value: model.quality || 'N/A' },
        { name: 'Cost per Run', value: model.cost || 'N/A' },
        { name: 'API Availability', value: model.availability || 'N/A' }
    ];

    metrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric.name}</td>
            <td>${metric.value}</td>
        `;
        tbody.appendChild(row);
    });

    // 更新模型计数
    const selectedCount = document.querySelector('.selected-count');
    if (selectedCount) {
        const currentCount = parseInt(selectedCount.textContent) || 0;
        selectedCount.textContent = currentCount + 1;
    }
}

// 排序模型
function sortModels(method) {
    const comparisonArea = document.querySelector('.model-comparison');
    const modelCards = Array.from(comparisonArea.children);
    
    modelCards.sort((a, b) => {
        const nameA = a.querySelector('.model-name').textContent;
        const nameB = b.querySelector('.model-name').textContent;
        
        switch (method) {
            case 'a-z':
                return nameA.localeCompare(nameB);
            case 'z-a':
                return nameB.localeCompare(nameA);
            case 'newest':
                return new Date(b.dataset.added) - new Date(a.dataset.added);
            case 'popular':
                return parseInt(b.dataset.views) - parseInt(a.dataset.views);
            default:
                return 0;
        }
    });
    
    // 重新添加排序后的卡片
    modelCards.forEach(card => comparisonArea.appendChild(card));
    
    // 更新可视化比较结果
    updateVisualComparison();
}

// 更新可视化比较结果
function updateVisualComparison() {
    const visualArea = document.querySelector('.model-comparison-visual');
    if (!visualArea) return;

    const comparisonTable = visualArea.querySelector('.comparison-table');
    if (!comparisonTable) return;

    // 获取所有选中的模型
    const selectedModels = Array.from(document.querySelectorAll('.model-card')).map(card => ({
        name: card.querySelector('.model-name').textContent,
        data: availableModels.find(m => m.name === card.querySelector('.model-name').textContent)
    }));

    // 更新表头
    const thead = comparisonTable.querySelector('thead');
    thead.innerHTML = `
        <tr>
            <th>Metrics</th>
            ${selectedModels.map(model => `<th>${model.name}</th>`).join('')}
        </tr>
    `;

    // 更新数据行
    const tbody = comparisonTable.querySelector('tbody');
    tbody.innerHTML = '';

    const metrics = ['accuracy', 'speed', 'quality', 'cost', 'availability'];
    metrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric.charAt(0).toUpperCase() + metric.slice(1)}</td>
            ${selectedModels.map(model => `<td>${model.data[metric] || 'N/A'}</td>`).join('')}
        `;
        tbody.appendChild(row);
    });
}

// 检查模型是否已经在比较区域
function isModelInComparison(model) {
    const existingModels = document.querySelectorAll('.model-card .model-name');
    return Array.from(existingModels).some(el => el.textContent === model.name);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    // ... existing initialization code ...
}); 