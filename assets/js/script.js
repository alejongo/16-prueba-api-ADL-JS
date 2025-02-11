const inputCurrency = document.getElementById("inputCurrency");
const currencySelector = document.getElementById("currencySelector");
const quantity = inputCurrency.value;
const totalConvertedMoney = document.getElementById("totalConvertedMoney");
const convertedCurrency = document.getElementById("convertedCurrency");
const textTotal = document.getElementById("textTotal");
const convertedCurrencyLabel = document.getElementById(
  "convertedCurrencyLabel"
);
let chart = document.getElementById("chart");

const getMoneyValue = async (currencyType = "dolar") => {
  const res = await fetch(`https://mindicador.cl/api/${currencyType}`);
  const data = await res.json();

  //console.log(data);
  return data;
};

// Convert Money
const moneyConvertion = async (quantity = 1) => {
  const currentMoneyData = await getMoneyValue(currencySelector.value);
  const currentMoneyValue = currentMoneyData.serie[0]["valor"];

  // Convert money
  const convertedMoneyValue = Number(quantity) * currentMoneyValue;
  const formatedValue = convertedMoneyValue.toLocaleString("es-MX");

  // Show Total converted
  totalConvertedMoney.setAttribute("value", formatedValue);
};

// Get realtime input value
inputCurrency.addEventListener("input", (e) => {
  const inputValue = e.target.value;
  textTotal.innerHTML = `$${inputValue}`;
  moneyConvertion(inputValue);
});

// Change Currency Type
currencySelector.addEventListener("change", () => {
  getMoneyValue(currencySelector.value);
  moneyConvertion(inputCurrency.value);
  //renderGraph();
  // Get Selected option Index
  const selectedIndex =
    currencySelector.options[currencySelector.selectedIndex];
  convertedCurrencyLabel.innerHTML = `${selectedIndex.text} <span class="font-bold ml-1">$</span>`;
});

//TODO

// Graph Money Historic data
const getMoneyGraphData = async (shortedData) => {
  //const moneyData = await getMoneyValue(currencySelector.value);

  const graphType = "line";
  const title = "Money Value";
  const lineColor = "red";

  const shortedArray = shortedData.serie.splice(10);
  console.log(shortedArray);
  // const sorted = shortedData.serie.sort((a, b) => new Date(a) - new Date(b));
  // console.log(sorted);

  // Variables grafica
  const labels = shortedData.serie.map((serie) => {
    return serie.fecha.slice(0, 10);
  });

  labels.sort((a, b) => new Date(b) - new Date());
  console.log(labels);

  const data = shortedData.serie.map((serie) => {
    return serie.valor;
  });

  data.sort((a, b) => b - a);

  // Configuracion de la grafica
  const config = {
    type: graphType,
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: lineColor,
          data: data,
        },
      ],
    },
  };

  return config;
};

// Render Graph
const renderGraph = async () => {
  const data = await getMoneyValue();
  const config = await getMoneyGraphData(data);

  chart.style.backgroundColor = "white";
  new Chart(chart, config);
};

moneyConvertion();
renderGraph();
