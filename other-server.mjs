import express from 'express';
const app = express();
const port = 3001;

app.get('*', (req, res) => {
  const basename = req.headers['x-remix-basename'];
  res.send(
    `<h1>Hello World! url: ${req.url}</h1>
    <p><a href="/">Home</a></p>
    <p><a href="${basename}">Shop</a></p>
    <p><a href="/some/other/path">Some/Other/Path</a></p>`,
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
