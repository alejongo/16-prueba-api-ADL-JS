const inputCurrency = document.getElementById("inputCurrency");
const currencySelector = document.getElementById("currencySelector");

const getMoneyValue = async (currencyToConvert = "dolar") => {
  const res = await fetch(`https://mindicador.cl/api/${currencyToConvert}`);
  const data = await res.json();

  console.log(data);
  return data;
};

// Convert Money
const moneyConvertion = async (quantity = 1) => {
  const currentMoneyData = await getMoneyValue();
  const currentMoneyValue = currentMoneyData.serie[0]["valor"];

  console.log(currentMoneyValue);
};

moneyConvertion();
