# userlogin

user login to be used for future use.

1. How to run:

- To run,
  npm start

- To run with debug enabled,
  DEBUG=userlogin:\* npm start

- Entry point is:
  {MAC OS}
  localhost:3000/users/login
  {WINDOWS}
  set DEBUG=myapp:\* & npm start

2. Password change:

- Password is set at  
  users.js file,
  if (password === 'xxxx') {

'Joi' package is used for email and password validation.

=================================

3. Key features : Middleware to display password error on login page.

Middleware to display password error message....

If username/password check fails, query msg is added and redirected to login url.

- res.redirect('login?msg=fail')

Middleware in /routes/users.js is to display wrong username/password.  
// middleware

- router.use((req, res, next) => {

Located at the top to check req.query.msg. If msg === 'fail' in uri, pass fail message onto local storage.

- res.locals.msg = 'fail message is here'

===================================

4. Cookies used in this code.

Cookies to store username in local. The reason is username is deleted after redirect to another page. Storing username in cookie can make username in memory after redirect to next page. In this code, after successful login, user is redirected to welcome page. Then, welcome page display "username" as a greeting.

res.cookie('username', username);

Cookies take up memory. Cookies can be deleted at log out.

res.clearCookie('username');

===================================

5. Relative and Absolute path.

As a project gets bigger, we need to create separate routes path. In this example code, /routes/index.js and /routes/user.js have their own routing path.

index.js is paths with '/' routing.

users.js is paths with '/users' routing.

I am going to use 'logout' in /routes/users.js to explain how server route and frontend route work. The code is as following (and you can find this snapshot in /routes/users.js).

```javascript
router.get('/logout', (req, res, next) => {
  // '/logout' equals 'localhost:3000/users/logout
  res.clearCookie('username');
  res.redirect('login'); // 'login' equals 'views/login.hbs
});
```

router.get('/logout', .....)
is server routes. Its full path is 'localhost:3000/users/logout'. Since it is already in 'localhost:3000/users/' path, you just need to add '/logout' in server path.

res.redirect('login') is for HTML (frontend) path. Its full path is /views/login. since we already set "views" as view engine path, we just need to set 'logout' as redirect path. It is the same case with res.send().
