// ! Task 4
function create(req, res) {
  if (req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => body.push(chunk));

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];

      console.log(message.split("+").join(" "));
    });
  }

  res.statusCode = 302;
  res.setHeader("Location", "/");
}

function list(req, res) {
  const HTML = `<html>
  <head><title>Users</title></head>
  <body>
      <ul>
        <li>Nwachukwu</li>
        <li>Jedidiah</li>
        <li>Jerushah</li>
        <li>Jachi</li>
        <li>Esther</li>
      </ul>
  </body>
  <html>`;

  res.write(HTML);
}

module.exports = {
  create,
  list,
};
