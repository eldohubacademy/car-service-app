const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(3);

const mysql = require("mysql");
const dbconn = mysql.createConnection({
  host: "localhost",
  database: "carservice",
  user: "root",
  password: "",
});
const app = express();
app.use(express.static("public")); // serve static files -- redirect requests fro .css, img, .js files to a folder public
app.use(
  session({
    secret: "albertkip",
    resave: false,
    saveUninitialized: false,
  })
);
// authorization middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  if (!req.session.isLoggedIn && ["/account"].includes(req.path)) {
    res.send("Access Denied!! Login First");
  } else {
    if (
      req.session.role !== "admin" &&
      ["/dashboard", "/mechanics"].includes(req.path)
    ) {
      res.send("Access Denied!! Admins Only");
    } else {
      next();
    }
  }
});

app.get("/", (req, res) => {
  //home route
  console.log(req.session);
  res.render("index.ejs");
});
app.get("/account", (req, res) => {
  if (req.session.role == "client") {
    dbconn.query(
      `SELECT * FROM bookings WHERE client_id = ${req.session.user.id_number}`,
      (Err, data) => {
        if (Err) return res.render("500.ejs");
        return res.render("client.ejs", { bookings: data });
      }
    );
  } else if (req.session.role == "mechanic") {
    res.render("mechanic.ejs");
  } else {
    res.redirect("/dashboard");
  }
});
app.get("/dashboard", (req, res) => {
  // fetch data data
  res.render("dashboard.ejs");
});
app.get("/mechanics", (req, res) => {
  res.render("mechanicsdata.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});
app.get("/services", (req, res) => {
  res.render("services.ejs");
});
app.get("/booknow", (req, res) => {
  res.render("booknow.ejs");
});
app.get("/signin", (req, res) => {
  console.log(req.query);
  if (req.query.message) {
    res.render("signin.ejs", { message: "Registration succesful!! Sign in" });
  } else if (req.query.error) {
    res.render("signin.ejs", { error: "Registration failed!! Select role" });
  } else {
    res.render("signin.ejs");
  }
});
app.post("/signin", express.urlencoded({ extended: true }), (req, res) => {
  const { loginemail, pass, role } = req.body; // desctructuring , ternary operator
  if (
    loginemail == "admin@myapp.co.ke" &&
    pass == "albert" &&
    role == "admin"
  ) {
    // create a session for admin
    req.session.isLoggedIn = true;
    req.session.user = { email: "admin@myapp.co.ke", full_name: "Admin" };
    req.session.role = "admin";
    res.redirect("/dashboard");
  } else {
    let checkEmailSQL = "";
    if (role == "mechanic") {
      checkEmailSQL = `SELECT * FROM mechanics WHERE email = "${loginemail}}" `;
    } else if (role == "client") {
      checkEmailSQL = `SELECT * FROM clients WHERE email = "${loginemail}" `;
    } else {
      res.locals.loginError = "incorect credentials";
      return res.render("signin.ejs", {
        loginError: "Incorrect Credentials. Try again!!",
      });
    }
    dbconn.query(checkEmailSQL, (error, data) => {
      if (error) {
        console.log(error); // sql error
        res.status(500).render("500.ejs");
      } else {
        console.log(data);
        if (data.length == 0) {
          return res.render("signin.ejs", {
            loginError: "Incorrect Credentials. Try again!!",
          });
        } else {
          if (bcrypt.compareSync(pass, data[0].password)) {
            // req.session.user = data[0]
            // successfulf signin --- create session -- store data server(ram/db)
            req.session.isLoggedIn = true;
            req.session.user = data[0];
            req.session.role = role;
            res.redirect("/account");
          } else {
            return res.render("signin.ejs", {
              loginError: "Incorrect Credentials. Try again!!",
            });
          }
        }
      }
    });
  }
});
app.post("/register", express.urlencoded({ extended: true }), (req, res) => {
  // actions -- input validation(package), save data in db(insert into clients/mechanics)
  const { id, fullname, password, email, phone, role, specialty, address } =
    req.body; // desctructuring

  const hashedPassword = bcrypt.hashSync(password, salt);

  let sql = "";
  if (role == "mechanic") {
    sql = `INSERT INTO mechanics(id_number, full_name,phone,specialty,email,password) VALUES(${id}, "${fullname}", "${phone}", "${specialty}", "${email}", "${hashedPassword}")`;
  } else if (role == "client") {
    sql = `INSERT INTO clients(id_number, full_name,phone,address,email,password) VALUES(${id}, "${fullname}", "${phone}", "${address}", "${email}", "${hashedPassword}")`;
  } else {
    return res.redirect("/signin?error=role");
  }
  dbconn.query(sql, (error) => {
    if (error) {
      res.render("500.ejs");
    } else {
      res.redirect("/signin?message=registered");
    }
  });
});

app.get("/days", (req, res) => {
  res.render("days.ejs", {
    data: [
      { date: "2024-10-23", name: "utilities", amount: "175.96" },
      { date: "2024-10-23", name: "groceries", amount: "399.82" },
      { date: "2024-10-24", name: "utilities", amount: "175.94" },
      { date: "2024-10-23", name: "githeri", amount: "75.94" },
      { date: "2024-10-23", name: "miscellaneous", amount: "94.10" },
      { date: "2024-10-24", name: "groceries", amount: "323.39" },
      { date: "2024-10-20", name: "transportation", amount: "135.08" },
      { date: "2024-10-22", name: "dining", amount: "235.86" },
      { date: "2024-10-18", name: "utilities", amount: "36.58" },
      { date: "2024-10-19", name: "dining", amount: "337.03" },
      { date: "2024-10-20", name: "groceries", amount: "59.08" },
      { date: "2024-10-21", name: "entertainment", amount: "74.08" },
      { date: "2024-10-18", name: "transportation", amount: "394.16" },
      { date: "2024-10-21", name: "transportation", amount: "272.42" },
      { date: "2024-10-23", name: "dining", amount: "446.88" },
      { date: "2024-10-20", name: "entertainment", amount: "418.13" },
      { date: "2024-10-23", name: "transportation", amount: "47.07" },
      { date: "2024-10-18", name: "groceries", amount: "233.44" },
      { date: "2024-10-19", name: "dining", amount: "453.34" },
      { date: "2024-10-22", name: "clothing", amount: "449.11" },
      { date: "2024-10-20", name: "clothing", amount: "352.89" },
    ],
  });
});
// page not found
app.get("*", (req, res) => {
  res.status(404).render("404.ejs");
});
// start
app.listen(3000, (err) => console.log("Server running on port 3000"));
