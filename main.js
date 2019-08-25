const startApp = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.querySelector('.calculator');
    const inputDisplay = calculator.querySelector('.calculator__input');
    const resultDisplay = calculator.querySelector('.calculator__result');
    const calculatorKeys = calculator.querySelectorAll('.calculator__keys button');

    /**************************************************************
    Start of Section for detecting if user agent is a mobile device
    in order to disable device keyboard for input
    ***************************************************************/
    (function(a, inputElement){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){inputElement.setAttribute('readonly', 'readonly')}else{inputElement.removeAttribute('readonly')}})(navigator.userAgent||navigator.vendor||window.opera, inputDisplay);
    /**************************************************************
    End of Section for detecting if user agent is a mobile device
    in order to disable device keyboard for input
    ***************************************************************/


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
