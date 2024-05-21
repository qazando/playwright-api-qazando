// @ts-check
const { test, expect } = require('@playwright/test');

var tokenRecebido

test('Consultando as reservas cadastradas', async ({ request }) => {
  // Fazendo uma requisição GET para a API para obter os detalhes da reserva
  const response = await request.get('/booking');
  // Imprimindo os detalhes da reserva no console
  console.log(await response.json());
  // Verificando se a resposta da API foi bem-sucedida
  expect(response.ok()).toBeTruthy();
  // Verificando se o status da resposta é 200 (OK)
  expect(response.status()).toBe(200);
});

test('Consultando as reservas cadastradas com base em um id', async ({ request }) => {
  const response = await request.get('/booking/775');
  //transforma a resposta em json
  const jsonBody = await response.json();
  console.log(jsonBody);
  // Verificando se os dados da reserva estão corretos
  expect(jsonBody.firstname).toBe('John');
  expect(jsonBody.lastname).toBe('Smith');
  expect(jsonBody.totalprice).toBe(111);
  expect(jsonBody.depositpaid).toBeTruthy();
  expect(jsonBody.bookingdates.checkin).toBe('2018-01-01');
  expect(jsonBody.bookingdates.checkout).toBe('2019-01-01');
  expect(jsonBody.additionalneeds).toBe('Breakfast');

  // Verificando se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test('Consultando as reservas cadastradas com base em um id validando apenas os campos', async ({ request }) => {
  const response = await request.get('/booking/2172');
  const jsonBody = await response.json();
  console.log(jsonBody);
  // Verificando se os campos estão presentes na resposta da API
  expect(jsonBody).toHaveProperty('firstname');
  expect(jsonBody).toHaveProperty('lastname');
  expect(jsonBody).toHaveProperty('totalprice');
  expect(jsonBody).toHaveProperty('depositpaid');
  expect(jsonBody).toHaveProperty('bookingdates');
  expect(jsonBody).toHaveProperty('additionalneeds');

  // Verificando se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});


test('Cadastrando uma reserva', async ({ request }) => {
  const response = await request.post('/booking', {
    data: {
      "firstname" : "herbertao",
      "lastname" : "qazando",
      "totalprice" : 222,
      "depositpaid" : true,
      "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
      },
      "additionalneeds" : "Breakfast"
    }
});
console.log(await response.json());

 // Verificando se a resposta da API está OK
 expect(response.ok()).toBeTruthy();
 expect(response.status()).toBe(200);

// validando dados de retorno
const responseBody = await response.json()
  expect(responseBody.booking).toHaveProperty("firstname", "herbertao");
  expect(responseBody.booking).toHaveProperty("lastname", "qazando");
  expect(responseBody.booking).toHaveProperty("totalprice", 222);
  expect(responseBody.booking).toHaveProperty("depositpaid", true);
});

test('Gerando um token', async ({ request }) => {

  const response = await request.post('/auth', {
    data: {
      "username": "admin",
      "password": "password123"
  }
});

  console.log(await response.json());
  // Verificando se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  tokenRecebido = responseBody.token;
  console.log("Seu token é:" + tokenRecebido);

});

test('Atualização parcial', async ({ request }) => {

  // criando o token
  const response = await request.post('/auth', {
    data: {
      "username": "admin",
      "password": "password123"
  }
});

  console.log(await response.json());
  // Verificando se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  tokenRecebido = responseBody.token;
  console.log("Seu token é:" + tokenRecebido);

  // Atualizando dados da reserva:
  const partialUpdateRequest = await request.patch('/booking/198', {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${tokenRecebido}`
    },
    data: {
        "firstname": "herbert",
        "lastname": "herbertao",
        "totalprice": 111,
        "depositpaid": false
    }
});
console.log(await partialUpdateRequest.json());
expect(partialUpdateRequest.ok()).toBeTruthy();
expect(partialUpdateRequest.status()).toBe(200);

const partialUpdatedResponseBody = await partialUpdateRequest.json()

expect(partialUpdatedResponseBody).toHaveProperty("firstname", "herbert");
expect(partialUpdatedResponseBody).toHaveProperty("lastname", "herbertao");
expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 111);
expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);

});