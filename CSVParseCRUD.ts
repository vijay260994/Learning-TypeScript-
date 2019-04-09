/**
 * @author Vijaykumar Abhichandani 040873292
 * This file demonstrates how to import and parse dataset from csv file
 * store that data into an array
 * insert new element to array
 * delete one or more elements at the same time from array
 * update or replace an element from array
 */

//Initializing required module to read file and papa parser
import { parse } from 'papaparse';
import { readFileSync } from 'fs';

//Initializing required module for inquirer prompts
const inquirer = require('inquirer');

//reading of csvfile
const csvFile = readFileSync('./data.csv', 'utf8');

//Declaring the empty array
let arrData = [];

//calling parseCSV here
parseCSV(csvFile, choiceMenu);

/**
 * Parses csv
 * @param file 
 * @param callBack
 * @source Papaparse.com. (2019). Papa Parse - Powerful CSV Parser for JavaScript. [online] Available at: https://www.papaparse.com/ [Accessed 19 Feb. 2019].
 */
export function parseCSV(file: string, callBack: any) {
    console.log("\nPreapred by Vijaykumar Abhichandani\n");
    try {
        parse(file, {
            header: false,
            complete: (result) => {

                //copying the parsed data into arrData
                arrData = result.data;
                
                //calling the choiceMenu from here with array data
                callBack(arrData);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

/**
 * Provide choice to user using Choice menu to perform inset, update, delete operations
 * @param arrData
 * @source Alligator.io. (2019). Interactive Command-line Prompts with Inquirer.js. [online] Available at: https://alligator.io/nodejs/interactive-command-line-prompts/ [Accessed 19 Feb. 2019].
 */
export function choiceMenu(arrData: any) {
    //display the available data in array
    console.log(arrData);

    //diplay the prompt menu to choose an operation
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'choice',
                message: 'Please enter your choice: ',
                choices: ['Insert', 'Delete', 'Update']
            },
        ])
        .then(function (answer: any) {
            
            console.log('Your choice:', answer.choice);
            //switch block will select the operation based on user's choice on console
            switch (answer.choice) {

                case 'Insert':
                    insertData(arrData);
                    break;

                case 'Delete':
                    deleteData(arrData);
                    break;

                case 'Update':
                    updateData(arrData);
                    break;

                default:
                    console.log('Please enter a valid index');
            }
        });
}

/**
 * Inserts data into Array
 * @param arrData 
 */
export function insertData(arrData: any) {
    console.log("\nGreat!! Now go ahead and enter following values: \n");
    inquirer
        .prompt([
            {
                name: 'species',
                message: 'Please enter value for Species: '
            },
            {
                name: 'year',
                message: 'Please enter value for Year: '
            },
            {
                name: 'julianday',
                message: 'Please enter value for Julian day of the year: '
            },
            {
                name: 'plantnumber',
                message: 'Please enter value for Plant Identification Number: '
            },
            {
                name: 'numberofbuds',
                message: 'Please enter value for Number of Buds: '
            },
            {
                name: 'numberofflowers',
                message: 'Please enter value for Number of Flowerts: '
            },
            {
                name: 'maturedflowers',
                message: 'Please enter value for Matured Flowers: '
            },
            {
                name: 'observerinitials',
                message: 'Please enter value for Observer Initials: '
            },
        ]).then((newrecord: any) => {
            //this will convert the the object to new element to be pushed into array
            var resultArray = Object.keys(newrecord).map(function (index) {
                var record = newrecord[index];
                return record;
            });
            //pushed new element to the array
            arrData.push(resultArray);
            console.log("\nPreapred by Vijaykumar Abhichandani\n");
            console.log(arrData);
            return arrData;
        });
}

/**
 * Deletes data from array based on index and number of elements provided by user
 * @param arrData 
 */
export function deleteData(arrData: any) {
    inquirer
        .prompt([
            {
                name: 'index',
                message: 'Please enter start index of the elements you want to delete: '
            },
            {
                name: 'number',
                message: 'How many elements do you want to delete: '
            },
        ])
        .then(function (parameters:any) {
            //removed element(s) from the array
            var removed = arrData.splice(parameters.index, parameters.number);
            console.log("\nPreapred by Vijaykumar Abhichandani\n");
            console.log(arrData);
            console.log("Removed element: ", removed);
        });
}

/**
 * Updates data from thr array data
 * @param arrData 
 */
export function updateData(arrData: any) {
    inquirer
        .prompt([
            {
                name: 'index',
                message: 'Please enter index of the element you want to update: '
            },
        ])
        .then(function (parameters:any) {
            console.log("\nBelow are the values you have selected:\n")
            console.log(arrData[parameters.index]);
            console.log("\n Great!! Now go ahead and enter the new values: \n");
            inquirer
                .prompt([
                    {
                        name: 'species',
                        message: 'Please enter value for Species: '
                    },
                    {
                        name: 'year',
                        message: 'Please enter value for Year: '
                    },
                    {
                        name: 'julianday',
                        message: 'Please enter value for Julian day of the year: '
                    },
                    {
                        name: 'plantnumber',
                        message: 'Please enter value for Plant Identification Number: '
                    },
                    {
                        name: 'numberofbuds',
                        message: 'Please enter value for Number of Buds: '
                    },
                    {
                        name: 'numberofflowers',
                        message: 'Please enter value for Number of Flowerts: '
                    },
                    {
                        name: 'maturedflowers',
                        message: 'Please enter value for Matured Flowers: '
                    },
                    {
                        name: 'observerinitials',
                        message: 'Please enter value for Observer Initials: '
                    },
                ])
                .then(function (newrecord: any) {
                    //this will convert the object into array element to be updated/replaced
                    var resultArray = Object.keys(newrecord).map(function (index) {
                        var record = newrecord[index];
                        return record;
                    });
                    //updated/replaced the specific element of array based on the index selected by user
                    arrData.splice(parameters.index, 1, resultArray);
                    console.log("\nPreapred by Vijaykumar Abhichandani\n");
                    console.log(arrData);
                });
        });
}
