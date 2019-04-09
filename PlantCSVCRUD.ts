/**
 * @author Vijaykumar Abhichandani 040873292
 * Assignment4 tasks:
 * Parse CSV File: Parse dataset into json and store in an array to perform various oprations using switch menu
 * Database Connectivity: Create Database, Use of database driver for successfull connection with postgreSql
 * Create, Read, Update, and Delete options to munipulate data in the database 
 * Asynchronous task: Use of asynchronous tasks to manage the flow of operations in typescript runtime environment 
 * Comment: This file has various funtions to perform parsing, CRUD on database using Asynchronous tasks logic
 */


/** Here the name of database is db and following is the table created in postgres for this assignment:
    create table Plant( id SERIAL PRIMARY KEY,
    species TEXT,
    year INT,
    julianDayofYear INT,
    plantIdentificationNumber INT,
    numberofBuds INT,
    numberofFlowers INT,
    numberofFlowersthathaveReachedMaturity INT,
    observerInitials TEXT
    );
*/

//Initializing required module to use readfilesync,papa parser functions
import { parse } from 'papaparse';
import { readFileSync } from 'fs';

//Initializing required module for inquirer propts and pg-promise functions
const inquirer = require('inquirer');
const pgp = require('pg-promise')();

//Setting up the connection with postgres
const con = { host: 'localhost', port: 5432, database: 'db', user: 'postgres', password: '1234' };
const db = pgp(con);

//reading and adjusting utf8 format of csvfile
let csvFile = readFileSync('./data.csv', 'utf8');
csvFile = csvFile.replace(/^\ufeff/, "");

//Declaring the empty array
let arrData = [];

//calling parseCSV to parse the data and start the operations
parseCSV(csvFile, choiceMenu, arrData);

/**
 * This will parse csv and using callback function to pass the parsed data to next function
 * @param file 
 * @param callBack
 * @source Papaparse.com. (2019). Papa Parse - Powerful CSV Parser for JavaScript. [online] Available at: https://www.papaparse.com/
 */
export function parseCSV(file: string, callBack: any, arrData: any) {
    try {
        parse(file, {
            header: true,
            dynamicTyping: true,
            comments: "#",
            complete: (result) => {
                //copying the parsed data into arrData
                const arrData = result.data;
                //calling the callback function to use data in array
                callBack(arrData);

                return arrData;
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
 * @source Alligator.io. (2019). Interactive Command-line Prompts with Inquirer.js. [online] Available at: https://alligator.io/nodejs/interactive-command-line-prompts/
 */
export function choiceMenu(arrData: any) {
    //diplay the prompt menu to choose an operation
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'choice',
                message: 'Please enter your choice: ',
                choices: ['Insert', 'Show', 'Delete', 'Update']
            },
        ])
        .then(function (answer: any) {

            console.log('Your choice:', answer.choice);
            //switch block will select the operation based on user's choice on console
            switch (answer.choice) {

                case 'Insert':
                    insertPlant(arrData);
                    break;

                case 'Show':
                    showPlant();
                    break;

                case 'Delete':
                    deletePlant();
                    break;

                case 'Update':
                    updatePlant(arrData);
                    break;

                default:
                    console.log('Please enter a valid index');
            }
        });
}

/**
 * Asynchronous function insertPlant which will wait until the prompts are inserted then move to insertion into database
 * Inserts record into plant table in database
 * @param values 
 */
export async function insertPlant(values: any) {
    console.log("\nPrepared by: Vijaykumar Abhichandani\n")
    console.log("\nGreat!! Now go ahead and enter following values: \n");
    await inquirer
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
                name: 'juliandayofyear',
                message: 'Please enter value for Julian day of the year: '
            },
            {
                name: 'plantidentificationnumber',
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
                name: 'numberofflowersthathavereachedmaturity',
                message: 'Please enter value for Matured Flowers: '
            },
            {
                name: 'observerinitials',
                message: 'Please enter value for Observer Initials: '
            },
        ]).then((newrecord: any) => {
            //here pushed new element to the array
            values.push(newrecord);

            //using helper to set the column and values for query
            const cs = new pgp.helpers.ColumnSet(['species', 'year', 'juliandayofyear', 'plantidentificationnumber', 'numberofbuds', 'numberofflowers', 'numberofflowersthathavereachedmaturity', 'observerinitials'], { table: 'plant' });
            const query = pgp.helpers.insert(values, cs);

            //excute query here
            db.none(query)
                .then(() => {
                    console.log("Prepared by: Vijaykumar Abhichandani")
                    console.log("\nData inserted Sucessfully!!!\n")
                    //Calling function below to show all the data from database
                    showPlant();
                })
                .catch((error: string) => {
                    console.error(error);
                });
        }).catch((error: string) => console.error('failed to query db', error));
}

