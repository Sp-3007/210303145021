const express = require("express");
const axios = require("axios");
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
const TEST_SERVER_URLS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};


const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4NzgxMzEwLCJpYXQiOjE3MTg3ODEwMTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJiNmI3OGJkLWVmMzgtNDBhOS05ZmMyLTA0M2NmODAzMGY0YSIsInN1YiI6IjIxMDMwMzE0NTAyMUBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJwYXJ1bCIsImNsaWVudElEIjoiYmI2Yjc4YmQtZWYzOC00MGE5LTlmYzItMDQzY2Y4MDMwZjRhIiwiY2xpZW50U2VjcmV0IjoiT1BMQ0dLd2hlTWducVdRQiIsIm93bmVyTmFtZSI6InByYWphcGF0aSBzYXVyYXYiLCJvd25lckVtYWlsIjoiMjEwMzAzMTQ1MDIxQHBhcnVsdW5pdmVyc2l0eS5hYy5pbiIsInJvbGxObyI6IjIxMDMwMzE0NTAyMSJ9.2lR92qAGOQQcgWvsKom1n61SabPD8RVkK0mO6gJxZhY";

let window = [];

const fetchNumbers = async (url) => {
  const response = await axios.get(url, {
    timeout: 500,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return response.data.numbers || [];
};

const updateWindow = (newNumbers) => {
  newNumbers.forEach((num) => {
    if (!window.includes(num)) {
      if (window.length >= WINDOW_SIZE) {
        window.shift();
      }
      window.push(num);
    }
  });
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get("/numbers/:numberId", async (req, res) => {
  const numberId = req.params.numberId;

  if (!TEST_SERVER_URLS[numberId]) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  try {
    const newNumbers = await fetchNumbers(TEST_SERVER_URLS[numberId]);
    const previousWindow = [...window];
    updateWindow(newNumbers);
    const avg = calculateAverage(window);

    const response = {
      numbers: newNumbers,
      windowPrevState: previousWindow,
      windowCurrState: [...window],
      avg: avg.toFixed(2),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Request failed" });
  }
});

app.listen(port, () => {
  console.log(
    `Average Calculator microservice listening at http://localhost:${port}`
  );
});
