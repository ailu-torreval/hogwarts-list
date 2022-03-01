"use strict";

const pureBloodFamilies = [
  "Boot",
  "Cornfoot",
  "Abbott",
  "Avery",
  "Black",
  "Blishwick",
  "Brown",
  "Bulstrode",
  "Burke",
  "Carrow",
  "Crabbe",
  "Crouch",
  "Fawley",
  "Flint",
  "Gamp",
  "Gaunt",
  "Goyle",
  "Greengrass",
  "Kama",
  "Lestrange",
  "Longbottom",
  "MacDougal",
  "Macmillan",
  "Malfoy",
  "Max",
  "Moody",
  "Nott",
  "Ollivander",
  "Parkinson",
  "Peverell",
  "Potter",
  "Prewett",
  "Prince",
  "Rosier",
  "Rowle",
  "Sayre",
  "Selwyn",
  "Shacklebolt",
  "Shafiq",
  "Slughorn",
  "Slytherin",
  "Travers",
  "Tremblay",
  "Tripe",
  "Urquart",
  "Weasley",
  "Yaxley",
  "Bletchley",
  "Dumbledore",
  "Fudge",
  "Gibbon",
  "Gryffindor",
  "Higgs",
  "Lowe",
  "Macnair",
  "Montague",
  "Mulciber",
  "Orpington",
  "Pyrites",
  "Perks",
  "Runcorn",
  "Wilkes",
  "Zabini",
];

const halfBloodFamilies = [
  "Abbott",
  "Bones",
  "Jones",
  "Hopkins",
  "Finnigan",
  "Potter",
  "Brocklehurst",
  "Goldstein",
  "Corner",
  "Bulstrode",
  "Patil",
  "Li",
  "Thomas",
];

window.addEventListener("DOMContentLoaded", setup);

let allStudents = [];
let filterStudents;
let expelledStudents = [];
let regStudents;
let squadStudents = [];
let prefects = [];
let prefSlytherin = [];
let prefGryffindor = [];
let prefHufflepuff = [];
let prefRavenclaw = [];

const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  alias: "",
  house: "",
  blood: "",
  status: "",
  prefect: false,
  squad: false,
  regStudent: true,
  siblings: false,
};

function setup() {
  console.log("ready");
  //   setting filter events
  document
    .querySelectorAll("[data-action='filterPS']")
    .forEach((button) => button.addEventListener("click", selectFilterPS));
  document
    .querySelectorAll("[data-action='filterPS']")
    .forEach((button) => button.addEventListener("click", selectFilterPS));
  document
    .querySelectorAll("[data-action='filterB']")
    .forEach((button) => button.addEventListener("click", selectFilterB));
  document
    .querySelectorAll("[data-action='filterH']")
    .forEach((button) => button.addEventListener("click", selectFilterH));
  document
    .querySelectorAll("[data-action='filterS']")
    .forEach((button) => button.addEventListener("click", selectFilterS));

  document.querySelector("#all").addEventListener("click", showAll);
  // setting sorting event
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
  loadJSON();
}

async function loadJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  filterStudents = allStudents;
  displayList(filterStudents);
  console.log("jsonData", jsonData);
  return filterStudents;
  //   prepareObject(allStudents);
}
function prepareObject(jsonObject) {
  // get name parts
  const student = Object.create(Student);
  let cleanFullname = jsonObject.fullname.trim();

  let firstName = cleanFullname.substring(0, cleanFullname.indexOf(" "));

  let middleName = cleanFullname.substring(
    cleanFullname.indexOf(" "),
    cleanFullname.lastIndexOf(" ")
  );

  let lastName = cleanFullname.substring(cleanFullname.lastIndexOf(" "));

  let cleanHouse = jsonObject.house.trim();
  let cleanLName = lastName.trim();
  let cleanName = firstName.trim();
  let cleanMName = middleName.trim();
  //capitalize
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

  //   setting blood status

  if (pureBloodFamilies.includes(student.lastname)) {
    student.blood = "Pure Blood";
  } else if (halfBloodFamilies.includes(student.lastname)) {
    student.blood = "Half-Blood";
  } else {
    student.blood = "Muggle";
  }

  student.house = `${cleanHouse.substring(0, 1).toUpperCase()}${cleanHouse
    .substring(1, cleanHouse.length)
    .toLowerCase()}`;

  student.regStudent = true;
  student.squad = false;
  student.prefect = false;
  //checking siblings for patil issue

  return student;
}

