# snoseeds-calculator
Front End JavaScript Powered Simple Mathematical Calculator

It's deployed to `gh-pages` at `https://snoseeds.github.io/snoseeds-calculator/`.

The unique features of this calculator app that enables click and keyboard interaction for desktop clients, while preventing keyboard interaction for mobile clients for good user experience include:

Using two simultaneous screens for input and output, real-time results without needing to press equality operator, using expandable brackets without needing to explicitly use multiplication operator, editable inputs even after computation, proofing that prevents entry of invalid mathematical expressions like multiple decimals in a single number (this becomes interesting when considering that the inputs can even still be edited after computation), contiguous operators, and so much more.

A more intriguing thing is the program flow used in the calculator, click events were made to generate keyboard events, and I was thereby able to prevent redundancy by handling all the interactions to the calculator as keyboard events only, which led to a single source of truth in application logic, with dividends spanning better clarity and maintainability of the code.

