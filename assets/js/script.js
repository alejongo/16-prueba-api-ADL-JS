const inputCurrency = document.getElementById("inputCurrency");
const currencySelector = document.getElementById("currencySelector");
const quantity = inputCurrency.value;
const totalConvertedMoney = document.getElementById("totalConvertedMoney");
const convertedCurrency = document.getElementById("convertedCurrency");
const convertedCurrencyLabel = document.getElementById(
  "convertedCurrencyLabel"
);
const canvasContainer = document.getElementById("canvasContainer");
let chart = document.getElementById("chart");

const currencyTypeGraph = document.getElementById("currencyTypeGraph");

// Fetch Data
const getMoneyValue = async (currencyType = "dolar") => {
  try {
    const res = await fetch(`https://mindicador.cl/api/${currencyType}`);
    const data = await res.json();

    //console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

// Convert Money
const moneyConvertion = async (quantity) => {
  const currentMoneyData = await getMoneyValue(currencySelector.value);
  const currentMoneyValue = currentMoneyData.serie[0]["valor"];
  quantity = inputCurrency.value || currentMoneyValue;

  // Convert money
  const convertedMoneyValue = Number(quantity) / currentMoneyValue;
  const currentValueFormated = currentMoneyValue.toLocaleString("es-MX");
  const formatedValue = convertedMoneyValue.toLocaleString("es-MX");

  // Show pesos per dolar
  inputCurrency.setAttribute("value", currentValueFormated);
  // Show Total converted
  totalConvertedMoney.setAttribute("value", formatedValue);
};

// Get realtime input value
inputCurrency.addEventListener("input", (e) => {
  const inputValue = e.target.value;
  moneyConvertion(inputValue);
});

// Change Currency Type
currencySelector.addEventListener("change", () => {
  getMoneyValue(currencySelector.value);
  moneyConvertion(inputCurrency.value);

  // Get Selected option Index
  const selectedIndex =
    currencySelector.options[currencySelector.selectedIndex];
  convertedCurrencyLabel.innerHTML = `${selectedIndex.text} <span class="font-bold ml-1">$</span>`;
  currencyTypeGraph.innerHTML = selectedIndex.text;

  if (chart) {
    chart.remove();
    canvasContainer.innerHTML = `<canvas id="chart" class="h-auto"></canvas>`;
    chart = document.getElementById("chart");
    renderGraph();
  }
});

// Graph Money Historic data
const getMoneyGraphData = (dataMoney) => {
  const graphType = "line";
  const title = "Value";
  const lineColor = "rgb(255, 228, 230)";

  dataMoney.serie.splice(10);

  // Variables grafica
  const labels = dataMoney.serie.map((serie) => {
    return serie.fecha.slice(0, 10);
  });

  labels.sort((a, b) => new Date(b) - new Date());

  const data = dataMoney.serie.map((serie) => {
    return serie.valor;
  });

  data.sort((a, b) => b - a);

  // Configuracion de la grafica
  const config = {
    type: graphType,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: lineColor,
          borderColor: "rgb(251, 113, 133)",
          tension: 0.5,
          fill: true,
          data: data,
        },
      ],
    },
  };

  return config;
};

// Render Graph
const renderGraph = async () => {
  const data = await getMoneyValue(currencySelector.value);
  const config = getMoneyGraphData(data);

  // Get Selected option Index
  const selectedIndex =
    currencySelector.options[currencySelector.selectedIndex];
  currencyTypeGraph.innerHTML = `${selectedIndex.text}`;

  chart.style.backgroundColor = "white";

  new Chart(chart, config);
};

moneyConvertion();
renderGraph();
