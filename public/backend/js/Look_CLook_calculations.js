const maxRows = 20;
const minRows = 1;

var seekSequence = [];
var seekTime = 0;
var headPosition;
var diskSize = 0;

function addRow() {
  var table = document.getElementById("req-seq");
  var count = table.rows.length;

  // disabling the Remove Button if only one row is present
  if (count == minRows + 1) {
    var removeBtn = document.getElementById("remove");
    removeBtn.disabled = false;
  }
  // disabling the Add Button if only 20 rows are present
  if (count == maxRows) {
    var addBtn = document.getElementById("add");
    addBtn.disabled = true;
  }
  if (count < minRows + 1 || count > maxRows) return;

  // by clicking the add button a new row will be added according the already present format with number and a new text field
  var row = table.insertRow(count);
  var th = document.createElement("th");
  th.innerHTML = count;
  th.scope = "row";
  var td = document.createElement("td");
  var input = document.createElement("input");
  input.type = "text";
  input.id = "req-seq" + count;
  td.appendChild(input);
  row.appendChild(th);
  row.appendChild(td);
}

function removeRow() {
  var table = document.getElementById("req-seq");
  var count = table.rows.length;
  count--;
  if (count == maxRows) {
    var addBtn = document.getElementById("add");
    addBtn.disabled = false;
  }
  if (count == minRows + 1) {
    var removeBtn = document.getElementById("remove");
    removeBtn.disabled = true;
  }
  if (count < minRows + 1 || count > maxRows) return;
  table.deleteRow(count);
}

// function to calculate clook scheduling
function clook() {
  var headPos = 0;
  headPos = document.getElementById("head-pos").value;
  diskSize = document.getElementById("disk-size").value;
  headPos = parseInt(headPos);
  headPosition = headPos;
  diskSize = parseInt(diskSize);

  FetchRequest(diskSize, headPos);

  // alerts for any improper inputs
  if (!Number.isInteger(headPos) || !Number.isInteger(diskSize)) {
    alert("Please enter an Integer in Disk Size and Head Position.");
    return false;
  }
  if (headPos < 0 || diskSize < 0) {
    alert("Invalid Input, Disk Size or Head Position should not be negative.");
    return false;
  }
  if (headPos > diskSize) {
    alert(
      "Invalid Head Position. Head Position should be less than or equal to Disk Size."
    );
    return false;
  }

  var direction = document.getElementById("Right").checked;
  var arr = takeInput();
  if (arr === undefined) return false;
  $("#btn-clook").prop("disabled", true);
  $("#btn-look").prop("disabled", true);
  var answer = clookScheduling(arr, headPos, direction);
  var result = document.getElementById("result");
  var seekCnt = document.createElement("p");
  seekCnt.innerHTML = "Total Seek Count: " + answer.seekCount;
  var seekSq = document.createElement("p");
  seekSq.innerHTML = "Seek Sequence: " + answer.seekSeq;
  result.innerHTML = "";
  $(".output").css("visibility", "visible");
  result.appendChild(seekCnt);
  result.appendChild(seekSq);
  seekSequence = answer.seekSeq;
  seekTime = answer.seekCount;
}

function resetPage() {
  location.reload();
}

// function to calculate the look scheduling
function look() {
  var headPos = 0;
  headPos = document.getElementById("head-pos").value;
  diskSize = document.getElementById("disk-size").value;
  headPos = parseInt(headPos);
  headPosition = headPos;
  diskSize = parseInt(diskSize);

  console.log(diskSize);
  console.log(headPos);
  console.log(typeof(diskSize));
  console.log(typeof(headPos));

  FetchRequest(diskSize, headPos);

  if (!Number.isInteger(headPos) || !Number.isInteger(diskSize)) {
    alert("Please enter an Integer in Disk Size and Head Position.");
    return false;
  }
  if (headPos < 0 || diskSize < 0) {
    alert("Invalid Input, Disk Size or Head Position should not be negative.");
    return false;
  }
  if (headPos > diskSize) {
    alert(
      "Invalid Head Position. Head Position should be less than or equal to Disk Size."
    );
    return false;
  }
  var direction = document.getElementById("Right").checked;
  var arr = takeInput();
  if (arr === undefined) return false;
  $("#btn-clook").prop("disabled", true);
  $("#btn-look").prop("disabled", true);
  var answer = lookScheduling(arr, headPos, direction);
  var result = document.getElementById("result");
  var seekCnt = document.createElement("p");
  seekCnt.innerHTML = "Total Seek Count: " + answer.seekCount;
  var seekSq = document.createElement("p");
  seekSq.innerHTML = "Seek Sequence: " + answer.seekSeq;
  result.innerHTML = "";
  $(".output").css("visibility", "visible");
  result.appendChild(seekCnt);
  result.appendChild(seekSq);
  seekSequence = answer.seekSeq;
  seekTime = answer.seekCount;
}

