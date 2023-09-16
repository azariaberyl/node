import htpp from "http";

const server = htpp.createServer((req, res) => {
  res.write("Hello World");
  res.end();
});

server.listen(3000, () => {
  console.log("Server start in port 3000");
});
