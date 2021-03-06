"use strict";
window.addEventListener("DOMContentLoaded", setup);

let systemHacked = false;
let allStudents = [];
let filterStudents;
let expelledStudents = [];
let squadStudents = [];
let prefects = [];
let familiesArray = [];

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
  cannotBeExpelled: false,
};

const ailin = {
  firstname: "Ailin",
  middlename: "Maria",
  lastname: "Torre Val",
  house: "Ravenclaw",
  blood: "Pure Blood",
  prefect: false,
  squad: false,
  regStudent: true,
  cannotBeExpelled: true,
};

const marina = {
  firstname: "Marina",
  middlename: "Iuliana",
  lastname: "Tancau",
  house: "Gryffindor",
  blood: "Pure Blood",
  prefect: false,
  squad: false,
  regStudent: true,
  siblings: false,
  cannotBeExpelled: true,
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

  //setting search bar
  document.querySelector("#search-bar").addEventListener("input", searchBar);
  //adding the hacking button
  document.querySelector("#hack-btn").addEventListener("click", hackTheSystem);

  loadJSON();
}

async function loadJSON() {
  const studentsData = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await studentsData.json();

  const familiesData = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  familiesArray = await familiesData.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  filterStudents = allStudents;
  buildList(filterStudents);
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
    student.alias = cleanMName;
  }

  //   setting blood status
  let pureBlooded = familiesArray.pure;
  let halfBlooded = familiesArray.half;

  if (pureBlooded.includes(student.lastname)) {
    student.blood = "Pure Blood";
  } else if (halfBlooded.includes(student.lastname)) {
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
  student.cannotBeExpelled = false;
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
  displayList(filterStudents);
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
  let regStudents = filterStudents.filter(
    (student) => student.regStudent === true
  );

  displayList(regStudents);
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

  counters();

  // set clone data
  clone.querySelector("[data-field=name]").textContent = student.firstname;
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

  // adding event listeners to students for popup and prefect and squad features
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

  function prefClicked() {
    if (student.regStudent === true) {
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
    } else {
      student.prefect = false;
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
        student.prefect = false;
        console.log("you can have only 2 per house", prefectsHouse);
        //show popup
        document.querySelector("#pref-popup").classList.remove("hidden");
        document.querySelector("#pref-house").textContent = student.house;
        document.querySelector("#pref-btn").addEventListener("click", closePU);
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
    if (systemHacked === false) {
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
          // document.querySelector("#squad-popup").classList.remove("hidden");
          document.querySelector("#squad-popup").classList.remove("hidden");
          document
            .querySelector("#squad-btn")
            .addEventListener("click", closePU);
        }
      } else {
        student.squad = false;
      }
    } else {
      hackingSquad();
    }
    buildList();
  }

  function hackingSquad() {
    console.log("you cant woohoooo");
    if (student.blood === "Pure Blood" || student.house === "Slytherin") {
      squadStudents.push(student);
      student.squad = true;
      setTimeout(squadHacked, 3000);
    } else {
      console.log("you cant be squad");
      document.querySelector("#squad-popup").classList.remove("hidden");
      document.querySelector("#squad-btn").addEventListener("click", closePU);
    }
    buildList();
  }

  function squadHacked() {
    document.querySelector("#whoosh-sound").play();
    student.squad = false;
    document.querySelector("#whoosh-sound").play();
    const index = squadStudents.indexOf(student);
    squadStudents.splice(index, 1);
    buildList();
  }

  function openStudPU() {
    console.log("show student info", student.lastname);
    document.querySelector("#student-popup").classList.remove("hidden");
    document.querySelector("#sunglasses").classList.add("hidden");

    if (student.alias) {
      document.querySelector("#popup-name").textContent =
        student.firstname + " " + student.alias + " " + student.lastname;
    } else {
      document.querySelector("#popup-name").textContent =
        student.firstname + " " + student.middlename + " " + student.lastname;
    }

    if (student.regStudent) {
      document.querySelector("#popup-status").textContent = "Regular Student";
      document.querySelector("#popup-status").classList.remove("red");
      document.querySelector("#popup-expell").classList.remove("hidden");
      document.querySelector("#expelled-stamp").classList.add("hidden");
    } else {
      document.querySelector("#popup-status").textContent = "Expelled Student";
      document.querySelector("#popup-status").classList.add("red");
      document.querySelector("#popup-expell").classList.add("hidden");
    }

    if (student.prefect) {
      document.querySelector("#popup-pref").classList.remove("hidden");
    } else {
      document.querySelector("#popup-pref").classList.add("hidden");
    }

    if (student.squad) {
      document.querySelector("#popup-sq").classList.remove("hidden");
    } else {
      document.querySelector("#popup-sq").classList.add("hidden");
    }
    document.querySelector(
      "#student-popup"
    ).style.borderColor = `var(--${student.house})`;
    document.querySelector(
      "#house-flag"
    ).src = `./assets/${student.house.toLowerCase()}-flag.svg`;
    document.querySelector(
      "#house-logo"
    ).src = `./assets/${student.house.toLowerCase()}.png`;

    document.querySelector("#popup-house").textContent = student.house;
    document.querySelector("#popup-blood").textContent = student.blood;

    //getting the images with the propper name

    if (student.lastname.includes("-")) {
      let urlImage;
      let imglastName = student.lastname.substring(
        student.lastname.indexOf("-") + 1
      );
      urlImage =
        imglastName.toLowerCase() +
        "_" +
        student.firstname.charAt(0).toLowerCase() +
        ".png";
      console.log(urlImage);
      document.querySelector(
        "#student-pic"
      ).src = `./students-pics/${urlImage}`;
    } else if (student.lastname === "Patil") {
      document.querySelector("#student-pic").src =
        "./students-pics/" +
        student.lastname.toLowerCase() +
        "_" +
        student.firstname.toLowerCase() +
        ".png";
    } else if (student.lastname === "Leanne") {
      document.querySelector("#student-pic").src = "./students-pics/no-pic.png";
    } else {
      document.querySelector("#student-pic").src =
        "./students-pics/" +
        student.lastname.toLowerCase() +
        "_" +
        student.firstname[0].substring(0, 1).toLowerCase() +
        ".png";
    }

    //event listeners for expelling student and closing window
    document.querySelector("#popup-close").addEventListener("click", closePU);

    document
      .querySelector("#popup-expell")
      .addEventListener("click", clickExpel);

    buildList();
  }

  function clickExpel() {
    if (student.cannotBeExpelled === false) {
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
      document.querySelector("#expelled-stamp").classList.remove("hidden");
      document.querySelector("#expelled-stamp").classList.add("fade-in");

      console.log(student.firstname + " is expelled");
      buildList();
    } else {
      cantExpel();
    }
  }
  function cantExpel() {
    document.querySelector("#no-way-sound").play();
    document.querySelector("#cant-expel-stamp").classList.remove("hidden");
    document.querySelector("#cant-expel-stamp").classList.add("in-out");
    document
      .querySelector("#cant-expel-stamp")
      .addEventListener("animationend", function () {
        document.querySelector("#cant-expel-stamp").classList.add("hidden");
      });
    document.querySelector("#sunglasses").classList.remove("hidden");
    document.querySelector("#sunglasses").classList.add("glasses");
  }

  document.querySelector("#list tbody").appendChild(clone);
}

