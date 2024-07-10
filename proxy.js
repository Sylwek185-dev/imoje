import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public')); // Dodanie tej linii, aby serwować pliki statyczne
app.use(express.json());

app.use((req, res, next) => {
  res.header(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://vercel.live"
  );
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.post('/proxy/payment', async (req, res) => {
  try {
    const response = await fetch(
      'https://sandbox.api.imoje.pl/v1/merchant/wh7blvxerihcfs852bsd/payment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer 7hw486zjx0v0uby5pc42qvbpxwjhvs4d9msfghc6hlc15r1t1xlcyvevnokc5que',
        },
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
