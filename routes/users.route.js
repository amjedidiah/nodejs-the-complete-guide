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
          <li>User 1</li>
          <li>User 2</li>
          <li>User 3</li>
          <li>User 4</li>
          <li>User 5</li>
        </ul>
    </body>
    <html>`;
  
    res.send(HTML);
  }
  
  module.exports = {
    create,
    list,
  };