//setting counters
function counters() {
  document.querySelector(
    "#all-counter"
  ).textContent = `(${allStudents.length})`;
  document.querySelector("#pref-counter").textContent = `(${prefects.length})`;
  document.querySelector(
    "#squad-counter"
  ).textContent = `(${squadStudents.length})`;
  document.querySelector(
    "#expell-counter"
  ).textContent = `(${expelledStudents.length})`;

  let countingRegStudents = allStudents.filter(
    (student) => student.regStudent === true
  );
  document.querySelector(
    "#reg-counter"
  ).textContent = `(${countingRegStudents.length})`;

  let countingPureBloods = allStudents.filter(
    (student) => student.blood === "Pure Blood"
  );
  document.querySelector(
    "#pureb-counter"
  ).textContent = `(${countingPureBloods.length})`;

  let countingHalfBloods = allStudents.filter(
    (student) => student.blood === "Half-Blood"
  );
  document.querySelector(
    "#halfb-counter"
  ).textContent = `(${countingHalfBloods.length})`;

  let countingMuggles = allStudents.filter(
    (student) => student.blood === "Muggle"
  );
  document.querySelector(
    "#muggle-counter"
  ).textContent = `(${countingMuggles.length})`;

  let countingSlyt = allStudents.filter(
    (student) => student.house === "Slytherin"
  );
  document.querySelector(
    "#slyt-counter"
  ).textContent = `(${countingSlyt.length})`;

  let countingHuff = allStudents.filter(
    (student) => student.house === "Hufflepuff"
  );
  document.querySelector(
    "#huff-counter"
  ).textContent = `(${countingHuff.length})`;

  let countingRave = allStudents.filter(
    (student) => student.house === "Ravenclaw"
  );
  document.querySelector(
    "#rave-counter"
  ).textContent = `(${countingRave.length})`;

  let countingGryff = allStudents.filter(
    (student) => student.house === "Gryffindor"
  );
  document.querySelector(
    "#gryff-counter"
  ).textContent = `(${countingGryff.length})`;
}

function searchBar(e) {
  const searchString = e.target.value.toLowerCase();
  const searchStudent = allStudents.filter((student) => {
    return (
      student.firstname.toLowerCase().includes(searchString) ||
      student.lastname.toLowerCase().includes(searchString) ||
      student.house.toLowerCase().includes(searchString)
    );
  });
  displayList(searchStudent);
}

function hackTheSystem() {
  document.querySelector("#hack-sound").play();
  document.querySelector("#bg").style.backgroundImage =
    "url(./assets/hack-paper-txt.jpg)";
  document
    .querySelector("#hack-btn")
    .removeEventListener("click", hackTheSystem);
  document.querySelector("#hack-btn").classList.add("hidden");
  systemHacked = true;
  allStudents.push(ailin);
  allStudents.push(marina);
  allStudents.forEach(randomBlood);
  console.log("system hacked");
  buildList();
}

function randomBlood(student) {
  console.log(student);
  if (student.blood === "Pure Blood") {
    if (student.cannotBeExpelled === false) {
      const types = ["Muggle", "Half-Blood"];
      const randomNumber = Math.floor(Math.random() * 2);
      student.blood = types[randomNumber];
      console.log(student.blood);
    } else {
      student.blood = "Pure Blood";
    }
  } else {
    student.blood = "Pure Blood";
  }
}

function closePU() {
  console.log("close pu");
  document.querySelector("#student-popup").classList.add("hidden");
  document.querySelector("#pref-popup").classList.add("hidden");
  document.querySelector("#squad-popup").classList.add("hidden");
}
