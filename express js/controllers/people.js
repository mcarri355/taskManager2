const { response } = require('express');
let { people } = require('../data');
const person = require('../models/person');
// Get function for all people
const readPeople = async (req, res) => {
  // res.json({ success: true, data: people });
  try {
    let answer = await person.find({});
    console.log(answer);
    res.json(answer);
  } catch (err) {
    console.log(err);
  }
};

// Post function for creating people
// let length = people.length + 1;
const createPeople = async (req, res) => {
  try {
    let answer = await person.create(req.body);
    console.log(answer);
    res.json(answer);
  } catch (err) {
    console.log(err);
  }
  // const { name, id } = req.body;
  // if (!name) {
  //   return res
  //     .status(400)
  //     .json({ data: [], success: false, msg: 'Please enter a name' });
  // }
  // let person = { id: length++, name: name };
  // people.push(person);
  // res.status(200).json({ success: true, data: [people] });
};

// PUT function for update people
const updatePeople = async (req, res) => {
  try {
    const { id } = req.params;
    let answer = await person.updateOne(id);
    console.log(answer);
    res.json(answer);
  } catch (err) {
    console.log(err);
  }
  // const { name } = req.body;
  // const person = people.find((person) => person.id === Number(id));
  // if (!person) {
  //   return res.json({ success: false, data: [] });
  // }
  // const newPeople = people.map((person) => {
  //   if (person.id === Number(id)) {
  //     person.name = name;
  //   }
  //   return person;
  // });
  // res.status(202).json({ data: newPeople, success: true });
};

// Delete Function for delte people
const deletePerson = (req, res) => {
  const { id } = req.params;
  const person = people.find((person) => person.id === Number(id));
  if (!person) {
    return res
      .status(404)
      .json({ success: false, data: [], msg: 'No matching ID found' });
  }

  people = people.filter((person) => {
    return person.id !== Number(id);
  });
  res.status(200).json({ data: people, success: true });
};

module.exports = { createPeople, readPeople, updatePeople, deletePerson };
