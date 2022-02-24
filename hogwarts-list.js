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

  console.log("jsonData", jsonData);
  //   prepareObject(allStudents);
}

function prepareObject(students) {}

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
  clone.querySelector("[data-field=name]").textContent = student.fullname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  //   clone.querySelector("[data-field=age]").textContent = animal.age;
  document.querySelector("#list tbody").appendChild(clone);
}
