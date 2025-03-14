const express = require('express');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const cors = require('cors');

const app = express();
const PORT = 5000;

const API_URL = 'https://platform.fatsecret.com/rest/server.api';
const CONSUMER_KEY = '50715eed347845a4a4e6a9fa7f5dcd41';
const CONSUMER_SECRET = 'a018e06d330242b7bca038cdadb88b63';
const OAUTH_VERSION = '1.0';
const OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const generateNonce = () => Math.random().toString(36).substring(2, 15);
const generateTimestamp = () => Math.floor(Date.now() / 1000).toString();

const generateSignature = (method, url, params) => {
  const paramString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;
  return CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);
};

app.get('/api/foods/search', async (req, res) => {
  const { query, max_results = '10' } = req.query;

  const params = {
    method: 'foods.search',
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: generateNonce(),
    oauth_timestamp: generateTimestamp(),
    oauth_signature_method: OAUTH_SIGNATURE_METHOD,
    oauth_version: OAUTH_VERSION,
    format: 'json',
    search_expression: query,
    max_results: max_results,
  };

  const signature = generateSignature('GET', API_URL, params);
  params.oauth_signature = signature;

  try {
    const response = await axios.get(API_URL, { params });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de FatSecret' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});