import express from "express";
const app = express();
const port = 3001;

app.get("*", (req, res) => {
  res.send(
    `<p>Hello World! url: ${req.url}</p><p><a href="/shop">Shop</a></p>`
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
