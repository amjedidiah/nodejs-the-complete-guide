module.exports = (req, res) => {
    // ! Task 3
  const HTML = `<html>
<head><title>Home</title></head>
<body>
    <h1>Welcome home</h1>
    <form method="POST" action="/create-user">
        <input type="text" name="username" />
        <button>Submit</button>
    </form>
</body>
<html>`;

  res.write(HTML);
};