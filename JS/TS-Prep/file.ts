/** @format */

// /** @format */

// if(){
//   else{

//   }
// }

// while(){

// }

// do{

// }while();

// for(){

// }

// arrays: length, slice, in***, push, pop, reduce, map, filter, sort
// strings: length, slice, in***, split, trim, parseInt, toString, push, pop, reduce, map, filter, sort, indexOf

// const addA = (a, b) => a + b;

// function addB(a, b) {
//   a + b;
// }

// Object

// Classes

const expenses = [2, 3, 4, 5, 6, 5];
const sum = expenses.reduce((acc, curr) => acc + curr, 0);
console.log(sum);

const highestVal = Math.max(...expenses);
const lowesttVal = Math.min(...expenses);
console.log(highestVal, lowesttVal);

const studentNames = ["John", "Jane", "Jack", "Jill"];
studentNames.unshift("James");
console.log(studentNames);
studentNames.pop();
console.log(studentNames);
studentNames.sort();
console.log(studentNames);

const productPrices = [10, 20, 30, 40, 50];
const discount = productPrices.map((price) => price * 0.1);
console.log(discount);
const discountedPrices = productPrices.map(
  (price, index) => price - discount[index]
);
console.log(discountedPrices);

const affordableProducts = discountedPrices.filter((price) => price < 40);
console.log(affordableProducts);

const totalAffordable = affordableProducts.reduce((acc, curr) => acc + curr, 0);
console.log(totalAffordable);
