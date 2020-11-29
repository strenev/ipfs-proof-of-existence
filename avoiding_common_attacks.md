# Avoiding Common Attacks

* Integer Overflow and Underflow

Using the SafeMath library for all types of mathematical operations ensures that no integer overflow/underflow issues occur.

* Re-entracy Attacks

By doing the internal work before making external function calls, it is ensured that no re-entrancy attacks can occur. 
Examples can be seen in withdrawBalance and saveProofOfExistence functions.