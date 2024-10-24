const express = require("express");

const app = express();
app.use(express.static("public")); // serve static files -- redirect requests fro .css, img, .js files to a folder public

app.get("/", (req, res) => {
  //home route
  res.render("index.ejs");
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
  } else {
    res.render("signin.ejs");
  }
});
app.post("/register", (req, res) => {
  // actions -- input validation(package), save data in db(insert into clients/mechanics)

  res.redirect("/signin?message=registered");
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
