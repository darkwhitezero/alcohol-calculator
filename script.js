const PRESETS = [
    { label: 'Свой вариант', abv: 0 },
    { label: 'Пиво светлое (4.5%)', abv: 4.5 },
    { label: 'Пиво крепкое (7%)', abv: 7 },
    { label: 'Вино (12%)', abv: 12 },
    { label: 'Шампанское (11%)', abv: 11 },
    { label: 'Ликер (20%)', abv: 20 },
    { label: 'Водка/Коньяк (40%)', abv: 40 },
    { label: 'Виски/Джин (40%)', abv: 40 },
];

const state = {
    gender: 'male',
    weight: '89',
    height: '184',
    stomach: 'empty',
    drinks: [
        { id: '1', label: 'Водка/Коньяк (40%)', volume: '100', abv: '40' }
    ],
    time: '0',
    result: null
};

const elements = {
    genderToggle: document.getElementById('gender-toggle'),
    weight: document.getElementById('weight'),
    height: document.getElementById('height'),
    stomach: document.getElementById('stomach'),
    drinksContainer: document.getElementById('drinks-container'),
    addDrinkBtn: document.getElementById('add-drink-btn'),
    time: document.getElementById('time'),
    calculateBtn: document.getElementById('calculate-btn'),
    resultContainer: document.getElementById('result-container'),
    resultPromille: document.getElementById('result-promille'),
    resultStatus: document.getElementById('result-status'),
    resultTime: document.getElementById('result-time')
};


function generateId() {
    return Date.now().toString();
}

function addDrink() {
    const newDrink = {
        id: generateId(),
        label: 'Пиво светлое (4.5%)',
        volume: '500',
        abv: '4.5'
    };
    state.drinks.push(newDrink);
    renderDrinks();
}

function removeDrink(id) {
    if (state.drinks.length <= 1) return;
    state.drinks = state.drinks.filter(d => d.id !== id);
    renderDrinks();
}

function updateDrink(id, field, value) {
    const drink = state.drinks.find(d => d.id === id);
    if (drink) {
        drink[field] = value;
    }
}

function handlePresetChange(id, presetLabel) {
    const preset = PRESETS.find(p => p.label === presetLabel);
    if (preset) {
        const drink = state.drinks.find(d => d.id === id);
        if (drink) {
            drink.label = presetLabel;
            drink.abv = preset.abv.toString();
            renderDrinks();
        }
    }
}

function renderDrinks() {
    const container = elements.drinksContainer;
    container.innerHTML = '';

    state.drinks.forEach(drink => {
        const drinkEl = document.createElement('div');
        drinkEl.className = 'drink-item';
        drinkEl.innerHTML = `
            <button type="button" class="btn-delete" data-id="${drink.id}" 
                    ${state.drinks.length === 1 ? 'disabled' : ''} title="Удалить напиток">
                ✕
            </button>
            <div class="drink-fields">
                <div class="form-group">
                    <label>Вид напитка</label>
                    <select class="drink-preset" data-id="${drink.id}">
                        ${PRESETS.map(p => `
                            <option value="${p.label}" ${p.label === drink.label ? 'selected' : ''}>
                                ${p.label}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="drink-row">
                    <div class="form-group">
                        <label>Объем (мл)</label>
                        <input type="number" class="drink-volume" data-id="${drink.id}" 
                               value="${drink.volume}" min="0" max="10000">
                    </div>
                    <div class="form-group">
                        <label>Крепость (%)</label>
                        <input type="number" class="drink-abv" data-id="${drink.id}" 
                               value="${drink.abv}" min="0" max="100" step="0.1">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(drinkEl);
    });

    attachDrinkEvents();
}

function attachDrinkEvents() {
    document.querySelectorAll('.drink-preset').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            handlePresetChange(id, e.target.value);
        });
    });

    document.querySelectorAll('.drink-volume').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = e.target.dataset.id;
            updateDrink(id, 'volume', e.target.value);
        });
    });

    document.querySelectorAll('.drink-abv').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = e.target.dataset.id;
            updateDrink(id, 'abv', e.target.value);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            removeDrink(id);
        });
    });
}


