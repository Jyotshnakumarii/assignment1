let input = document.getElementById('result');

function addOperator(operator) {
    addToDisplay(operator);
}

function addDecimal() {
    addToDisplay('.');
}

function addDigit(digit) {
    addToDisplay(digit);
}

function clearAnswer() {
    clearDisplay();
}

function calculateResult() {
    calculate();
}
//  function add to display
function addToDisplay(value) {
    let lastChar = input.value.slice(-1);

    // DECIMAL :-   //

    // decimal comes more than once in a numbe
    if (
        value === '.' &&
        (input.value.slice(-2) === '..' || input.value.slice(-3) === '...')
    ) {
        return;
    }
    //  decimal comes in the starting of the expression
    if (
        value === '.' &&
        (input.value === '' || input.value === '*' || input.value === '/' || lastChar === '(')
    ) {
        input.value += '0';
    }
    // decimal comes before any operator
    if (
        (value === '+' || value === '-' || value === '*' || value === '/') && lastChar === '.'
    ) {
        return;
    }
    // decimal comes after an operator or a closing parenthesis
    if (
        value === '.' &&
        (lastChar === ')' || lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/')
    ) {
        input.value += '0.';
    }
    // only subtraction sign is allowed at the beginning
    if (value === '-' && input.value === '') {
        input.value += '-';
        return;
    }
    // operator comes between operands
    if (
        (value === '+' || value === '-' || value === '*' || value === '/') &&
        (lastChar !== '' && lastChar !== '+' && lastChar !== '-' && lastChar !== '*' && lastChar !== '/' && lastChar !== '(')
    ) {
        input.value += value;
    } else if (
        value !== '+' && value !== '-' && value !== '*' && value !== '/'
    ) {
        if (
            value === '.' &&
            (lastChar === '.' || lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/')
        ) {
            return;
        }

        // Remove the leading zero if the previous input was zero
        if (lastChar === '0' && input.value.length === 1) {
            input.value = input.value.slice(0, -1);
        }
        //  decimal point is already present in the current number
        if (value === '.') {
            let lastNumber = input.value.split(/[+\-/*()]/).pop();
            if (lastNumber.includes('.')) {
                return;
            }
        }
        input.value += value;
    }
}


// ClearDisplay Function 

function clearDisplay() {
    input.value = '';
}

// Calculate Function
function calculate() {
    let equation = input.value;

    // divide by 0
    if (equation.includes('/0')) {
        input.value = 'Infinite';
        return;
    }
    //  operator comes in the starting
    if (
        equation[0] == '+' || equation[0] == '*' || equation[0] == '/'
    ) {
        input.value = '';
        return;
    }
    // decimal comes more than once in a number
    let decimalCount = 0;
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] === '.') {
            decimalCount++;
        }
        if (
            (equation[i] === '+' || equation[i] === '-' || equation[i] === '*' || equation[i] === '/') && decimalCount > 1
        ) {
            input.value = '';
            return;
        }
        if (
            equation[i] === '+' || equation[i] === '-' || equation[i] === '*' || equation[i] === '/'
        ) {
            decimalCount = 0;
        }
    }
    // operator comes between the operands
    let operatorCount = 0;
    for (let i = 0; i < equation.length; i++) {
        if (
            equation[i] === '+' || equation[i] === '-' || equation[i] === '*' || equation[i] === '/'
        ) {
            operatorCount++;
        } else {
            operatorCount = 0;
        }
        if (operatorCount > 1) {
            input.value = '';
            return;
        }
    }
    // last character is an operator
    let lastChar = equation.slice(-1);
    if (
        lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/'
    ) {
        equation = equation.slice(0, -1);
    }
    // first character is '-' and the equation is "-1+2", evaluate and return "1"
    if (
        equation[0] === '-' && equation[1] !== undefined &&
        !isNaN(equation[1])
    ) {
        let result = calculateExpression('0' + equation);
        input.value = result;
        return;
    }

    //    Evaluate expression using the  calculateExpression () function and set the result as the value of the text box 
    let result = calculateExpression(equation);

    /*input.value=result;*/

    // Check for decimal points after any operator
    if (result % 1 !== 0) {
        input.value = result.toFixed(2);
    } else {
        input.value = result;
    }
}

// RemoveLast function
function removeLast() {
    input.value = input.value.slice(0, -1);
}

//


//  Calculate the result of the expression 
function calculate() {
    let equation = input.value;

    // Check for division by zero
    if (equation.includes('/0')) {
        input.value = 'Infinite';
        return;
    }

    // Check if an operator comes in the beginning
    if (equation[0] === '+' || equation[0] === '*' || equation[0] === '/') {
        input.value = '';
        return;
    }

    let result = evaluateExpression(equation);

    // Check for decimal points after any operator
    if (result % 1 !== 0) {
        input.value = result.toFixed(2);
    } else {
        input.value = result;
    }
}

// Evaluate the expression
function evaluateExpression(expression) {
    let operators = [];
    let operands = [];

    let num = '';
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === '+' || char === '-' || char === '*' || char === '/') {
            operands.push(parseFloat(num));
            num = '';

            while (
                operators.length > 0 &&
                precedence[operators[operators.length - 1]] >= precedence[char]
            ) {
                applyOperator(operators.pop(), operands);
            }
            operators.push(char);
        } else {
            num += char;
        }
    }

    operands.push(parseFloat(num));

    while (operators.length > 0) {
        applyOperator(operators.pop(), operands);
    }

    return operands[0];
}

// Apply the operator to the operands
function applyOperator(operator, operands) {
    const b = operands.pop();
    const a = operands.pop();
    // 


    // The value of the expression is compared with the values of each case.
    // If there is a match, the associated block of code is executed otherwise default code block is executed. 
    switch (operator) {
        case '+':
            operands.push(a + b);
            break;
        case '-':
            operands.push(a - b);
            break;
        case '*':
            operands.push(a * b);
            break;
        case '/':
            operands.push(a / b);
            break;
    }
}

// Operator precedence :
// describes the order in which operations are performed in an arithmetic expression.
// Multiplication (*) and division (/) have higher precedence than addition (+) and subtraction (-).
// same precedence (like * and / or + and -) or are computed from left to right:

const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
};






