const form = document.getElementById("form");
const billInput = document.getElementById("bill-input");
const peopleInput = document.getElementById("people-input");
const billErrorMessage = document.getElementById("bill-error-message");
const peopleErrorMessage = document.getElementById("people-error-message");
const discountButtons = document.querySelectorAll(".discount-button");
const customButton = document.getElementById("custom-discount");
const resetButton = document.getElementById("reset-button");
const tipValue = document.querySelector(".tip-value");
const totalValue = document.querySelector(".total-value");
const discountButtonsArray = Array.from(discountButtons);
let selectedTip = null;

// This function updates the error object with the expected error messages (if any).
function handleErrorObject(errorMessage, key, errorsObject) {
    errorsObject[key] = errorMessage;
}

// This function renders error messages to the screen if the form data is invalid.
function handleErrorMessages(errorsObject) {
    if ("bill" in errorsObject) {
        billErrorMessage.textContent = errorsObject.bill;
        billErrorMessage.style.visibility = "visible";
        billInput.style.outline = "2px solid hsl(4, 100%, 67%)";
    }
    if ("people" in errorsObject) {
        peopleErrorMessage.textContent = errorsObject.people;
        peopleErrorMessage.style.visibility = "visible";
        peopleInput.style.outline = "2px solid hsl(4, 100%, 67%)";
    }
}

// This function calculates the total cost based on the input data that is submitted.
function calculateTotalCost(bill, personCount, tip) {
    const totalTip = (tip * bill) / 100;
    let tipAmount = totalTip / personCount;
    let totalAmount = bill / personCount + tipAmount;
    tipAmount = tipAmount.toFixed(2);
    totalAmount = totalAmount.toFixed(2);
    return { tipAmount, totalAmount };
}

// This function renders the total cost to the screen when the form data is valid.
function handleCostOutput(costObject) {
    tipValue.textContent = costObject.tipAmount;
    totalValue.textContent = costObject.totalAmount;
}

// This function checks the validity of the form data.
function handleInputData(key, value, errorsObject) {
    if (!value) {
        handleErrorObject("Can't be empty", key, errorsObject);
    }
    const number = parseInt(value);
    if (number === 0) {
        handleErrorObject("Can't be zero", key, errorsObject);
    }
}

// This function returns true if the form-data is valid, otherwise it returns false.
function dataIsValid(data, errorsObject) {
    Object.keys(data).forEach((key) => {
        handleInputData(key, data[key], errorsObject);
    });
    const isValid = Object.keys(errorsObject).length === 0;

    return isValid;
}

// This function handles the form submission.
const handleFormSubmit = (e) => {
    e.preventDefault();
    // retrieve the form data.
    const formData = new FormData(e.currentTarget);
    // convert the form data entries into an object.
    const data = Object.fromEntries(formData);
    // initialize empty errors-object.
    const errorsObject = {};
    // check if data is valid and return error-messages if invalid.
    if (!dataIsValid(data, errorsObject)) {
        handleErrorMessages(errorsObject);
        return;
    }
    // calculate tip and total amount with valid form data.
    const costObject = calculateTotalCost(parseFloat(data.bill), parseInt(data.people), parseInt(selectedTip));
    // render correct tip and total cost of the bill per person.
    handleCostOutput(costObject);
};

// This function resets the styling of the selected tip button.
const resetSelectedTip = () => {
    const selectedTipButton = discountButtonsArray.find((discountButton) => discountButton.value === selectedTip);
    selectedTipButton.classList.remove("selected-tip");
};

// This function handles the logic for selecting a tip-button.
const selectTipHandler = (e) => {
    // select a tip if none has been selected.
    if (!selectedTip) {
        selectedTip = e.currentTarget.value;
        e.currentTarget.classList.add("selected-tip");
    } else {
        // if one has already been selected, reset it's style before selecting a new tip.
        resetSelectedTip();
        selectedTip = e.currentTarget.value;
        e.currentTarget.classList.add("selected-tip");
    }
};

