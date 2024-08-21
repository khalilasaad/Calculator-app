const screen = document.querySelector('.screen');
const inputBtns = document.querySelectorAll('.input-btn');
const deleteBtn = document.getElementById('delete');
const resetBtn = document.getElementById('reset');
const equalBtn = document.getElementById('equal');

const input = [];

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

function updateScreen() {
	screenInput = input.join('');
	screen.innerText = screenInput;
}

function displayInput(btn) {
	last = input[input.length - 1];

	if (
		input.length === 21 ||
		(['+', '-', '/', 'x'].includes(last) &&
			['+', '-', '/', 'x'].includes(btn.innerText)) ||
		(input.length === 0 && ['+', '-', '/', 'x'].includes(btn.innerText))
	) {
		return;
	} else if (last === 'Math Error') {
		resetInput();
	}
	input.push(btn.innerText);
	updateScreen();
}

function resetInput() {
	input.length = 0;
	updateScreen();
}

function deleteInput() {
	input.pop();
	updateScreen();
}

function calculate() {
	last = input[input.length - 1];

	if (
		['+', '-', '/', 'x'].includes(last) ||
		(input[input.length - 2] === '/' && last === '0')
	) {
		resetInput();
		input.push('Math Error');
		updateScreen();
		return;
	}

	if (input.length === 1) {
		return;
	}

	newInput = [];
	temp = [];
	input.forEach((x, index) => {
		if (['+', '-', '/', 'x'].includes(x)) {
			newInput.push(temp.join(''));
			newInput.push(x);
			temp.length = 0;
		} else {
			temp.push(x);
		}
		if (input.length - 1 === index) {
			newInput.push(temp.join(''));
			temp.length = 0;
		}
	});

	const strongOperatorsIndex = newInput
		.map((operator, index) => ({ operator, index }))
		.filter(({ operator }) => operator === '/' || operator === 'x')
		.map(({ index }) => index);

	const weakoperatoratorsIndex = newInput
		.map((operator, index) => ({ operator, index }))
		.filter(({ operator }) => operator === '+' || operator === '-')
		.map(({ index }) => index);

	let result;
	// first calculation
	for (let i = 0; i < strongOperatorsIndex.length; i++) {
		if (newInput[strongOperatorsIndex[i]] === '/') {
			result =
				parseFloat(newInput[strongOperatorsIndex[i] - 1]) /
				parseFloat(newInput[strongOperatorsIndex[i] + 1]);
			newInput[strongOperatorsIndex[i]] =
				newInput[strongOperatorsIndex[i] - 1] =
				newInput[strongOperatorsIndex[i] + 1] =
					result;
		} else {
			result =
				parseFloat(newInput[strongOperatorsIndex[i] - 1]) *
				parseFloat(newInput[strongOperatorsIndex[i] + 1]);
			newInput[strongOperatorsIndex[i]] =
				newInput[strongOperatorsIndex[i] - 1] =
				newInput[strongOperatorsIndex[i] + 1] =
					result;
		}
	}

	for (let i = 0; i < weakoperatoratorsIndex.length; i++) {
		if (newInput[weakoperatoratorsIndex[i]] === '+') {
			result =
				parseFloat(newInput[weakoperatoratorsIndex[i] - 1]) +
				parseFloat(newInput[weakoperatoratorsIndex[i] + 1]);
			newInput[weakoperatoratorsIndex[i]] =
				newInput[weakoperatoratorsIndex[i] - 1] =
				newInput[weakoperatoratorsIndex[i] + 1] =
					result;
		} else {
			result =
				parseFloat(newInput[weakoperatoratorsIndex[i] - 1]) -
				parseFloat(newInput[weakoperatoratorsIndex[i] + 1]);
			newInput[weakoperatoratorsIndex[i]] =
				newInput[weakoperatoratorsIndex[i] - 1] =
				newInput[weakoperatoratorsIndex[i] + 1] =
					result;
		}
	}
	resetInput();
	screen.innerText = result;
}

document.querySelector('.theme-btn').addEventListener('click', updateTheme);

inputBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		displayInput(btn);
	});
});

resetBtn.addEventListener('click', resetInput);

deleteBtn.addEventListener('click', deleteInput);

equalBtn.addEventListener('click', calculate);
