# NodeJS - The Complete Guide(MVC, REST APIs, GraphQL, Deno)

Master Node JS & Deno.js, build REST APIs with Node.js, GraphQL APIs, add Authentication, use MongoDB, SQL & much more!

[Course Link](https://www.udemy.com/course/nodejs-the-complete-guide)

## MVC

1. Models
   a. Represent code data
   b. Work with data(e.g: save, fetch)
2. Views
   a. What the user sees
   b. Decoupled from application code
3. Controllers[routes]
   a. Connects models and views
   b. Split across middleware functions

## What database To Use

1. Use MongoDB for data that changes often
2. Use SQL for data that changes less often, like user data

## Sessions

- In e-commerce platforms, consider using sessions to store user cart data so that it is sent across on every user request, that needs it.
- Advertising and tracking are common uses of sessions

## Cross-Site Request Forgery (CSRF)

## Error Handling

### Types Of Errors

1. Technical/Network errors

   - e.g: MongoDB server is down
   - solution: Show error page to user

2. Expected errors

   - e.g: File can't be read, DB operation fails, validation error
   - solution: Inform user, possibly retry

3. Bugs/logical errors
   - e.g: User object used when it doesn't exist
   - solution: Fix during development

### Express Error Middleware

- To throw errors in async code: promises and callbacks, use `next(new Error(err))`
- To throw errors in sync code: use `throw new Error(err)`

### Error Codes

- `200`: OK - Operation succeeded
- `201`: Created - New resource created
- `204`: No Content - No content to return
- `301`: Moved Permanently - Resource moved permanently
- `302`: Found - Resource found, but redirected
- `401`: Unauthorized - User is not authorized to access the resource
- `403`: Forbidden - User is authorized, but does not have the necessary permissions to access the resource
- `404`: Not Found - Resource not found
- `405`: Method Not Allowed - Method not allowed for the resource
- `409`: Conflict - Resource already exists
- `422`: Unprocessable Entity - Validation error
- `500`: Internal Server Error - Internal server error

## Further Reading

- [ ] [Primitive and reference types in JavaScript](https://academind.com/tutorials/reference-vs-primitive-values)

- [ ] [Headers & their roles](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

- [ ] [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)

- [ ] [Single Thread, Event loop & blocking code](https://medium.com/javascript-scene/javascript-single-threaded-event-loop-b6c8a8f7d9e3)

- [ ] [Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

- [ ] [Blocking and Non-Blocking Code](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)

- [ ] [Debugging Node.js in VSCode](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

- [ ] [More on debugging Node.js](https://nodejs.org/en/docs/guides/debugging-getting-started/)

- [ ] [Express.js Official Docs](https://expressjs.com/en/starter/installing.html)

- [ ] [Pug Docs](https://pugjs.org/api/getting-started.html)

- [ ] [More on MVC](https://developer.mozilla.org/en-US/docs/Glossary/MVC)

- [ ] [Learn more about MySQL/ SQL in General](https://www.w3schools.com/sql/)

- [ ] [Learn more about the Node MySQL Package](https://github.com/sidorares/node-mysql2)

- [ ] [Sequelize Official Docs](https://docs.sequelizejs.com)

- [ ] [MongoDB Official Docs](https://docs.mongodb.com/manual/core/security-encryption-at-rest/https://docs.mongodb.com/manual/)

- [ ] [SQL vs NoSQL](https://academind.com/learn/web-dev/sql-vs-nosql/)

- [ ] [Learn more about MongoDB](https://academind.com/learn/mongodb)

- [ ] [Mongoose Official Docs](https://mongoosejs.com/docs/)

- [ ] [More on Sessions](https://www.quora.com/What-is-a-session-in-a-Web-Application)

- [ ] [More on Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

- [ ] [Express-session Official Docs](https://github.com/expressjs/session)

- [ ] [Bcrypt Official Docs](https://github.com/dcodeIO/bcrypt.js)

- [ ] [More on CSRF Attacks](https://www.acunetix.com/websitesecurity/csrf-attacks)

- [ ] [Nodemailer Official Docs](https://nodemailer.com/about/)

- [ ] [SendGrid Official Docs](https://sendgrid.com/docs/)

- [ ] [Express-Validator Docs](https://express-validator.github.io/docs/)

- [ ] [Validator.js Docs](https://github.com/chriso/validator.js)

- [ ] [Error Handling in Express.js - Official Docs](https://expressjs.com/en/guide/error-handling.html)

- [ ] [Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

- [ ] [Multer Official Docs](https://github.com/expressjs/multer)

- [ ] [Streaming Files](https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93)

- [ ] [Generating PDFs with PDFKit](http://pdfkit.org/docs/getting_started.html)

## ToDO

- [ ] setup multer for multiple images upload using disk storage
- [ ] setup multer for single image upload using cloudinary storage
- Print order invoice

  - `getOrder` route with `orderId` param
  - set headers

    ```js
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
    ```

  - let only the owner of the order be able to download the invoice
  - render file with `fs.createReadStream` and `fs.pipe(res)` instead of `fs.readFile`
  - Create pdf with `npm i pdfkit`
  - Delete file using `deleteFile` util function that gets called on delete product and edit product