// This function handles the styling logic when an input is focused.
const onFocusHandler = (e) => {
    //e.currentTarget.style.border = "none";
    e.currentTarget.style.outline = "2px solid hsl(172, 67%, 45%)";
    e.currentTarget.style.cursor = "pointer";
};

// This function handles the styling logic when an input is out of focus.
const onBlurHandler = (e) => {
    e.currentTarget.style.outline = "none";
    e.currentTarget.style.cursor = "default";
};

// This function handles the logic for when the custom input is out of focus.
const onBlurCustomTipInputHandler = (e) => {
    e.currentTarget.parentNode.replaceChild(customButton, e.currentTarget);
    resetButton.style.backgroundColor = "hsl(172, 40%, 30%)";
    resetButton.style.cursor = "default";
};

// This function handles the logic for when the custom tip input receives a value.
const customTipInputFormHandler = (e) => {
    // retrieve the form data.
    const formData = new FormData(form);
    // convert the form data entries into an object.
    const data = Object.fromEntries(formData);
    // initialize empty errors-object.
    const errorsObject = {};
    // check if data is valid and return error-messages if invalid.
    if (!dataIsValid(data, errorsObject)) {
        handleErrorMessages(errorsObject);
        return;
    }
    // calculate tip and total amount with valid form data.
    const costObject = calculateTotalCost(
        parseFloat(data.bill),
        parseInt(data.people),
        parseInt(e.currentTarget.value)
    );
    // render correct tip and total cost of the bill per person.
    handleCostOutput(costObject);
};

/* Event Listeners */

customButton.addEventListener("click", (e) => {
    const inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.placeholder = "Enter a tip";
    inputElement.addEventListener("focus", onFocusHandler);
    inputElement.addEventListener("blur", onBlurCustomTipInputHandler);
    inputElement.addEventListener("keyup", (e) => {
        if (!e.currentTarget.value && !billInput.value && !peopleInput.value) {
            resetButton.style.backgroundColor = "hsl(172, 40%, 30%)";
            resetButton.style.cursor = "default";
        } else {
            resetButton.style.backgroundColor = "aquamarine";
            resetButton.style.cursor = "pointer";
        }
        if (e.currentTarget.value) customTipInputFormHandler(e);
    });
    e.currentTarget.parentNode.replaceChild(inputElement, e.currentTarget);
});

discountButtonsArray.forEach((discountButton) => {
    discountButton.addEventListener("click", selectTipHandler);
});

resetButton.addEventListener("click", (e) => {
    if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === "rgb(46, 107, 99)") return;
    billInput.value = "";
    billInput.style.outline = "none";
    billErrorMessage.textContent = "";
    peopleInput.value = "";
    peopleInput.style.outline = "none";
    peopleErrorMessage.textContent = "";
    tipValue.textContent = "0.00";
    totalValue.textContent = "0.00";
    e.currentTarget.style.backgroundColor = "hsl(172, 40%, 30%)";
    e.currentTarget.style.cursor = "default";
    resetSelectedTip();
});

billInput.addEventListener("focus", onFocusHandler);

billInput.addEventListener("blur", onBlurHandler);

billInput.addEventListener("keyup", (e) => {
    if (!e.currentTarget.value && !peopleInput.value) {
        resetButton.style.backgroundColor = "hsl(172, 40%, 30%)";
        resetButton.style.cursor = "default";
    } else {
        resetButton.style.backgroundColor = "aquamarine";
        resetButton.style.cursor = "pointer";
    }
});

peopleInput.addEventListener("focus", onFocusHandler);

peopleInput.addEventListener("blur", onBlurHandler);

peopleInput.addEventListener("keyup", (e) => {
    if (!e.currentTarget.value && !billInput.value) {
        resetButton.style.backgroundColor = "hsl(172, 40%, 30%)";
        resetButton.style.cursor = "default";
    } else {
        resetButton.style.backgroundColor = "aquamarine";
        resetButton.style.cursor = "pointer";
    }
});

form.addEventListener("submit", handleFormSubmit);
