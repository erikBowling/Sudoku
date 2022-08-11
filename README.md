# Sudoku

This was a project to practice recursion mostly. The functionality for playing the game isn't done yet, but I'll be working on that soon.
The project pulls a random board from a sudoku puzzle generator API as JSON, creates a 2d array to represent the board.
If the user presses solve, it recusively goes square by square trying the numbers 1 through 9. If the only option is a number that doesn't work, it goes back up the stack and places a different number in a previous square.
