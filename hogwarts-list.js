"use strict";

window.addEventListener("DOMContentLoaded", setup);

let allStudents = [];
let tidyArr;

const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  alias: "",
  house: "",
  prefect: false,
  squad: false,
  blood: "",
};

function setup() {
  console.log("ready");
  loadJSON();
}

async function loadJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
  //   displayList(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  tidyArr = allStudents;
  displayList(tidyArr);
  console.log("jsonData", jsonData);
  return tidyArr;
  //   prepareObject(allStudents);
}

function prepareObject(jsonObject) {
  // get name parts
  const student = Object.create(Student);
  let firstName = jsonObject.fullname.substring(
    0,
    jsonObject.fullname.indexOf(" ")
  );
  let middleName = jsonObject.fullname.substring(
    jsonObject.fullname.indexOf(" "),
    jsonObject.fullname.lastIndexOf(" ")
  );
  let lastName = jsonObject.fullname.substring(
    jsonObject.fullname.lastIndexOf(" ")
  );

  let cleanHouse = jsonObject.house.trim();
  let cleanLName = lastName.trim();
  let cleanName = firstName.trim();
  let cleanMName = middleName.trim();

  student.lastname = `${cleanLName.substring(0, 1).toUpperCase()}${cleanLName
    .substring(1, cleanLName.length)
    .toLowerCase()}`;
  student.middlename = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName
    .substring(1, cleanMName.length)
    .toLowerCase()}`;
  if (firstName) {
    student.firstname = `${cleanName.substring(0, 1).toUpperCase()}${cleanName
      .substring(1, cleanName.length)
      .toLowerCase()}`;
  } else {
    student.firstname = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName
      .substring(1, cleanMName.length)
      .toLowerCase()}`;
    student.middlename = "";
  }
  if (cleanMName.startsWith('"')) {
    student.middlename = "";
  }
  student.blood = jsonObject.blood;
  student.house = `${cleanHouse.substring(0, 1).toUpperCase()}${cleanHouse
    .substring(1, cleanHouse.length)
    .toLowerCase()}`;

  return student;
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";
  console.log("displayList");
  // build a new list

  students.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = student.firstname;
  //   clone.querySelector("[data-field=middle-name]").textContent =
  //     student.middlename;
  clone.querySelector("[data-field=middle-name]").textContent =
    student.middlename;

  clone.querySelector("[data-field=last-name]").textContent = student.lastname;

  clone.querySelector("[data-field=house]").textContent = student.house;
  //   clone.querySelector("[data-field=age]").textContent = animal.age;
  document.querySelector("#list tbody").appendChild(clone);
}
