function Calculate() {
    const percentage = Number(document.getElementById('percentageBox').value);
    const ml = Number(document.getElementById('mlBox').value);
    const weight = Number(document.getElementById('weightBox').value);
    const male = document.getElementById('male').checked;
    const female = document.getElementById('female').checked;
    const emptyStomach = document.getElementById('emptyStomach').checked;
    const fullStomach = document.getElementById('fullStomach').checked;
    const result = document.getElementById('result');
    if (isNaN(percentage) || isNaN(ml) || isNaN(weight) || weight <= 0 || ml <= 0 || percentage <= 0) {
        result.textContent = 'Введите корректные значения!';
        return;
    }
    let genderCoefficient;
    if (male) {
        genderCoefficient = 0.7;
    } else if (female) {
        genderCoefficient = 0.6;
    } else {
        result.textContent = 'Выберите пол!';
        return;
    }
    let absorptionFactor;
    if (fullStomach) {
        absorptionFactor = 0.8;
    } else {
        absorptionFactor = 1.0;
    }
    const alcoholMass = (percentage / 100) * ml * 0.79;
    const alcoholConcentration = (alcoholMass / (weight * genderCoefficient)) * absorptionFactor;
    if (alcoholConcentration <= 0.2) {
        result.textContent = `Концентрация алкоголя в вашей крови составляет ${alcoholConcentration.toFixed(2)}‰, что соответствует нулевой степени опьянения (присутствуют только признаки употребления спиртного).`;
    } 
    else if (alcoholConcentration > 0.2 && alcoholConcentration <= 1.5) {
        result.textContent = `Концентрация алкоголя в вашей крови составляет ${alcoholConcentration.toFixed(2)}‰, что соответствует алкогольному опьянению легкой степени.`;
    } 
    else if (alcoholConcentration > 1.5 && alcoholConcentration <= 2.5) {
        result.textContent = `Концентрация алкоголя в вашей крови составляет ${alcoholConcentration.toFixed(2)}‰, что соответствует алкогольному опьянению средней степени.`;
    } 
    else if (alcoholConcentration > 2.5 && alcoholConcentration <= 4.0) { 
        result.textContent = `Концентрация алкоголя в вашей крови составляет ${alcoholConcentration.toFixed(2)}‰, что соответствует алкогольному опьянению тяжелой степени.`;
    } 
    else {
        result.textContent = `Концентрация алкоголя в вашей крови составляет ${alcoholConcentration.toFixed(2)}‰, что соответствует алкогольному отравлению. Обратитесь за помощью.`;
    }
}

