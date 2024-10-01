// let no1,no2,no3,no4,no5;

$(document).ready(function () {
  // Declaring and initializing variables
  let chopsticks = [1, 1, 1, 1, 1];
  let no1, no2, no3, no4, no5;
  let pno_list = [1, 2, 3, 4, 5];
  let allocated_phil = [];
  let status = "";

  // no1 = 1;
  // no2 = 2;
  // no3 = 3;
  // no4 = 4;
  // no5 = 5;
  // Fetch request

  // When the Submit will be clicked this function will get executed
  $("#eat").click(function () {
    // Declaring the local variables
    status = "";
    pno_list = [];
    allocated_phil = [];

    // Handling the exceptions
    no1 = parseInt($("#pno1").val());
    pno_list.push(no1);
    no2 = parseInt($("#pno2").val());
    pno_list.push(no2);
    no3 = parseInt($("#pno3").val());
    pno_list.push(no3);
    no4 = parseInt($("#pno4").val());
    pno_list.push(no4);
    no5 = parseInt($("#pno5").val());
    pno_list.push(no5);

    FetchRequest(no1, no2, no3, no4, no5);

    // this.no1 = no1;
    // this.no2 = no2;
    // this.no3 = no3;
    // this.no4 = no4;
    // this.no5 = no5;

    let bool1 =
      isNaN(no1) || isNaN(no2) || isNaN(no3) || isNaN(no4) || isNaN(no5);
    let bool2 =
      no1 == 0 ||
      no2 == 0 ||
      no3 == 0 ||
      no4 == 0 ||
      no5 == 0 ||
      no1 > 5 ||
      no2 > 5 ||
      no3 > 5 ||
      no4 > 5 ||
      no5 > 5 ||
      no1 < 0 ||
      no2 < 0 ||
      no3 < 0 ||
      no4 < 0 ||
      no5 < 0;

    // Displaying different Exception Errors
    if (Boolean(bool1)) {
      alert("Please enter some values");
    } else if (Boolean(bool2)) {
      alert("Please enter values between 1 and 5");
    } else if (checkDuplicates(pno_list)) {
      alert("Please enter distinct values");
    } else {
      $(".list-border").css("visibility", "visible");
      $(".output-head").css("visibility", "visible");
      $("#st-list").show();

      // Setting the opacity of all the philosophers as 20% initially
      $(".philosopher").css("opacity", "20%");

      // Calling the 'runProcess' function
      runProcess(pno_list);
    }
  });

  // Function to check the duplicates in the input
  function checkDuplicates(arr) {
    toMap = {};
    let result = false;
    for (let i = 0; i < arr.length; i++) {
      if (toMap[arr[i]]) {
        result = true;
        break;
      }
      toMap[arr[i]] = true;
    }
    return result;
  }

  // Function to display the Output
  function runProcess(pno_list) {
    // disabling the button once execution is started
    $("#eat").prop("disabled", true);

    // Displaying that process is being started
    status +=
      '<li style="color: black;">Checking resource availablity for all Philosophers</li>';
    $("#st-list").html(status);

    // Function to set the output
    setTimeout(() => {
      // Arrow function to check whether resources are available or not
      pno_list.forEach((pno) => {
        if (chopsticks[pno - 1] == 1 && chopsticks[pno % 5] == 1) {
          // Condition to check which philosopher both the chopsticks
          console.log(pno + " " + (pno - 1) + " " + (pno % 5));
          status +=
            '<li style="color: green;">Allocating resources to Philosopher ' +
            pno +
            "</li>"; // Printing the status of the philosopher who is eating
          allocated_phil.push(pno); // Adding the philosopher into the array who has completed eating
          pno_list = $.grep(pno_list, function (value) {
            // Removing the philosopher from list
            return value != pno;
          });

          // Displaying which philosopher is eating by changing its opacity
          $("#p" + pno).css("opacity", "100%");
          $("#b" + pno).css("opacity", "100%");
          $("#c" + (pno - 1)).css("opacity", "0%");
          $("#c" + (pno % 5)).css("opacity", "0%");

          // Displaying the status
          $("#st-list").html(status);

          // Marking the chopsticks as allocated
          chopsticks[pno - 1] = 0;
          chopsticks[pno % 5] = 0;
        } else {
          status +=
            '<li style="color: red;">Resources not available for Philosopher ' +
            pno +
            "</li>"; // Printing the status of philosopher who cannot eat

          // Displaying the status
          $("#st-list").html(status);
        }
      });

      // Function to set back the resources as at the start
      setTimeout(() => {
        allocated_phil.forEach((pno) => {
          status +=
            '<li style="color: black;">Philosopher ' +
            pno +
            " is done eating. Freeing Resources</li>";

          // chaning the opacity of philosophers who have already eaten
          $("#p" + pno).css("opacity", "60%");
          $("#b" + pno).css("opacity", "0%");
          $("#c" + (pno - 1)).css("opacity", "100%");
          $("#c" + (pno % 5)).css("opacity", "100%");
          $("#st-list").html(status);
          chopsticks[pno - 1] = 1;
          chopsticks[pno % 5] = 1;
          allocated_phil = $.grep(allocated_phil, function (value) {
            return value != pno;
          });

          // to enable the button after we finish our process
          if (pno_list.length === 0) {
            $("#eat").prop("disabled", false);
          }
        });

        // we run the function until all philosophers get chance
        if (pno_list.length != 0) {
          runProcess(pno_list);
        }
      }, 2000);
    }, 3000);
  }

  function FetchRequest(p1, p2, p3, p4, p5) {
    const response = fetch(`http://localhost:3000/posts/DP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p1, p2, p3, p4, p5 }),
    });
    console.log(response);
  }
});

function resetPage() {
  location.reload();
}
