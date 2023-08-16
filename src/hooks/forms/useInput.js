import { useState } from "react";

const DEFAULT_VALUE = '';

const useInput = ({ defaultValue = DEFAULT_VALUE, initialValue, validateValue }) => {

    const [enteredValue, setEnteredValue] = useState(initialValue || defaultValue);
    const [isTouched, setIsTouched] = useState(false);

    const valueIsValid = validateValue(enteredValue);
    const hasError = isTouched && !valueIsValid

    const valueChangeHandler = (event) => {
        setEnteredValue(event.target.value);
        setIsTouched(true);
    }
    const inputBlurHandler = () => setIsTouched(true);

    const reset = () => {
        setEnteredValue(defaultValue);
        setIsTouched(false);
    }

    return {
        value: enteredValue,
        setValue: setEnteredValue,

        isTouched,
        setIsTouched,

        isValid: valueIsValid,
        hasError,

        valueChangeHandler,
        inputBlurHandler,

        reset
    };
}

export default useInput