function selectSort(event) {
  const sortParam = event.target.dataset.sort;
  console.log(`user select, ${sortParam}`);
  sortList(sortParam);
}

function sortList(sortParam) {
  filterStudents = filterStudents.sort(sortByParam);

  function sortByParam(studentA, studentB) {
    if (studentA[sortParam] < studentB[sortParam]) {
      return -1;
    } else {
      return 1;
    }
  }

  buildList(filterStudents);
}

function selectFilterPS(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterPSList(filter);
}

function selectFilterB(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterBList(filter);
}
function selectFilterH(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterHList(filter);
}

function selectFilterS(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterSList(filter);
}

function filterPSList(filter) {
  filterStudents = allStudents;
  if (filter === "pref") {
    filterStudents = filterStudents.filter(
      (student) => student.prefect === true
    );
  } else {
    filterStudents = filterStudents.filter((student) => student.squad === true);
  }

  console.log("status", filterStudents);
  buildList(filterStudents);
}

function filterSList(filter) {
  filterStudents = allStudents;
  if (filter === "regular") {
    filterStudents = filterStudents.filter(
      (student) => student.regStudent === true
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.regStudent === false
    );
  }

  console.log("status", filterStudents);
  buildList(filterStudents);
}

function filterHList(house) {
  filterStudents = allStudents;
  if (house === "Gryffindor") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Gryffindor"
    );
  } else if (house === "Hufflepuff") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Hufflepuff"
    );
  } else if (house === "Ravenclaw") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Ravenclaw"
    );
  } else if (house === "Slytherin") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Slytherin"
    );
  }
  console.log("filterH", filterStudents);
  buildList(filterStudents);
}

function filterBList(blood) {
  filterStudents = allStudents;
  if (blood === "Pure Blood") {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Pure Blood"
    );
  } else if (blood === "Half-Blood") {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Half-Blood"
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Muggle"
    );
  }
  console.log(filterStudents);
  //   let purestudents = filterStudents.filter(isPure);

  //   let muggleStudents = filterStudents.filter(isMuggle);
  buildList(filterStudents);
}

