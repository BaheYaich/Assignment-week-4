// Declarations to make queries travel less distance
const calculator = document.querySelector("#CalculatorBody")
const keys = calculator.querySelector("#CalculatorKeys");
const display = calculator.querySelector("#CalculatorDisplay")
const operatorKeys = keys.querySelectorAll('[data-type="operator"]')
const clearKey = calculator.querySelector('[data-type="clear"]')
const equalKey = calculator.querySelector('[data-type="equal"]')
const deleteKey = calculator.querySelector('[data-type="delete"]')
const decimalKey = calculator.querySelector('.decimal')


// Handling all clicks on the keys object
keys.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return
  const key = event.target
  const keyValue = key.textContent
  const displayValue = display.textContent
  const { type } = key.dataset
  const { previousKeyType, previousKey } = calculator.dataset
  let changed = false

  // Check if decimal key is pressed once to prevent adding more than one decimal point when adding a number
  if (key.classList.contains('decimal')){
      key.classList.add("disabled")
  }

  // Enables the equals key when there is an expression to evaluate
  if (displayValue){
    if (calculator.dataset.operator !== undefined) {
      equalKey.classList.remove("disabled")
    }
  }

  // Check if operator is clicked twice
  if (type === 'operator' && previousKeyType === 'operator') {
    if (key.dataset.key === previousKey) {
      return;
    }

    // Check is the operator has changed to a different one
    changed = true;
  }

  // Check if type is number
  if (type === "number") {
    if (previousKey === "equal") {
      clearCalculator()
      display.textContent = ""
      console.log("PreviousKey is now Equal")

    }

    if (displayValue === "0" || previousKeyType === "operator") {
      display.textContent = keyValue
    } else {
      display.textContent = displayValue + keyValue
    }

    // Clear operator states every time a number type is clicked
    operatorKeys.forEach(key => { key.dataset.state = '' })
  }

  // Check if type is operator
  if (type === "operator") {
    // Resets the decimal key to be used for new input
    decimalKey.classList.remove("disabled")

    // Checks if other operators are selected and clears their selected state
    const currentActiveOperator = calculator.querySelector('[data-state="selected"]')
    if (currentActiveOperator) {
      currentActiveOperator.dataset.state = ""
    }

    // Assigns selected state to the clicked on operator
    key.dataset.state = "selected";

    // Check if current operator has changed, if true reassign the data-operator attribute
    if (changed) {
      calculator.dataset.operator = key.dataset.key
    } 
    // If not, perform the following:
    else {
      // If data-operator is defined, data-lastOperator takes the value of current operator
      if (calculator.dataset.operator !== undefined) {
        calculator.dataset.lastOperator = calculator.dataset.operator
      }
      // If data-lastOperator is defined, operate the two previous numbers and update the display
      if (calculator.dataset.lastOperator !== undefined) {
        const result = operate(calculator.dataset.firstNumber, calculator.dataset.lastOperator, displayValue)
        display.textContent = result
        calculator.dataset.firstNumber = result
        console.log("firstnumber = ", calculator.dataset.firstNumber," ", calculator.dataset.operator, " secondnumber = ", calculator.dataset.secondNumber)
      }
      // If neither cases apply, firstNumber is now the displayValue
      else {
        calculator.dataset.firstNumber = displayValue
      }
      // Update data-operator
      calculator.dataset.operator = key.dataset.key
    }
  // If an operator was pressed before, its state is emptied
  } else if (previousKeyType === "operator") {
    key.dataset.state = ""
  }

  // Check if type is equals
  if (type === "equal") {
    // Perform a calculation
    const firstNumber = calculator.dataset.firstNumber;
    const operator = calculator.dataset.operator;
    const secondNumber = displayValue;

    // Handling multiple equal presses
    if (previousKey === "equal") {
      return
    }

    // Updates the displayed value
    display.textContent = operate(firstNumber, operator, secondNumber);
    console.log("firstnumber = ", firstNumber," ", operator, " secondnumber = ", secondNumber)
  }

  // Check if clear key is pushed
  if (type === "clear") {
    display.textContent = "0"

    // Equals key reinitializes disabled
    equalKey.classList.add("disabled")

    // Clears out all the data-attributes from the dataset
    delete calculator.dataset.firstNumber
    delete calculator.dataset.operator
    delete calculator.dataset.secondNumber
    delete calculator.dataset.previousKeyType
    delete calculator.dataset.previousKey
  }

  if (type === "delete") {
    // Delete the last value typed or pressed
    display.textContent = display.textContent.toString().slice(0, -1)
    // If the last digit is erased, impose a 0
    if (display.textContent.length === 0) {
      display.textContent = "0"
    }
  }

  // Reassigns the 'previous' data-attributes every button click
  calculator.dataset.previousKeyType = type
  calculator.dataset.previousKey = key.dataset.key
});

// Adding keyboard support
// Sometimes typing in the window triggers the searchbar to open in the browser, this option must be disabled in the browser settings to properly use key presses
// It won't disable the ' and / keys which can still open the Quick Find bar to search for links. Press Escape to close it and carry on
// I don't know how to circumvent this yet
document.onkeydown = function(event) {
  let keyPress = event.key
  // Checks if the key presses are allowed in the calculator
  if ('1234567890/*-+.'.includes(keyPress)){
    if (keyPress === '1') { 
    keys.querySelector('[data-key="1"]').click()
    }
    if (keyPress === '2') { 
    keys.querySelector('[data-key="2"]').click()
    }
    if (keyPress === '3') { 
    keys.querySelector('[data-key="3"]').click()
    }
    if (keyPress === '4') { 
    keys.querySelector('[data-key="4"]').click()
    }
    if (keyPress === '5') { 
    keys.querySelector('[data-key="5"]').click()
    }
    if (keyPress === '6') { 
    keys.querySelector('[data-key="6"]').click()
    }
    if (keyPress === '7') { 
    keys.querySelector('[data-key="7"]').click()
    }
    if (keyPress === '8') { 
    keys.querySelector('[data-key="8"]').click()
    }
    if (keyPress === '9') { 
    keys.querySelector('[data-key="9"]').click()
    }
    if (keyPress === '0') { 
      keys.querySelector('[data-key="0"]').click()
    }
    if (keyPress === '+') { 
      keys.querySelector('[data-key="plus"]').click()
    }
    if (keyPress === '-') { 
      keys.querySelector('[data-key="minus"]').click()
    }
    if (keyPress === '*') { 
      keys.querySelector('[data-key="times"]').click()
    }
    if (keyPress === '/') { 
      keys.querySelector('[data-key="divide"]').click()
    }
  }

  // Adding support for = using 'Enter' in numpad
  if (keyPress === 'Enter'){
    if (equalKey.classList.contains('disabled')) { 
      return 
    }
    else { 
      equalKey.click()
    }
  }

  // Adding support for Backspace
  if (keyPress === 'Backspace'){
    deleteKey.click()
  }

  // Adding support for ESC to clear all variables
  if (keyPress === 'Escape'){
    clearKey.click();
  }
}

// Returns result to pass to the displayValue
function operate(firstNumber, operator, secondNumber) {
  firstNumber = parseFloat(firstNumber)
  secondNumber = parseFloat(secondNumber)
  // Evaluating
  if (operator === "plus") return firstNumber + secondNumber
  if (operator === "minus") return firstNumber - secondNumber
  if (operator === "times") return firstNumber * secondNumber
  if (operator === "divide") return firstNumber / secondNumber
}

function clearCalculator() {
  // Press the clear key
  clearKey.click()

  // Clear operator states
  operatorKeys.forEach((key) => {
    key.dataset.state = ""
  });
}