// Function to store the inputs entered by the user
function takeInput() {
  var table = document.getElementById("req-seq");
  var count = table.rows.length;
  var arr = [];
  for (let i = 1; i < count; i++) {
    var inpId = "req-seq" + i;
    arr[i] = document.getElementById(inpId).value;
    let num = parseInt(arr[i]);
    if (!Number.isInteger(num)) {
      alert(
        "Please enter Integer value in #" +
          i +
          " textbox of Request Position Column."
      );
      return undefined;
    }
    if (num > diskSize || num < 0) {
      alert("Invalid Request at Position #" + i + ".");
      return undefined;
    }
  }
  return arr;
}

// Calculation for the order in CLook Scheduling
function clookScheduling(arr, headPos, direction) {
  var seekCount = 0;
  var left = [],
    right = [],
    seekSeq = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < headPos) {
      left.push(arr[i]);
    } else if (arr[i] > headPos) {
      right.push(arr[i]);
    }
  }
  left.sort(function (a, b) {
    return a - b;
  });
  right.sort(function (a, b) {
    return a - b;
  });

  // means the direction is right (moving from left to right)
  if (direction == true) {
    // if the left array is empty
    if (left.length == 0) {
      seekCount = right[right.length - 1] - headPos;
      seekSeq = right;
    }
    // if the right array is empty
    else if (right.length == 0) {
      seekCount = headPos - left[0] + (left[left.length - 1] - left[0]);
      seekSeq = left;
    } else {
      // if the both the arrays are non-empty
      seekCount =
        right[0] -
        headPos +
        (right[right.length - 1] - right[0]) +
        (right[right.length - 1] - left[0]) +
        (left[left.length - 1] - left[0]);

      seekSeq = right.concat(left);
    }
  } else {
    // if the left array is empty
    if (left.length == 0) {
      var revRight = right.reverse();
      seekCount = revRight[revRight.length - 1] - headPos;
      // seekCount = (revRight[0] - headPos) + (revRight[revRight.length - 1] - revRight[0]);
      seekSeq = revRight;
    }
    // if the right array is empty
    else if (right.length == 0) {
      var revLeft = left.reverse();
      seekCount = headPos - revLeft[revLeft.length - 1];
      // seekCount = (headPos - revLeft[0]) + (revLeft[0] - revLeft[revLeft.length - 1]);
      seekSeq = revLeft;
    }
    // if both the arrays are non-empty
    else {
      seekCount =
        headPos -
        left[0] +
        (right[right.length - 1] - left[0]) +
        (right[right.length - 1] - right[0]);

      seekSeq = left.reverse().concat(right.reverse());
    }
  }
  return { seekCount, seekSeq };
}

// Calculation for the order in Look Scheduling
function lookScheduling(arr, headPos, direction) {
  var seekCount = 0;
  var left = [],
    right = [],
    seekSeq = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < headPos) {
      left.push(arr[i]);
    } else if (arr[i] > headPos) {
      right.push(arr[i]);
    }
  }
  left.sort(function (a, b) {
    return a - b;
  });
  right.sort(function (a, b) {
    return a - b;
  });

  // means the direction is right (moving from left to right)
  if (direction == true) {
    // if the left array is empty
    if (left.length == 0) {
      seekCount = right[right.length - 1] - headPos;
      seekSeq = right;
    }
    // if the right array is empty
    else if (right.length == 0) {
      var revLeft = left.reverse();
      seekCount = headPos - revLeft[revLeft.length - 1];
      seekSeq = left;
    }
    // if the both arrays are non empty
    else {
      var revLeft = left.reverse();
      seekCount =
        right[right.length - 1] -
        headPos +
        (right[right.length - 1] - revLeft[0]) +
        (revLeft[0] - revLeft[revLeft.length - 1]);
      seekSeq = right.concat(revLeft);
    }
  } else {
    // if the left array is empty
    if (left.length == 0) {
      seekCount = right[right.length - 1] - headPos;
      seekSeq = right;
    }
    // if the right array is empty
    else if (right.length == 0) {
      var revLeft = left.reverse();
      seekCount = headPos - revLeft[revLeft.length - 1];
      seekSeq = left;
    }
    // if the both arrays are non empty
    else {
      var revLeft = left.reverse();
      seekSeq = revLeft.concat(right);

      seekCount =
        headPos -
        revLeft[revLeft.length - 1] +
        (right[right.length - 1] - revLeft[revLeft.length - 1]);
    }
  }
  return { seekCount, seekSeq };
}

function FetchRequest(diskSize, headPos) {
  const response = fetch(`http://localhost:3000/posts/Look`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ diskSize, headPos }),
  });
  console.log(response);
}
