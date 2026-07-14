const express = require("express");
const app = express();
const Joi = require("joi");

const employees = require("./employees.json");
const PORT = 3000;

//Iteracion 1 y 2
app.get("/api/employees", (req, res) => {
  const page = +req.query.page;
  //Iteracion 4
  let employeesFilter = employees;

  if (req.query.user === "true") {
    employeesFilter = employees.filter((e) => e.privileges === "user");
  }

  //iteracion 6
  if (req.query.badges) {
    employeesFilter = employeesFilter.filter((e) =>
      e.badges.includes(req.query.badges),
    );
  }

  if (page) {
    res.json(employeesFilter.slice(2 * (page - 1), 2 * (page - 1) + 1));
  } else {
    res.json(employeesFilter);
  }
});
//Iteracion 3
app.get("/api/employees/oldest", (req, res) => {
  const employeesOldest = [...employees];
  const sorted = employeesOldest.sort((a, b) => b.age - a.age);

  res.json(sorted[0]);
});
//iteracion 7
app.get("/api/employees/:name", (req, res) => {
  const employee = employees.find((e) => e.name === req.params.name);

  res.json(employee);
});

//Iteracion 5
app.post("/api/employees", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),

    age: Joi.number().integer().min(0).required(),

    phone: Joi.object({
      personal: Joi.string().required(),
      work: Joi.string().required(),
      ext: Joi.string().required(),
    }).required(),

    privileges: Joi.string().valid("user", "admin", "moderator").required(),

    favorites: Joi.object({
      artist: Joi.string().required(),
      food: Joi.string().required(),
    }).required(),

    finished: Joi.array().items(Joi.number()).required(),

    badges: Joi.array().items(Joi.string()).required(),

    points: Joi.array()
      .items(
        Joi.object({
          points: Joi.number().required(),
          bonus: Joi.number().required(),
        }),
      )
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json(error.details);
    return;

    if (employees.map((e) => e.name).includes(req.body.name)) {
      res.status(409).json({ message: "employee already exist" });
      return;
    }

    console.log("created employee", req.body.name);
    employees.push(req.body);
    res.status(201).json(req.body);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
