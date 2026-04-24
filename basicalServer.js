const http = require('http');

const server = http.createServer((req, res) => {
  // 1. Налаштовуємо базові CORS хедери
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
    'Access-Control-Max-Age': 86400, // 24 години
  };
console.log( '   +++++-------101-------+++++  ', req.method)
  // 2. ОБОВ'ЯЗКОВО: обробка Preflight запиту
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  // 3. Обробка POST запиту
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body); // Парсимо JSON вручну
        
        // Додаємо тип контенту для відповіді
        headers['Content-Type'] = 'application/json';
        
        res.writeHead(200, headers);
        res.end(JSON.stringify({ message: "Успіх", received: data }));
      } catch (e) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: "Невалідний JSON" }));
      }
    });
  }
});

server.listen(3012);

