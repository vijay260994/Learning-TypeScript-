/**
 * @author Vijaykumar Abhichandani
 * This file have two functions to store 10 elements copied from dataset to an array and display only even number elements
 */
var arrData = [];

//The following function will push the 10 records to the array and display the confirmation log on conslole
function addElements(){
    console.log("\n***************Vijaykumar Abhichandani****************\n");
    
    arrData.push("Dryas integrifolia 2016 169 1 12 0 0 AF,IW",
                "Dryas integrifolia 2016 172 1 47 0 0 LP",
                "Dryas integrifolia 2016 175 1 48 0 0 AF,LP",
                "Dryas integrifolia 2016 178 1 48 3 0 LP",
                "Dryas integrifolia 2016 181 1 33 3 0 LP",
                "Dryas integrifolia 2016 184 1 28 8 0 LP",
                "Dryas integrifolia 2016 188 1 11 25 0 LP",
                "Dryas integrifolia 2016 190 1 2  24 7 LP",
                "Dryas integrifolia 2016 193 1 0  8 23 AF",
                "Dryas integrifolia 2016 196 1 0  0 31 LP");
    console.log(arrData.length +" elements added to the array\n");
}

//The following function will use the array of 10 elements and by using for loop and if statement, it will only display the even numbered elements with the array index
function listElements(a){

    console.log("Following is the list of even elements from the array:\n")      
    for(var i = 0 ; i<a.length ; i++) {
        if(i % 2 == 0){
            console.log(i +" "+ a[i]);
        }
     } 
}
addElements();
listElements(arrData);