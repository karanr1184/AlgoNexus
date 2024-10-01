/* Function for inputs */
function GetCellValues() {
  /* Declaring variables */
  var pid = [];
  var at = [];
  var bt = [];
  var flag = []; // Array to store the status of processes

  let burstTime = document.getElementById("burstTime").value;  /* Accessing Burst Time */  
  let arrivalTime = document.getElementById("arrivalTime").value;  /* Accessing Arrival Time */  

  // Adjusting the input of burst time
  burstTime = burstTime.trim(); // Removing the extra spaces from the string
  burstTime = burstTime.split(" "); // Splitting the numbers of the string
  burstTime = burstTime.filter((num) => num.trim() != " "); // Removing the extra spaces in between the strings
  burstTime = burstTime.filter((num) => Number(num) > 0); // Removing the negative numbers from the string

  // Adjusting the array of arrival time
  arrivalTime = arrivalTime.trim(); // Removing the extra spaces from the string
  arrivalTime = arrivalTime.split(" "); // Splitting the numbers of the string
  arrivalTime = arrivalTime.filter((num) => num.trim() != ""); // Removing the extra spaces in between the strings
  arrivalTime = arrivalTime.filter((num) => Number(num) > -1); // Removing the negative numbers from the strings


  // Handling Exceptions by giving alerts in case of any improper inputs
  if (burstTime == "" && arrivalTime == "") {
    alert("Please insert some data first!!");
  } else if (burstTime.length != arrivalTime.length) {
    alert("Please enter appropriate values!");
  } else {
    $(".outputSection").css("display", "block");

    // Copying the burst time values in the array
    for (let i = 0; i < burstTime.length; i++) {
      burstTime[i] = Number(burstTime[i]);
      bt.push(Number(burstTime[i]));
    }

    // Copying the arrival time, process ids in the array
    for (let i = 0; i < arrivalTime.length; i++) {
      arrivalTime[i] = Number(arrivalTime[i]);
      at.push(Number(arrivalTime[i]));
      pid.push("P" + (i + 1));  // Pushing the process ids
      flag.push(0);  // Initializing flag array with all elements 0 initially
    }

    // After the calculations of SJF, storing completion time, turn around time and waiting time in items array /* */
    var items = [];
    items = nonPreemptiveSelection(pid, at, bt, flag);
    return items;
  }
}


