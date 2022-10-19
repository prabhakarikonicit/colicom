import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  // calculator state
  displayValue: any = 0;                    //current value displayed on calculator screen
  valueA: any = 0;                          //first (left) value that will be used for computation
  valueB: any = 0;                          //second (right) value that will be used for computation
  selectedOperation: any = null;            //last operation selected by user
  clearValue = true;                   //should value displayed on screen be cleared after new digit pressed?

  equalSignKey = { label: "=" };
  //constants
  digitKeys = [
    { label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 },
    { label: "4", value: 4 }, { label: "5", value: 5 }, { label: "6", value: 6 },
    { label: "7", value: 7 }, { label: "8", value: 8 }, { label: "9", value: 9 },
    { label: "0", value: 0 }, { label: ".", value: '.' }
  ];
  operationKeys = [
    {
      label: "/", operation: (a: number, b: number) => {
        return a / b;
      }
    },
    {
      label: "*", operation: (a: number, b: number) => {
        return a * b;
      }
    },
    {
      label: "+", operation: (a: number, b: number) => {
        return a + b;
      }
    },
    {
      label: "-", operation: (a: number, b: number) => {
        return a - b;
      }
    }
  ];
  constructor() { }

  ngOnInit(): void {

  }

  // actions
  /**
   * When digit is clicked, it should be added to displayed value or replace displayed value.
   * Also new displayed value should be treated as second operation value.
   * @param digit what digit was clicked
   */
  digitClicked(digit: any) {
    if (this.clearValue) {
      this.displayValue = digit;
      this.clearValue = false;
    } else {
      this.displayValue = String(this.displayValue) + String(digit);
    }

    this.valueB = this.displayValue;
  };

  /**
   * When operation key is clicked operation should be remembered,
   * displayed value should be treated as first and second number to perform operation on
   * and next pushed digit should replace the displayed value
   * @param operation which operation was clicked
   */
  operationClicked(operation: Function) {
    this.selectedOperation = operation;
    this.valueA = this.displayValue;
    this.valueB = this.displayValue;
    this.clearValue = true;
  };

  /**
   * Computes the result based on remembered operation and two values and displays the result.
   * Also next pushed digit should replace the displayed value
   * and current result should be treated as first value for next operation.
   */
  compute() {
    if (this.selectedOperation !== null) {
      this.displayValue = this.selectedOperation(Number(this.valueA), Number(this.valueB));
      this.displayValue = Math.round(this.displayValue * 1000000) / 1000000; // round to 6 decimal places
      this.clearValue = true;
      this.valueA = this.displayValue;
    }
  };

  clear() {
    this.displayValue = 0;
    this.valueA = 0;
    this.valueB = 0;
    this.selectedOperation = null;
    this.clearValue = true;
  };


}
