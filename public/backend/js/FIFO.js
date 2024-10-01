// Determines whether the page is fault or hit
function pageFaults(pages, n, noOfFrames) {
  let data = new Set();
  var indexes = [];

  let r = noOfFrames + 3;
  let tableArr = new Array(r);
  for (let i = 0; i < r; i++) {
    tableArr[i] = Array(pages.length + 2).fill(" ");
  }
  tableArr[0][0] = "t";
  tableArr[1][0] = "ref";
  for (let i = 2; i < r - 1; i++) tableArr[i][0] = "f";

  tableArr[r - 1][0] = "hit";

  for (let j = 0; j <= pages.length; j++) tableArr[0][j + 1] = j;

  // calculates the number of faults
  let page_faults = 0;
  for (let i = 0; i < n; i++) {
    tableArr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    if (data.size < noOfFrames) {
      if (!data.has(pages[i])) {
        data.add(pages[i]);
        page_faults++;
        indexes.push(pages[i]);
      }
    } else {
      if (!data.has(pages[i])) {
        let val = indexes[0];
        indexes.shift();
        data.delete(val);
        data.add(pages[i]);
        indexes.push(pages[i]);
        page_faults++;
      }
    }

    if (prev_page_faults === page_faults) {
      tableArr[r - 1][i + 2] = "✓";
    } else {
      tableArr[r - 1][i + 2] = "✗";
    }
    let k = indexes.length - 1,
      ind = 0;
    while (k >= 0) {
      tableArr[2 + ind][2 + i] = indexes[k];
      ind++;
      k--;
    }
  }

  // Function call for constructing the table and displaying the table
  buildTable(tableArr, n);
  return page_faults;
}

// Function for pushing the data for calculations
function pushData() {
  // disabling the output heading initially displayed

  pages = [];
  let inputText = document.getElementById("references").value;
  let frames = Number(document.querySelector(".noofframes").value);

  // alert for any improper inputs
  if (
    inputText == "" ||
    inputText == 0 ||
    frames == 0 ||
    frames == "" ||
    frames <= 0
  ) {
    alert("Please enter appropriate data in the fields");
  } else {
    $(".result").css("visibility", "visible");

    inputText = inputText.trim(); // removing the extra spaces from the string
    inputText = inputText.split(" "); // splitting the numbers of the string
    inputText = inputText.filter((num) => num.trim() != ""); // removing the extra spaces in between the strings
    inputText = inputText.filter((num) => Number(num) > -1); // removing the negative numbers from the string
    for (let i = 0; i < inputText.length; i++) {
      inputText[i] = Number(inputText[i]);
      pages.push(Number(inputText[i]));
    }

    let faults = 0;

    // Function call for getting page faults
    faults = pageFaults(pages, pages.length, frames);

    // Function call for calculations
    buildSchedule(frames, pages, faults);
  }
}

// Function for calculations of the Total frames, string length, etc.
function buildSchedule(frames, pages, faults) {
  const part1 = document.querySelector(".part1");
  part1.innerHTML = "";
  const head = document.createElement("div");
  head.id = "head";
  head.innerHTML = `<h2>Calculations:</h2>`;
  part1.appendChild(head);
  const base = document.createElement("div");
  base.id = "base";

  const count = {};
  pages.forEach((element) => {
    count[element] = (count[element] || 0) + 1;
  });

  const distinctPages = Object.keys(count).length;

  base.innerHTML = `<ul>
        <li>Total frames: ${frames}</li>
        <li>Reference string length: ${pages.length} references</li>
        <li>String: ${pages}</li>
        <li>Total references: ${pages.length}</li>
        <li>Total distinct references: ${distinctPages}</li>
        <li>Hits: ${pages.length - faults}</li>
        <li>Faults: ${faults}</li>
        <li><b>Hit rate:</b> ${pages.length - faults}/${pages.length} = <b>${(
    (1 - faults / pages.length) *
    100
  ).toFixed(2)}</b>%</li>
        <li><b>Fault rate:</b> ${faults}/${pages.length} = <b>${(
    (faults / pages.length) *
    100
  ).toFixed(2)}</b>%</li>
      </ul>`;

  part1.appendChild(base);

  var hitrate = (((pages.length - faults)/(pages.length))*100).toFixed(2);
  var faultrate = 100 - hitrate;

  FetchRequest(frames, hitrate, faultrate)
}


// Function for building the table
function buildTable(arr, n) {
  const part2 = document.querySelector(".part2");

  part2.innerHTML = "";
  var mytable = "<table>";
  let i = 0,
    j = 0;
  for (var CELL of arr) {
    mytable += `<tr class="r${i}">`;
    for (var CELLi of CELL) {
      if (CELLi === "✗" || CELLi == "✓") {
        mytable += `<td class="c${j} ${CELLi}">` + CELLi + "</td>";
      } else {
        mytable += `<td class="c${j} ">` + CELLi + "</td>";
      }
      j++;
    }
    j = 0;
    mytable += "</tr>";
    i++;
  }
  mytable += "</table>";
  part2.innerHTML = mytable;
  
  if(n>30) {
    $(".part2").css("overflow-x","scroll");
    $(".part2").css("width","95%");
  }
  $(".part2").css("margin-bottom","20px");
}

function resetPage() {
  location.reload();
}

function FetchRequest(frames, hitrate, faultrate) {
  const response = fetch(`http://localhost:3000/posts/FIFO`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ frames, hitrate, faultrate }),
  });
  console.log(response);
}