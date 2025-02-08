const inputCurrency = document.getElementById("inputCurrency");
const currencySelector = document.getElementById("currencySelector");
const quantity = inputCurrency.value;
const totalConvertedMoney = document.getElementById("totalConvertedMoney");
const convertedCurrency = document.getElementById("convertedCurrency");
const textTotal = document.getElementById("textTotal");
const convertedCurrencyLabel = document.getElementById(
  "convertedCurrencyLabel"
);

const getMoneyValue = async (currencyType = "dolar") => {
  const res = await fetch(`https://mindicador.cl/api/${currencyType}`);
  const data = await res.json();

  console.log(data);
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

  console.log(convertedMoneyValue);
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
  // Get Selected option Index
  const selectedIndex =
    currencySelector.options[currencySelector.selectedIndex];
  convertedCurrencyLabel.innerHTML = `${selectedIndex.text} <span class="font-bold ml-1">$</span>`;
});

moneyConvertion();