function showAll() {
  filterStudents = allStudents;
  displayList(allStudents);
}
//build list
function buildList() {
  console.log("buildList");

  displayList(filterStudents);
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
  clone.querySelector("[data-field=blood-status]").textContent = student.blood;
  if (student.regStudent) {
    clone.querySelector("[data-field=status]").textContent = "Regular Student";
  } else {
    clone.querySelector("[data-field=status]").textContent = "Expelled Student";
    clone.querySelector("#student-info").classList.add("grey");
  }
  //   clone.querySelector("[data-field=status]").textContent = student.status;

  // adding event listeners to students for poup
  if (student.prefect) {
    clone.querySelector(".pref-badge").classList.remove("grey");
  } else {
    clone.querySelector(".pref-badge").classList.add("grey");
  }

  if (student.squad) {
    clone.querySelector(".inq-squad").classList.remove("grey");
  } else {
    clone.querySelector(".inq-squad").classList.add("grey");
  }

  clone
    .querySelector("[data-field=last-name]")
    .addEventListener("click", openStudPU);
  clone
    .querySelector("[data-field=name]")
    .addEventListener("click", openStudPU);
  clone
    .querySelector("[data-field=pref]")
    .addEventListener("click", prefClicked);
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", squadClicked);

  // function clickPrefects(clickedStudent) {
  //     console.log(clickedStudent);

  //     //creates an array for the prefects
  //     const prefects = allStudents.filter((elm) => {
  //       return elm.prefect === true;
  //     });

  //     // Determine the house of student in prefects array
  //     const prefectsOfHouse = prefects.filter((elm) => {
  //       return elm.house === clickedStudent.house;
  //     });

  //     // determine the clicked student by house and "allready prefect"
  //     if (clickedStudent.prefect === true) {
  //       console.log("remooove"); // doesent work for whatever reason
  //       clickedStudent.prefect = false;
  //     } else if (prefectsOfHouse) {
  //       clickedStudent.prefect = false;
  //     }

  //     if (prefectsOfHouse.length > 1) {
  //       clickedStudent.prefect = false;
  //     } else {
  //       clickedStudent.prefect = true;
  //     }

  //     // Stop the prefects array from going over 8
  //     if (prefects.length > 7) {
  //       clickedStudent.prefect = false;
  //     }

  //     displayList(allStudents);
  //   }

  function prefClicked() {
    if (student.prefect === true) {
      student.prefect = false;
      const index = prefects.indexOf(student);
      prefects.splice(index, 1);
      console.log("taking out of the array");
    } else {
      console.log("its your student");
      student.prefect = true;
      //   prefects.push(student);
      checkPrefect(student);
    }
    buildList();
  }

  function checkPrefect(student) {
    const prefectsHouse = prefects.filter(
      (stud) => stud.house === student.house
    );
    console.log(prefectsHouse);
    const nrHouse = prefectsHouse.length;

    if (student.prefect === true) {
      if (nrHouse >= 2) {
        console.log("you can have only 2 per house", prefectsHouse);
        student.prefect = false;
      } else {
        makePrefect(student);
        console.log("make prefect");
      }
    }
  }

  function makePrefect(student) {
    student.prefect = true;

    prefects.push(student);

    buildList();
  }

  function squadClicked() {
    if (student.regStudent === true) {
      if (student.blood === "Pure Blood" || student.house === "Slytherin") {
        if (student.squad === true) {
          student.squad = false;
          const index = squadStudents.indexOf(student);
          squadStudents.splice(index, 1);
        } else {
          student.squad = true;
          squadStudents.push(student);
        }
      } else {
        console.log("you cant be squad");
        document.querySelector("#squad-popup").classList.remove("hidden");
        document.querySelector("#squad-btn").addEventListener("click", closePU);
      }
    } else {
      student.squad = false;
    }
    buildList();
  }

  function openStudPU() {
    console.log("show student info", student.lastname);
    document.querySelector("#student-popup").classList.remove("hidden");
    document.querySelector("#popup-name").textContent =
      student.firstname + " " + student.middlename + " " + student.lastname;

    if (student.regStudent) {
      document.querySelector("#popup-status").textContent = "Regular Student";
      document.querySelector("#popup-status").classList.remove("red");
      document.querySelector("#popup-expell").classList.remove("hidden");
    } else {
      document.querySelector("#popup-status").textContent = "Expelled Student";
      document.querySelector("#popup-status").classList.add("red");
      document.querySelector("#popup-expell").classList.add("hidden");
    }

    document.querySelector(
      "#house-flag"
    ).src = `/assets/${student.house}-flag.svg`;
    document.querySelector("#house-logo").src = `/assets/${student.house}.png`;

    document.querySelector("#popup-house").textContent = student.house;
    document.querySelector("#popup-blood").textContent = student.blood;

    document.querySelector("#student-pic").src = `/students-pics/${
      student.lastname
    }_${student.firstname.charAt(0)}.png`;

    if (student.lastname.includes("-")) {
      let urlImage;

      let imglastName = student.lastname.substring(
        student.lastname.indexOf("-") + 1
      );

      urlImage =
        imglastName + "_" + student.firstname.charAt(0).toLowerCase() + ".png";

      console.log(urlImage);

      document.querySelector("#student-pic").src = `/students-pics/${urlImage}`;
    } else {
      document.querySelector("#student-pic").src = `/students-pics/${
        student.lastname
      }_${student.firstname.charAt(0)}.png`;
    }
    // for padma parvitti

    document.querySelector("#popup-close").addEventListener("click", closePU);

    //event listener for expelling student
    document
      .querySelector("#popup-expell")
      .addEventListener("click", clickExpel);
    buildList();
  }

  function clickExpel() {
    expelledStudents.push(student);
    student.regStudent = false;
    student.squad = false;
    student.prefect = false;
    document
      .querySelector("#popup-expell")
      .removeEventListener("click", clickExpel);
    document.querySelector("#popup-status").textContent = "Expelled Student";
    document.querySelector("#popup-status").classList.add("red");
    document.querySelector("#popup-expell").classList.add("hidden");

    console.log(student.firstname + " is expelled");
    buildList();
  }

  document.querySelector("#list tbody").appendChild(clone);
}

function closePU() {
  document.querySelector("#student-popup").classList.add("hidden");
  document.querySelector("#pref-popup").classList.add("hidden");
  document.querySelector("#squad-popup").classList.add("hidden");
}
