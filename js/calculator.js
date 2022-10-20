// Declarations to make queries travel less distance
const calculator = document.querySelector('#CalculatorBody')
const keys = calculator.querySelector('#CalculatorKeys')
const display = calculator.querySelector('#CalculatorDisplay')
const operatorKeys = keys.querySelectorAll('[data-type="operator"]')
const clearKey = document.querySelector('[data-type="clear"]')
const equalKey = document.querySelector('[data-type="equal"]')


keys.addEventListener('click', event => {
    if (!event.target.closest('button')) return
    const key = event.target
    const keyValue = key.textContent
    const displayValue = display.textContent
    const { type } = key.dataset
    const { previousKeyType } = calculator.dataset
    // Check if type is number
    if (type === 'number') {
        if (
            displayValue === '0' ||
            previousKeyType === 'operator'
        ) {
            display.textContent = keyValue
        } else {
            display.textContent = displayValue + keyValue
        }
    }
    // Check if type is operator
    if (type === 'operator') {
        const currentActiveOperator = calculator.querySelector('[data-state="selected"]')
        if (currentActiveOperator){
            currentActiveOperator.dataset.state = ''
        }        
        key.dataset.state = 'selected'
        calculator.dataset.firstNumber = displayValue
        calculator.dataset.operator = key.dataset.key
        // if a data type number is clicked after state is deselected
        
        // if a data type operator is clicked again, operate (doesn't work yet)
    }else if (previousKeyType === 'operator'){
        key.dataset.state = ''
    }

    if (type === 'equal') {
        // Perform a calculation
        const firstNumber = calculator.dataset.firstNumber
        const operator = calculator.dataset.operator
        const secondNumber = displayValue
        display.textContent = operate(firstNumber, operator, secondNumber)
        console.log("displaying ", display.textContent);
        const resultInMemory = display.textContent;
        console.log("result in memory ", resultInMemory);
        console.log("first is ", firstNumber);
        console.log("second is ", secondNumber);
    }

    if (type === 'clear') {
        display.textContent = '0'
        delete calculator.dataset.firstNumber
        delete calculator.dataset.operator
        delete calculator.dataset.secondNumber
    }

    calculator.dataset.previousKeyType = type
})

function operate(firstNumber, operator, secondNumber) {
    firstNumber = parseInt(firstNumber)
    secondNumber = parseInt(secondNumber)
    // Evaluating
    if (operator === 'plus') return firstNumber + secondNumber
    if (operator === 'minus') return firstNumber - secondNumber
    if (operator === 'times') return firstNumber * secondNumber
    if (operator === 'divide') return firstNumber / secondNumber
}

function clearCalculator() {
    // Press the clear key
    clearKey.click()

    // Clear operator states
    operatorKeys.forEach(key => { key.dataset.state = '' })
}