function getStatus(val) {
    if (val === 0) {
        return { text: 'Трезвость', className: 'status-success' };
    }
    if (val < 0.3) {
        return { text: 'Незначительное опьянение/допустимая норма (в РФ для водителей < 0.3)', className: 'status-success' };
    }
    if (val <= 0.5) {
        return { text: 'Лёгкое опьянение', className: 'status-warning' };
    }
    if (val <= 1.5) {
        return { text: 'Среднее опьянение', className: 'status-error' };
    }
    if (val <= 2.5) {
        return { text: 'Сильное опьянение', className: 'status-danger' };
    }
    return { text: 'Тяжелое отравление', className: 'status-critical' };
}

function clearValidationErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function handleCalculate() {
    clearValidationErrors();
    const w = parseFloat(state.weight);
    const h = parseFloat(state.height);
    const t = parseFloat(state.time);

    let hasError = false;

    if (!w || !h || state.drinks.length === 0) {
        return;
    }

    if (w > 750) {
        elements.weight.classList.add('input-error');
        hasError = true;
    }

    if (h > 300) {
        elements.height.classList.add('input-error');
        hasError = true;
    }

    state.drinks.forEach(drink => {
        const abv = parseFloat(drink.abv) || 0;
        if (abv > 100) {
            const abvInput = document.querySelector(`.drink-abv[data-id="${drink.id}"]`);
            if (abvInput) abvInput.classList.add('input-error');
            hasError = true;
        }
    });

    if (hasError) return;

    let totalAlcoholMass = 0;

    state.drinks.forEach(drink => {
        const v = parseFloat(drink.volume) || 0;
        const s = parseFloat(drink.abv) || 0;
        totalAlcoholMass += v * (s / 100) * 0.789;
    });

    let resorptionDeficit = 0;
    if (state.stomach === 'snack') resorptionDeficit = 0.1;
    if (state.stomach === 'full') resorptionDeficit = 0.2;

    const absorbedAlcohol = totalAlcoholMass * (1 - resorptionDeficit);

    let r = 0.7;

    if (state.gender === 'male') {
        r = 0.31608 - (0.004821 * w) + (0.004632 * h);
    } else {
        r = 0.31223 - (0.006446 * w) + (0.004466 * h);
    }

    if (r <= 0) r = 0.6;

    let permille = absorbedAlcohol / (w * r);

    const eliminationRate = 0.15;

    if (t > 0) {
        permille = permille - (eliminationRate * t);
    }

    if (permille < 0) permille = 0;

    const timeToSober = permille > 0 ? permille / eliminationRate : 0;

    state.result = { promille: permille, timeToSober };

    renderResult();
}

function renderResult() {
    if (state.result === null) {
        elements.resultContainer.classList.add('hidden');
        elements.resultContainer.classList.remove('show');
        return;
    }

    const { promille, timeToSober } = state.result;
    const status = getStatus(promille);

    elements.resultPromille.textContent = `${promille.toFixed(2)} ‰`;

    elements.resultStatus.textContent = status.text;
    elements.resultStatus.className = `result-status ${status.className}`;

    if (timeToSober > 0) {
        const hours = Math.floor(timeToSober);
        const minutes = Math.round((timeToSober % 1) * 60);
        elements.resultTime.innerHTML = `
            Времени до полного вытрезвления:<br>
            <strong>~${hours} ч ${minutes} мин</strong>
        `;
    } else {
        elements.resultTime.innerHTML = `<strong style="color: var(--success);">Алкоголь выведен полностью</strong>`;
    }

    elements.resultContainer.classList.remove('hidden');
    elements.resultContainer.classList.add('show');
}


function init() {
    renderDrinks();

    elements.weight.value = state.weight;
    elements.height.value = state.height;
    elements.stomach.value = state.stomach;
    elements.time.value = state.time;

    elements.genderToggle.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-btn')) {
            const value = e.target.dataset.value;
            state.gender = value;

            elements.genderToggle.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.value === value);
            });
        }
    });

    elements.weight.addEventListener('input', (e) => {
        state.weight = e.target.value;
    });

    elements.height.addEventListener('input', (e) => {
        state.height = e.target.value;
    });

    elements.stomach.addEventListener('change', (e) => {
        state.stomach = e.target.value;
    });

    elements.time.addEventListener('input', (e) => {
        state.time = e.target.value;
    });

    elements.addDrinkBtn.addEventListener('click', addDrink);

    elements.calculateBtn.addEventListener('click', handleCalculate);
}

document.addEventListener('DOMContentLoaded', init);
