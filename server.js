const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(3);

const multer = require("multer");
const upload = multer({ dest: "public/mechanicprofiles" });
// uploadmech --drs
//  uploadclien -dest

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
  res.locals.isLoggedIn = req.session.isLoggedIn;
  if (
    !req.session.isLoggedIn &&
    [
      "/account",
      "/booknow",
      "/book",
      "/accept",
      "/decline",
      "/cancel",
    ].includes(req.path)
  ) {
    res.render("401.ejs");
  } else {
    if (
      req.session.role !== "admin" &&
      ["/dashboard", "/mechanics", "/deletebooking"].includes(req.path)
    ) {
      res.render("401.ejs");
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
      (error1, bookings) => {
        dbconn.query("SELECT * FROM services", (error2, services) => {
          dbconn.query("SELECT * FROM mechanics", (error3, mechanics) => {
            if (error1 || error2 || error3)
              return res.status(500).render("500.ejs");
            return res.render("client.ejs", { bookings, services, mechanics });
          });
        });
      }
    );
  } else if (req.session.role == "mechanic") {
    dbconn.query(
      `SELECT * FROM bookings WHERE mechanic_id = ${req.session.user.id_number}`,
      (error1, bookings) => {
        dbconn.query("SELECT * FROM services", (error2, services) => {
          dbconn.query("SELECT * FROM clients", (error3, clients) => {
            if (error1 || error2 || error3)
              return res.status(500).render("500.ejs");
            console.log(bookings); // [] ---
            return res.render("mechanic.ejs", { bookings, services, clients });
          });
        });
      }
    );
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
  if (req.session.isLoggedIn) {
    res.render("booknow.ejs");
  } else {
    res.redirect("/signin");
  }
});
app.get("/signin", (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/account");
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
  console.log(req.body);

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
      checkEmailSQL = `SELECT * FROM mechanics WHERE email = "${loginemail}" `;
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
app.post(
  "/register",
  express.urlencoded({ extended: true }),
  upload.single("profile"),
  (req, res) => {
    // actions -- input validation(package), save data in db(insert into clients/mechanics)
    const { id, fullname, password, email, phone, role, specialty, address } =
      req.body; // desctructuring
    console.log(req.file);

    const hashedPassword = bcrypt.hashSync(password, salt);

    let sql = "";
    if (role == "mechanic") {
      sql = `INSERT INTO mechanics(id_number, full_name,phone,specialty,email,password,profilepic) VALUES(${id}, "${fullname}", "${phone}", "${specialty}", "${email}", "${hashedPassword}", "${req.file.filename}")`;
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
  }
);

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

app.post("/book", express.urlencoded({ extended: true }), (req, res) => {
  console.log(req.body);
  const { mech, day, time, description } = req.body;
  //inserting booking to db
  const services = [];
  // Iterate over the keys in the object
  for (const key in req.body) {
    // Check if the key starts with "service_"
    if (key.startsWith("service_")) {
      services.push(req.body[key]); // Add the service to the array
    }
  }
  const sqlStatement = `INSERT INTO bookings(client_id,mechanic_id,day,scheduled_time,description,services) 
  VALUES ( ${
    req.session.user.id_number
  }, ${mech}, "${day}", "${time}", "${description}", "${services.join(",")}" )`;

  dbconn.query(sqlStatement, (error) => {
    if (error) {
      console.log(error);
      res.status(500).render("500.ejs");
    } else {
      // notify both the client and mech about the new booking via email/sms
      res.redirect("/account");
    }
  });
});

app.get("/accept", (req, res) => {
  let bookingId = req.query.booking || "";
  let sql = `UPDATE bookings SET bookingstatus="ACCEPTED" WHERE booking_id = ${bookingId} `;
  dbconn.query(sql, (error) => {
    if (!error) {
      res.redirect("/account?message=Succcesfully Accepted booking");
    } else {
      console.log(error);
      res.status(500).render("500.ejs");
    }
  });
});

app.get("/decline", (req, res) => {
  let bookingId = req.query.booking || "";
  let sql = `UPDATE bookings SET bookingstatus="DECLINED" WHERE booking_id = ${bookingId} `;
  dbconn.query(sql, (error) => {
    if (!error) {
      //
      res.redirect("/account?message=Succcesfully Declined booking");
    } else {
      console.log(error);
      res.status(500).render("500.ejs");
    }
  });
});
// cancel -- by client

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).render("500.ejs");
    res.redirect("/");
  });
});
// page not found
app.get("*", (req, res) => {
  res.status(404).render("404.ejs");
});
// start
app.listen(3000, (err) => console.log("Server running on port 3000"));