/**
 * Asynchronous function deletePlant which will wait for the data to show to user then it will prompt for the id to delete the record from database
 * It also shows the count of rows deleted from the database
 */
export async function deletePlant() {
    //First this will show all the data to user then move to next operation
    await showPlant();

    //here user can select the id to delete
    inquirer
        .prompt([
            {
                name: 'index',
                message: '\nPlease enter the index of the element from the data that you want to delete: '
            }
        ])
        .then(function (parameters: any) {
            console.log("\nPreapred by Vijaykumar Abhichandani\n");

            //delete query based on the id provided by user
            let query = ('delete from plant where id = $1');
            db.result(query, parameters.index, (res: { rowCount: number; }) => res.rowCount)
                .then((count: number) => {
                    // count = number of rows deleted
                    console.log("Number of rows deleted from database:", count);
                })
                .catch((error: any) => {
                    console.error(error);
                })
        });
}
/**
 * Asynchronous function updatePlant which will wait for the data to show to user then it will prompt for the id to update the record from database
 * @param values 
 */
export async function updatePlant(values: any) {
    //First this will show all the data to user then move to next operation
    await showPlant();

    //here user can enter the id to update the record from the database
    inquirer
        .prompt([
            {
                name: 'index',
                message: '\nPlease enter id of the record you want to update: '
            },
        ])
        .then(function (parameters: any) {
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
                        name: 'juliandayofyear',
                        message: 'Please enter value for Julian day of the year: '
                    },
                    {
                        name: 'plantidentificationnumber',
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
                        name: 'numberofflowersthathavereachedmaturity',
                        message: 'Please enter value for Matured Flowers: '
                    },
                    {
                        name: 'observerinitials',
                        message: 'Please enter value for Observer Initials: '
                    },
                ])
                .then(function (newrecord: any) {

                    //creating one json object of the values for the record to be updated
                    let updatedrecord = Object.assign(parameters, newrecord);

                    //crating the update query based on selected id by user
                    const cs = new pgp.helpers.ColumnSet(['?id', 'species', 'year', 'juliandayofyear', 'plantidentificationnumber', 'numberofbuds', 'numberofflowers', 'numberofflowersthathavereachedmaturity', 'observerinitials'], { table: 'plant' });
                    const query = pgp.helpers.update(updatedrecord, cs) + ' WHERE id =' + updatedrecord.index;

                    //excute query here
                    db.none(query)
                        .then(() => {
                            console.log("Prepared by: Vijaykumar Abhichandani")
                            console.log("\nData updated Sucessfully!!!\n")
                            //Calling function below to show the updated data from database
                            showPlant();
                        })
                        .catch((error: string) => {
                            console.error(error);
                        });
                }).catch((error: string) => console.error('failed to query db', error));

        });
}

/**
 * Asynchronous function showPlant which will wait to fetch all the data from the database then show on the screen
 * @returns  
 */
export async function showPlant() {
    console.log("Prepared by: Vijaykumar Abhichandani")
    //getting ready with query
    let query = 'select * from Plant';
    let res: any;

    //execute query here
    await db.each(query, [], (plant: any) => {
        res = plant;
        console.log(res);
    }).catch((error: string) => console.error('failed to query db', error));
    return res;
}