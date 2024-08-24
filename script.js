const screen = document.querySelector('.screen');
const inputBtns = document.querySelectorAll('.input-btn');
const deleteBtn = document.getElementById('delete');
const resetBtn = document.getElementById('reset');
const equalBtn = document.getElementById('equal');

const input = [];
const temp = [];
let result = null;

function updateTheme() {
	if (document.body.classList.contains('theme-3')) {
		document.body.classList.remove('theme-3');
		document.body.classList.add('theme-1');
	} else if (document.body.classList.contains('theme-2')) {
		document.body.classList.remove('theme-2');
		document.body.classList.add('theme-3');
	} else {
		if (document.body.classList.contains('theme-1')) {
			document.body.classList.remove('theme-1');
		}
		document.body.classList.add('theme-2');
	}
}

function updateScreen(btnText) {
	if (btnText === 'del') {
		screen.innerText = screen.innerText.toString().slice(0, -1);
	} else if (btnText === 'reset') {
		screen.innerText = '';
	} else {
		screen.innerText = screen.innerText.toString() + btnText.toString();
	}
}

function storeInput(btn) {
	if (
		input.length === 21 ||
		(temp.length === 0 && ['+', '-', '/', 'x'].includes(btn.innerText))
	) {
		return;
	} else if (temp.includes('.') && btn.innerText === '.') {
		return;
	} else if (result !== null) {
		result = null;
		resetInput();
	}

	if (['+', '-', '/', 'x'].includes(btn.innerText)) {
		input.push(temp.join(''));
		temp.length = 0;
		input.push(btn.innerText);
	} else {
		temp.push(btn.innerText);
	}

	updateScreen(btn.innerText);
}

function resetInput() {
	input.length = 0;
	temp.length = 0;
	updateScreen('reset');
}

function deleteInput() {
	if (temp.length === 0) {
		input.pop();
	} else {
		temp.pop();
	}

	updateScreen('del');
}

function calculate() {
	if (temp.length === 0 || input.length === 0) {
		{
			return;
		}
	} else {
		input.push(temp.join(''));
		temp.length = 0;
	}

	for (let i = 0; i < input.length; i++) {
		if (input[i] === '/' && parseFloat(input[i + 1]) === 0) {
			result = 'Cant divide by zero';
			screen.innerText = result;
			return;
		}
	}

	const strongOperatorsIndex = input
		.map((operator, index) => ({ operator, index }))
		.filter(({ operator }) => operator === '/' || operator === 'x')
		.map(({ index }) => index);

	const weakoperatoratorsIndex = input
		.map((operator, index) => ({ operator, index }))
		.filter(({ operator }) => operator === '+' || operator === '-')
		.map(({ index }) => index);

	// first calculation
	for (let i = 0; i < strongOperatorsIndex.length; i++) {
		if (input[strongOperatorsIndex[i]] === '/') {
			result =
				parseFloat(input[strongOperatorsIndex[i] - 1]) /
				parseFloat(input[strongOperatorsIndex[i] + 1]);
			input[strongOperatorsIndex[i]] =
				input[strongOperatorsIndex[i] - 1] =
				input[strongOperatorsIndex[i] + 1] =
					result;
		} else {
			result =
				parseFloat(input[strongOperatorsIndex[i] - 1]) *
				parseFloat(input[strongOperatorsIndex[i] + 1]);
			input[strongOperatorsIndex[i]] =
				input[strongOperatorsIndex[i] - 1] =
				input[strongOperatorsIndex[i] + 1] =
					result;
		}
	}

	// second calculation
	for (let i = 0; i < weakoperatoratorsIndex.length; i++) {
		if (input[weakoperatoratorsIndex[i]] === '+') {
			result =
				parseFloat(input[weakoperatoratorsIndex[i] - 1]) +
				parseFloat(input[weakoperatoratorsIndex[i] + 1]);
			input[weakoperatoratorsIndex[i]] =
				input[weakoperatoratorsIndex[i] - 1] =
				input[weakoperatoratorsIndex[i] + 1] =
					result;
		} else {
			result =
				parseFloat(input[weakoperatoratorsIndex[i] - 1]) -
				parseFloat(input[weakoperatoratorsIndex[i] + 1]);
			input[weakoperatoratorsIndex[i]] =
				input[weakoperatoratorsIndex[i] - 1] =
				input[weakoperatoratorsIndex[i] + 1] =
					result;
		}
	}
	screen.innerText = result;
}

document.querySelector('.theme-btn').addEventListener('click', updateTheme);

inputBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		storeInput(btn);
	});
});

resetBtn.addEventListener('click', resetInput);

deleteBtn.addEventListener('click', deleteInput);

equalBtn.addEventListener('click', calculate);
