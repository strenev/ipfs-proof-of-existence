# Design Pattern Decisions

* Circuit Breaker / Pausable

This pattern allows the contract owner to pause and unpause the contract in case of emergency.
The user can interact and store documents only when the contract is not paused.

* Ownable

This pattern allows for the contract owner to be changed. It also ensures that only the owner can withdraw funds from the contract and pause the contract.

* Fail Early and Fail Loud

Through using require, is ensured that the conditions are checked as soon as possible and no unnecessary code is executed.

* Restricting Access

Through using modifiers and private members, it is ensured that only specific addresses can perform specific functions such as pause, unpause and withdrawBalance.
