function Calculate() {
    const drinks = document.querySelectorAll('.drink');
    let totalAlcoholMass = 0;
    drinks.forEach(drink => {
        const percentage = Number(drink.querySelector('.percentageBox').value);
        const ml = Number(drink.querySelector('.mlBox').value);
        if (percentage > 0 && ml > 0 && percentage <= 100) {
            totalAlcoholMass += (percentage / 100) * ml * 0.79;
        }
    });
    const weight = Number(document.getElementById('weightBox').value);
    const male = document.getElementById('male').checked;
    const female = document.getElementById('female').checked;
    const emptyStomach   = document.getElementById('emptyStomach').checked;
    const partialStomach = document.getElementById('partialStomach').checked;
    const fullStomach    = document.getElementById('fullStomach').checked;
    if (weight <= 0 || totalAlcoholMass === 0) {
        document.getElementById('result').textContent = 'Проверьте корректность введенных данных.';
        return;
    }
    let genderCoefficient;
    if (male) {
        genderCoefficient = 0.7;
    } else if (female) {
        genderCoefficient = 0.6;
    } else {
        genderCoefficient = null;
    }
    if (!genderCoefficient) {
        document.getElementById('result').textContent = 'Выберите пол!';
        return;
    }
    let absorptionFactor;
    if (emptyStomach) {
        absorptionFactor = 1.0;
    } else if (partialStomach) {
        absorptionFactor = 0.9;  // слегка перекусили
    } else if (fullStomach) {
        absorptionFactor = 0.8;
    } else {
        // если не выбрано — считаем пустым
        absorptionFactor = 1.0;
    }
    // Расчёт концентрации
    const alcoholConcentration = (totalAlcoholMass / (weight * genderCoefficient)) * absorptionFactor;
    let message;
    if (alcoholConcentration <= 0.2) {
        message = "нулевой степени опьянения.";
    } else if (alcoholConcentration <= 1.5) {
        message = "алкогольному опьянению легкой степени.";
    } else if (alcoholConcentration <= 2.5) {
        message = "алкогольному опьянению средней степени.";
    } else if (alcoholConcentration <= 4.0) {
        message = "алкогольному опьянению тяжелой степени.";
    } else {
        message = "алкогольному отравлению. Обратитесь за помощью.";
    }
     const metabolismRate = 0.1; 
     const eliminationTime = totalAlcoholMass / (metabolismRate * weight);
     document.getElementById('result').textContent = `Концентрация алкоголя в крови: ${alcoholConcentration.toFixed(2)}‰, что соответствует ${message}\nАлкоголь будет полностью выведен из организма через ${eliminationTime.toFixed(2)} часов.`;
}
function addDrink() {
    const container = document.getElementById('drinksContainer');
    const drinkIndex = container.children.length + 1;
    const newDrink = document.createElement('div');
    newDrink.classList.add('drink');
    newDrink.innerHTML = `
        <p>Напиток ${drinkIndex}:</p>
        <input type="number" class="percentageBox" placeholder="Крепость,%">
        <input type="number" class="mlBox" placeholder="Объем,мл">
        <button type="button" onclick="removeDrink(this)">Удалить</button>
    `;
    container.appendChild(newDrink);
    
}
function removeDrink(button) {
    button.parentElement.remove();
}


