# userlogin

user login to be used for future use.

1. How to run:

- To run,
  **npm start**

- To run with debug enabled,
  {MAC OS}
  DEBUG=userlogin:\* npm start
  {WINDOWS}
  set DEBUG=myapp:\* & npm start

- Entry point is:
  localhost:3000/users/login

2. Password change:

- Password is set at  
   users.js file,
  ```javascript
  if (password === 'xxxx') {
  ```
  'Joi' package is used for email and password validation.

=================================

3. How POST method is fired?

When you click "Submit" button, "POST" method fetches **name="username"** and **name="password"** to **req.body**.

```html
      <form action="/users/login_process" method="POST">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"
            name="username">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" name="password" id="password" placeholder="Password" name="password">
        </div>
        <div class="form-check">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
```

Then, we have **username** and **password** values in **req.body** in router.post method in below code (in /routes/users.js).

```javascript
/* log in process. check username and password validation. */
router.post('/login_process', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
```

4. Middleware to display password error on login page.

Middleware to display password error message....

If **username and password** check fails, **query msg** is added and redirected to login url.

```javascript
res.redirect('login?msg=fail'); // query message is addes.  anything after ? is qeury message
```

Middleware in /routes/users.js is to display wrong username/password.

```javascript
// middleware part
router.use((req, res, next) => {
```

Located at the top to check req.query.msg. If **msg === 'fail'** in uri, pass fail message into local storage.

```javascript
res.locals.msg = 'fail message is here';
```

===================================

5. Cookies used in this code.

Cookies to store username in local. The reason is username is deleted after redirect to another page. Storing username in cookie can make username persist in local memory even after redirect to next page. In this code, after successful login, user is redirected to **welcome** page. Then, welcome page display "username" as a greeting.

```javascript
res.cookie('username', username);
```

Cookies take up memory. Cookies can be deleted at log out.

```javascript
res.clearCookie('username');
```

===================================

6. Relative and Absolute path.

As a project gets bigger, we need to create separate routes paths. In this example code, /routes/index.js and /routes/user.js have their own routing path.

**index.js is paths with '/' routing.**

**users.js is paths with '/users' routing.**

I am going to use 'logout' in /routes/users.js to explain how server route and frontend route work. The code is as following (and you can find this snapshot in /routes/users.js).

```javascript
router.get('/logout', (req, res, next) => {
  // '/logout' equals 'localhost:3000/users/logout
  res.clearCookie('username');
  res.redirect('login'); // 'login' equals 'views/login.hbs
});
```

**router.get('/logout', .....)**
is server routes. Its full path is 'localhost:3000/users/logout'. Since it is already in 'localhost:3000/users/' path, you just need to add '/logout' in server path.

**res.redirect('login')** is for HTML (frontend) path. Its full path is /views/login. since we already set "views" as view engine path, we just need to set 'logout' as redirect path. It is the same case with res.send().

{
"itemName" : "Simpsons",
"itemDepartment": "Movie",
"itemPrice" : 25,
"itemDescription" : "Funny comic",
"itemSeller": "Fox",
"itemCount" : 200,
"itemImgPath" : "/images/simpsons.png"
}

{
"itemName" : "Dog and Cat",
"itemDepartment": "Toy",
"itemPrice" : 15,
"itemDescription" : "Dog and cot lovers must have",
"itemSeller": "Dog,cat and US",
"itemCount" : 2000,
"itemImgPath" : "/images/dog_cat.png"
}

{
"itemName" : "Braves",
"itemDepartment": "Clothing",
"itemPrice" : 9,
"itemDescription" : "Braves team logo",
"itemSeller": "Braves Inc.",
"itemCount" : 2000,
"itemImgPath" : "/images/braves.png"
}

{
"itemName" : "Canon EOS",
"itemDepartment": "Electronics",
"itemPrice" : 999,
"itemDescription" : "Canon EOS SLR camear, comes with kit lens, 50-175mm",
"itemSeller": "Photos and everything",
"itemCount" : 20,
"itemImgPath" : "/images/canon-eos.jpeg"
}

{
"itemName" : "Herbed Potato Seasoning",
"itemDepartment": "Food",
"itemPrice" : 8.99,
"itemDescription" : "Herbed potato seasoning, just mix with diced potatos and oven bake for 40min at 400F, Great taste.",
"itemSeller": "Herbs and Spices",
"itemCount" : 20,
"itemImgPath" : "/images/herbed-potato.jpeg"
}
