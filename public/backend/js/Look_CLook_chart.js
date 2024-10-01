var algorithmChart = document.getElementById("Clook-Chart").getContext('2d');
var chart = new Chart(algorithmChart, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'LOOK Disk Scheduling Sequence',
      data: [],
      backgroundColor: "skyblue",
      borderColor: "blue",
      borderWidth: 2,
      hoverBackgroundColor: 'skyblue',
      hoverBorderColor: 'black',
      fill: false,
      lineTension: 0,
      pointRadius: 5
    }]
  },
  plugins: [{
    id: "canvas_Background_color",
    beforeDraw: (chart) => {
      const cht = chart.canvas.getContext('2d');
      cht.save();
      cht.globalCompositeOperation = 'destination-over';
      cht.fillStyle = 'lightblue';
      cht.fillRect(0, 0, chart.width, chart.height);
      cht.restore();
    }
  }],
  options: {
    title: {
      display: true,
      position: "top",
      text: "Look Algorithm Graph",
      fontSize: 20,
      fontColor: "green"
    },
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "black",
          boxWidth: 42,
        },
        title: {
          color: "yellow"
        }
      },
    },
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        position: 'top',
        max: 100,
        grid: {
          color: 'red',
          borderColor: 'grey',
          tickColor: 'red'
        },
        ticks: {
          color: 'red',
        }
      },
      y: {
        grid: {
          display: false,
          color: 'red',
          borderColor: 'red',
          tickColor: 'red'
        },
        ticks: {
          color: 'red',
        }
      }
    },
  }
});

let enablelook = 0;
let enableclook = 0;
function LookExecute() {
  enablelook = 0;
  if(look() === false) return;
  seekSequence.reverse();
  seekSequence.push(headPosition);
  seekSequence.reverse();
  let n = seekSequence.length;
  clearPoints(chart);
  chart.options.scales.x.max = diskSize;
  for (let i=0; i<n; i++) {
    chart.data.labels.push(i);
  }
  chart.update();
  for (let i=0; i<n; i++) {
    setTimeout(function() {
      enablelook++;
      addPoints(chart, seekSequence[i], enablelook, n);
    }, 1000*i);
  }
  // console.log("lookexecute");
}


function C_LookExecute() {
  enableclook = 0;
  if(clook() === false) return;
  seekSequence.reverse();
  seekSequence.push(headPosition);
  seekSequence.reverse();
  let n = seekSequence.length;
  clearPoints(chart);
  chart.options.scales.x.max = diskSize;
  for (let i=0; i<n; i++) {
    chart.data.labels.push(i);
  }
  chart.update();
  for (let i=0; i<n; i++) {
    setTimeout(function() {
      enableclook++;
      addPoints(chart, seekSequence[i], enableclook, n);
    }, 1000*i);
  }
}


function clearPoints(chart) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

function addPoints(chart, seekSeqce, temp, n) {
  chart.data.datasets[0].data.push(seekSeqce);
  chart.update();
  // after all the points are added to enable the buttons of C-look and Look
  if(temp==n) {
    $("#btn-clook").prop("disabled", false);
    $("#btn-look").prop("disabled", false);
  }
}
