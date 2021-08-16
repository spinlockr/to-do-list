var addbtn = document.getElementById('addbtn');
var deletebtn = document.getElementById('deletebtn');
var appendingDiv = document.getElementById('appendingDiv');
var taskItemNumber = 0;

window.addEventListener('load', getPreviousItems);
addbtn.addEventListener('click', createListItem);
inputbox.addEventListener('keydown', returnKey);

function createListItem(){

    sendNewItem();

    let itemName = document.getElementById('inputbox');

    let listItem = `
    
    <div class="itemscontainer" id ='itemscontainer${taskItemNumber}'>
    
        <div class="itemcontainer" id='itemcontainer${taskItemNumber}'>

            <button class='listitem' id='listitem${taskItemNumber}'><span id='name'>${itemName.value}</span></button>
            <button class='completebutton' id='completebtn${taskItemNumber}' onclick='completeTask(${taskItemNumber});'>Complete</button>
            <button class='deletebutton' id='deletebtn${taskItemNumber}' onclick='deleteTask(${taskItemNumber});'>Delete</button>

        </div>

    </div>

    `;

    if(itemName.value == ''){

        itemName.placeholder = `Please enter an item`

        itemName.style.borderBottom = '2.5px solid #cd2424';

    } 

    else {

        appendingDiv.innerHTML += listItem ;

        taskItemNumber++;
    
        itemName.value = '';

        itemName.placeholder = 'Your list item goes here'

        itemName.style.borderBottom = '';

    }
    
} 

function sendNewItem(){

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/senditem');
    xhr.setRequestHeader("Content-type", "application/json");

    let itemName = document.getElementById('inputbox').value;
    let date = new Date().getTime();
    let item = {

        "taskDescription": itemName,
        "date": date

    }

    console.log(item); console.log(itemName);
    xhr.send(JSON.stringify(item));

}

function getPreviousItems(){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getitems');
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {

        if(xhr.readyState == 4){

            let resultJSON = JSON.parse(xhr.responseText);

            resultJSON.forEach(function(item){

                insertItem(item);
                console.log(item.description);

            })

        }

     };

    xhr.send();

}

function insertItem(item){

    let listItem = `
    
    <div class="itemscontainer" id ='itemscontainer${taskItemNumber}'>
    
        <div class="itemcontainer" id='itemcontainer${taskItemNumber}'>

            <button class='listitem' id='listitem${taskItemNumber}'><span id='name'>${item.description}</span></button>
            <button class='completebutton' id='completebtn${taskItemNumber}' onclick='completeTask(${taskItemNumber});'>Complete</button>
            <button class='deletebutton' id='deletebtn${taskItemNumber}' onclick='deleteTask(${taskItemNumber});'>Delete</button>

        </div>

    </div>

    `;

    appendingDiv.innerHTML += listItem ;
    taskItemNumber++;

}

function returnKey(e){

    if(e.keyCode == 13){

        createListItem();

    }

} 

function completeTask(taskItemNumber){

    let listitem = document.getElementById('listitem' + taskItemNumber);
    let completeBtn = document.getElementById('completebtn' + taskItemNumber);
    

    if(completeBtn.innerText == 'Complete'){

        completeBtn.innerText = 'Completed';

        listitem.style.backgroundColor = '#12b337';

    } else{
        
        completeBtn.innerText = 'Complete';

        listitem.style.backgroundColor = 'white';

    }

}

function deleteTask(taskItemNumber){

    let container = document.getElementById('itemscontainer' + taskItemNumber);
    container.remove();  

}