// Function to calculate completion time, turn around time and waiting time
function nonPreemptiveSelection(pid, at, bt, flag) {
  // Declaring the local variables
  var n = pid.length;
  var clock = 0;
  var tot = 0;
  var items = [];
  var ct = [];
  var ta = [];
  var wt = [];
  var avgwt = 0;
  var avgta = 0;
  var executionOrder = []; // Used to store the order of execution order of processes temporarily /* */

  while (true) {
    var min = 999;
    var c = n; // 'c' represents the current PID /* */

    if (tot == n)
      // Total no of process = completed process loop will be terminated /* */
      break;

    for (var i = 0; i < n; i++) {
      /*
       * If i'th process arrival time <= system time and its flag=0 and burst<min
       * means processed has arrived and its burst time is minimum, then that process will be executed first
       */
      var count = 0;
      if (at[i] <= clock && flag[i] == 0 && bt[i] < min) {
        min = bt[i];
        c = i;
      }
    }

    /* If c==n means c value can not updated because no process arrival time< system time 
     * means no new processes have arrived and processes who arrived, are executed, so we will increase the system time 
     */
    
    if (c == n) {
      executionOrder.push(1);
      clock++;
    } 
    else {                            /* Else this part will calculate Completion time, turn around time and waiting time */
      let temp = [];                  /* Creating the array to store temporary data*/
      temp.push(pid[c]);              /* Storing PID into array */
      temp.push(bt[c]);               /* Storing Burst Time into array */
      items.push(temp);               /* Storing data for output table*/

      ct[c] = clock + bt[c];          /* Calculation of completion time */ 
      ta[c] = ct[c] - at[c];          /* Calculation of Turn Around time */
      wt[c] = ta[c] - bt[c];          /* Calculation of Waiting time */           

      clock += bt[c];                 /* Increasing the system time, by burst time amount of the current process */
      flag[c] = 1;                    /* Marking that process as executed */
      executionOrder.push(pid[c]);    /* Adding its id into an array */
      tot++;                          /* Increasing the numbber of completed processes */
    }
  }

  /* Calculating average wating time and average turn around time*/
  for (i = 0; i < n; i++) {
    avgwt += wt[i];
    avgta += ta[i];
  }

  avgwt /= n;
  avgta /= n;

  // Writing the fetch request to send the values to our database

  const response = fetch(`http://localhost:3000/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avgwt, avgta })
  });
  console.log(response);

  /* Calling the function to print the output data */
  printStat(at, bt, ct, ta, wt, avgwt, avgta, pid, executionOrder);
  return items;
}

// function for inserting and printing the values that we calculated in the output table /* */
function printStat(at, bt, ct, ta, wt, avgwt, avgta, pid, executionOrder) {
  document.getElementById("wtOutput").innerHTML = avgwt.toFixed(5); /* Accessing Waiting time */
  document.getElementById("taOutput").innerHTML = avgta.toFixed(5); /* Accessing Turn Around time */

  var table_2 = document.getElementById("outputTable"); /* Accessing Output Table */

  /* Deleting the data of previous table */
  for (var i = table_2.rows.length; i > 1; i--) {
    table_2.deleteRow(i - 1);
  }

  /* Creating the Output Table */
  for (var i = 0; i < pid.length; i++) { 
    var firstRow = table_2.insertRow(i + 1);
    var cell1 = firstRow.insertCell(0);
    var cell2 = firstRow.insertCell(1);
    var cell3 = firstRow.insertCell(2);
    var cell4 = firstRow.insertCell(3);
    var cell5 = firstRow.insertCell(4);
    var cell6 = firstRow.insertCell(5);
    cell1.innerHTML = pid[i];
    cell2.innerHTML = at[i];
    cell3.innerHTML = bt[i];
    cell4.innerHTML = ct[i];
    cell5.innerHTML = ta[i];
    cell6.innerHTML = wt[i];
  }

  /* Calling the Function to print Gantt Chart */
  ProgressBar(ct, executionOrder);
}


// function to make the gantt chart
function ProgressBar(ct, executionOrder) 
{
  let temp1 = document.getElementById("ganttChart"); // Accessing gantt chart div element
  let temp2 = document.getElementById("rulerBarRow"); // Accessing rulerbar div element

  // previously added child will be removed when we give input new values and run the process
  if(temp1.hasChildNodes()) {
    $("#ganttChart").empty();
  }

  // Clearing the progress bar
  if(temp2.hasChildNodes()) {
    $("#rulerBarRow").empty();
  }

  // array for the colours of our process to be displayed in the gantt chart
  var array = [
    "bg-primary bg-gradient ",
    "bg-success bg-gradient ",
    "bg-danger bg-gradient ",
    "bg-warning bg-gradient ",
    "bg-info bg-gradient ",
  ];

  // Storing the Process ids and the idle time into an array for gantt Chart
  var newExeOrder = [];
  for (let i = 0; i < executionOrder.length; i++) {  // Calculation of execution order
    let temp = 0;
    if (!(executionOrder[i] == 1)) {
      newExeOrder.push(executionOrder[i]);
    } else {
      var j = i;
      while (executionOrder[j] == 1) {
        temp += 1;
        j++;
      }
      newExeOrder.push(temp);
      i = j - 1;
    }
  }

  // Determining the ruler bar for gantt chart which will display the times of the arrival and completion of our processes
  var rulerBar = [];
  rulerBar[0] = 0;
  for (let i = 0; i < newExeOrder.length; i++) {
    if (typeof newExeOrder[i] == "number") {
      rulerBar.push(rulerBar[rulerBar.length - 1] + newExeOrder[i]);
    } else {
      var ctOfGivenProcess = ct[Number(newExeOrder[i][1]) - 1];
      rulerBar.push(ctOfGivenProcess);
    }
  }

  // Calculating the width percentage for every process and idle time
  var width = [];
  for (let i = 1; i < rulerBar.length; i++) {
    width[i - 1] = ((rulerBar[i] - rulerBar[i - 1]) / ct[ct.length - 1]) * 100;
  }


  // Creating gantt chart
  var element = "";
  var k = 0;
  for (let i = 0; i < newExeOrder.length; i++) {
    if (typeof newExeOrder[i] == "number") {
      element =
        '<div class="progress-bar progress-bar-striped" role="progressbar" style="width: ' +
        width[i] +
        "%; " +
        'background-color:black; aria-valuemin="0" aria-valuemax="100"><span style="font-size:20px; font-weight:600;">'+'Idle'+'</span></div>';
      $("#ganttChart").append(element);
    } else {
      element =
        '<div class="progress-bar' +
        " " +
        array[k % 6] +
        " " +
        '" role="progressbar" style="width: ' +
        width[i] +
        '%" aria-valuemin="0" aria-valuemax="100"><span style="font-size:20px; font-weight:600;">' +
        newExeOrder[i] +
        "</span></div>";
      $("#ganttChart").append(element);
      k++;
    }
  }

  var element="";
  // Displaying the ruler bar
  for (let i = 0; i < rulerBar.length; i++) {
    if(i!=0) {
      element =
      '<div class="progress-bar" role="progressbar" style="text-align: right; width: ' +
      width[i-1] +
      '%" aria-valuemin="0" aria-valuemax="100"><span style="font-size:20px; font-weight:400; color: black; 	background-color: #ECF2FF;">' +
      rulerBar[i] +
      "</span></div>";
    }
    else {
      element =
      '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span style="font-size:20px; font-weight:400; color: black; 	background-color: #ECF2FF;">' +
      rulerBar[i] +
      "</span></div>";
    }
    $("#rulerBarRow").append(element);
  }
}

function printTableData() {}

// Function to Reload the Page /* */
function reloadPage() {
  location.reload();
}