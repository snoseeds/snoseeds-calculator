const startApp = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.querySelector('.calculator');
    const inputDisplay = calculator.querySelector('.calculator__input');
    const resultDisplay = calculator.querySelector('.calculator__result');
    const calculatorKeys = calculator.querySelectorAll('.calculator__keys button');

    /**************************************************************
    Start of code Section for auto Growing or shrinking input elemnent
    ***************************************************************/
    const charBenchmarkElement = document.querySelector('.character__size__benchmark');
    let characterElementStyles = window.getComputedStyle(charBenchmarkElement);
    let inputDisplayStyles = window.getComputedStyle(inputDisplay);
    let inputParentDivStyles = window.getComputedStyle(inputDisplay.parentNode);
    let characterWidth;
    characterWidth = characterElementStyles.getPropertyValue('width').slice(0, -2);

    window.addEventListener('resize', () => characterWidth = characterElementStyles
      .getPropertyValue('width').slice(0, -2))

    const shrinkWidthOnCharacterDeletion = () => {
      inputDisplay.style.width = `${inputDisplayStyles
        .getPropertyValue('width').slice(0, -2) - characterWidth}px`;
    }

    const resetWidthOnCalculatorReset = () => {
      inputDisplay.style.width = inputParentDivStyles.getPropertyValue('width');
    }

    const growWidthForAutoScroll = () => {
      inputDisplay.style.width = `${inputDisplay.scrollWidth}px`;
    }

    /**************************************************************
    End of code Section for auto Growing or shrinking input elemnent
    ***************************************************************/

    // Make instances of "digit(" and ")(" in str to become "digit*(" and ")*("
    const parseParantheses = expression => {
      let formattedExprxn = expression;
      const arrOfReplacement = expression.match(/(\d\()|(\)\()/g);
      if (arrOfReplacement) {
        arrOfReplacement.forEach(v => 
        formattedExprxn = formattedExprxn.replace(/(\d\()|(\)\()/, v.split('(').join('*(')));
      }
      return formattedExprxn;
    };

    // Getting contiguous no that's been presently edited, to be used for stuffs like testing
    // whether it already has a decimal
    const getEditedNumber = (inputVal, selectionStart) => {
      let lowerOperatorBoundary;
      let upperOperatorBoundary = 0;
      let presentlyEditedNoIdx;
      contiguousNosArray = inputVal.split(/[+\-\/*\(\)]/);
      contiguousNosArray.some((v, i) => {
        lowerOperatorBoundary = upperOperatorBoundary;
        upperOperatorBoundary += v.length + (i === 0 ? 0 : 1);
        if (lowerOperatorBoundary <= selectionStart
          && selectionStart <= upperOperatorBoundary) {
          presentlyEditedNoIdx = i;
          return true;
        }
        return false;
      });
      return contiguousNosArray[presentlyEditedNoIdx]
    };

    // Checks without considering if brackets are balanced, just to check that an operator is included
    // in the element's value, and that the last character of the value isn't an operator,
    // and to check that the second to last character isn't an operator when the last
    // character is a bracket
    const checkIfExprxnCanBeEvaluated = (element, operatorKeyMatcher, bracketKeyMatcher) => {
      const updatedValue = element.value;
      const updatedValueLength = updatedValue.length;
      return bracketKeyMatcher.test(updatedValue[updatedValueLength - 1])
        && operatorKeyMatcher.test(updatedValue[updatedValueLength - 2]) ? false :
        operatorKeyMatcher.test(updatedValue)
        && operatorKeyMatcher.test(updatedValue[updatedValueLength - 1]) === false;          
    };

    const formatResult = result => {
      const customExponentialResult = result.toExponential(7);
      if (/(e\-)|(e+)/.test(result)) return customExponentialResult;
      const resultString = String(result);
      if (resultString.length <= 12) return resultString;
      const customResultStr = String(customExponentialResult);
      return resultString.startsWith('0.') ? result.toFixed(10) :
        customResultStr.endsWith('+0') || customResultStr.endsWith('-0')
        ? customResultStr.split('e')[0] : customResultStr;
    };

    // would be called to compute the state of the calculator when any allowed
    // change happens to the input to show appropriate results
    const displayResult = (inputElement, resultElement, leftBracketNos, rightBracketNos, operatorKeyMatcher, bracketKeyMatcher) => {
      const areBracketsBalanced = leftBracketNos === rightBracketNos ? true : false;
      const evaluableMinusBalancedBrackets = checkIfExprxnCanBeEvaluated(inputElement,
        operatorKeyMatcher, bracketKeyMatcher);
      if (areBracketsBalanced) {
        resultElement.textContent = operatorKeyMatcher.test(inputElement.value) === false
        || evaluableMinusBalancedBrackets
          ? formatResult(eval(parseParantheses(inputElement.value))) : 'waiting';
      } else {
        resultElement.textContent = 'close ()s!';
      }
    };       

    let leftBracketCount = 0;
    let rightBracketCount = 0;

    const allowedGroupsObj = {
      number: {
        signature: /^\d$/,
        route(input, selectionStart, value) {
          if (')' === value[selectionStart - 1]) return 'stop';
        }
      },
      decimal: {
        signature: /\./,
        route(input, selectionStart, value) {
          const numberHasDecimal = getEditedNumber(value, selectionStart).includes('.')
          if (numberHasDecimal || ')' === value[selectionStart - 1]) return 'stop';
        }
      },
      operatorKey: {
        signature: /[+\-\/*]/,
        route(input, selectionStart, value) {
          if (selectionStart === 0 || this.signature.test(value[selectionStart - 1])) return 'stop';
        }
      },
      bracket: {
        signature: /[\(\)]/,
        route(input, selectionStart, value) {
          if (input === ')') {
            if (selectionStart === 0 || value[selectionStart - 1] === '('
              || leftBracketCount < rightBracketCount + 1) return 'stop';
            rightBracketCount++;
          } else {
            leftBracketCount++;
          }
        }
      },
      navigationKey: {
        signature: /(ArrowRight)|(ArrowLeft)/,
        route(input, selectionStart, value) {
          if (input === 'ArrowLeft') {
            if (selectionStart === 0) return 'stop';
            inputDisplay.setSelectionRange(selectionStart - 1, selectionStart - 1);
          } else {
            if (selectionStart === value.length) return 'stop';
            inputDisplay.setSelectionRange(selectionStart + 1, selectionStart + 1);
          }
          return 'stop';
        }
      },
      resetOrRemovalKey: {
        signature: /(Backspace)|(Delete)/,
        route(input, selectionStart, value) {
          if (input === 'Backspace') {
            if (selectionStart === 0) return 'stop';
            const removedItem = value.substr(selectionStart - 1, 1);
            if ('()'.includes(removedItem)) {
              leftBracketCount = removedItem === '(' ? leftBracketCount - 1 : leftBracketCount;
              rightBracketCount = removedItem === ')' ? rightBracketCount - 1 : rightBracketCount;
            }
          } else {
              leftBracketCount = 0;
              rightBracketCount = 0;
              inputDisplay.value = '';
              resultDisplay.textContent = '0';
              resetWidthOnCalculatorReset();
              return 'stop';
          }
        } 
      },
    };
    
    const smartInput = (event) => {
      event.preventDefault();
      const input = event.key;
      let processingGrp;
      const continueProcessing = Object.entries(allowedGroupsObj).some(([groupType, grpObj]) => {
        if (grpObj.signature.test(input)) {
          processingGrp = groupType;
          return true;
        }
        return false;
      })
      if (continueProcessing) {
        let {selectionStart, value} = inputDisplay;
        // Generally allowed entry may not be specifically allowed if it would break
        // the mathematically legal nature of the caluculator's input expression
        if (allowedGroupsObj[processingGrp].route(input, selectionStart, value) === 'stop') return;
        if (input === 'Backspace') {
            inputDisplay.value = value.substr(0, selectionStart - 1) + value.substr(selectionStart, value.length);
            inputDisplay.setSelectionRange(selectionStart - 1, selectionStart - 1);
            if (Number(inputDisplayStyles.getPropertyValue('width').slice(0, -2)) >
              Number(inputParentDivStyles.getPropertyValue('width').slice(0, -2))) {
              shrinkWidthOnCharacterDeletion();
            }
        } else {
          inputDisplay.value = value.substr(0, selectionStart) + input + value.substr(selectionStart, value.length);
          inputDisplay.setSelectionRange(selectionStart + 1, selectionStart + 1);
          growWidthForAutoScroll();
        }
        const operatorKeySignature = allowedGroupsObj.operatorKey.signature;
        const bracketKeySignature = allowedGroupsObj.bracket.signature;        
        displayResult(inputDisplay, resultDisplay, leftBracketCount, rightBracketCount,
          operatorKeySignature, bracketKeySignature);
      }
    };

    function mapScreenKeysClicksToKeyBoard (){
      inputDisplay.focus();
      var evt = new KeyboardEvent('keydown', {'key': this.dataset.action || this.textContent});
      inputDisplay.dispatchEvent(evt);
    }

    calculatorKeys.forEach(key => {
      key.addEventListener('click', mapScreenKeysClicksToKeyBoard)
    });

    inputDisplay.addEventListener('keydown', (event) => {
      smartInput(event);
    });

    inputDisplay.focus();
  });
}

startApp();
