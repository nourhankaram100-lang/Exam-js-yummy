document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    const inputs = {
        name: document.getElementById("contactInput1"),
        email: document.getElementById("contactInput2"),
        phone: document.getElementById("contactInput3"),
        age: document.getElementById("contactInput4"),
        password: document.getElementById("contactInput5"),
        rePassword: document.getElementById("contactInput6"),
    };

    const errors = {
        name: document.getElementById("nameError"),
        email: document.getElementById("emailError"),
        phone: document.getElementById("phoneError"),
        age: document.getElementById("ageError"),
        password: document.getElementById("passwordError"),
        rePassword: document.getElementById("rePasswordError"),
    };

    function validateField(field) {
        switch (field) {
            case "name":
                if (!/^[a-zA-Z ]+$/.test(inputs.name.value)) {
                    errors.name.classList.remove("d-none");
                    return false;
                } else {
                    errors.name.classList.add("d-none");
                    return true;
                }
            case "email":
                if (!/^\S+@\S+\.\S+$/.test(inputs.email.value)) {
                    errors.email.classList.remove("d-none");
                    return false;
                } else {
                    errors.email.classList.add("d-none");
                    return true;
                }
            case "phone":
                if (!/^\d{10,15}$/.test(inputs.phone.value)) {
                    errors.phone.classList.remove("d-none");
                    return false;
                } else {
                    errors.phone.classList.add("d-none");
                    return true;
                }
            case "age":
                if (!(inputs.age.value >= 1 && inputs.age.value <= 100)) {
                    errors.age.classList.remove("d-none");
                    return false;
                } else {
                    errors.age.classList.add("d-none");
                    return true;
                }
            case "password":
                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(inputs.password.value)) {
                    errors.password.classList.remove("d-none");
                    return false;
                } else {
                    errors.password.classList.add("d-none");
                    return true;
                }
            case "rePassword":
                if (inputs.password.value !== inputs.rePassword.value) {
                    errors.rePassword.classList.remove("d-none");
                    return false;
                } else {
                    errors.rePassword.classList.add("d-none");
                    return true;
                }
        }
    }

    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener("input", () => validateField(key));
        inputs[key].addEventListener("blur", () => validateField(key));
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let valid = true;

        Object.keys(inputs).forEach(key => {
            if (!validateField(key)) valid = false;
        });

        if (valid) {
            alert("Form submitted successfully!");
            form.reset();
        }
    });
});


// navbar
var menu = document.querySelector(".menu");
var divNav = document.querySelector("div.nav");

menu.addEventListener("click", function () {
  if (divNav.classList.contains("d-none")) {
    divNav.classList.remove("d-none");
    menu.classList.replace("fa-align-justify", "fa-x");
  } else {
    divNav.classList.add("d-none");
    menu.classList.replace("fa-x", "fa-align-justify");
  }
});







// تقسيم براجراف قسم ingradiant 
function truncateWords(text, limit) {
  if (!text) return "";
  let words = text.split(" ");   
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") 
}




function getIngredientsList(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }
  return ingredients;
}


//main index html
async function getMeals() {
  showLoader()
  let res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  let data = await res.json();
  displayMeals(data.meals);
  hideLoader()
}


function displayMeals(meals) {
  let box = `<div class="row g-4">`;
  
  meals.forEach(meal => {
    box += `
    <div class="col-lg-3 col-md-4 col-sm-6">
    <div class="card bg-dark text-white meal-card position-relative tr d-flex mb-1 overflow-hidden" onclick="getMealDetails('${meal.idMeal}')">
    <img src="${meal.strMealThumb}" class="" alt="">
    <div class="card-body position-absolute top-0 bottom-0 start-0 end-0 px-2 bg-white opacity-75 d-flex">
    <h5 class="card-title text-center text-dark position-relative top-50 fs-4">${meal.strMeal}</h5>
              </div>
            </div>
          </div>
        `;
  });

  box += `</div>`;

  document.getElementById("main").innerHTML = box;
}





async function getMealDetails(id) {
  showLoader()
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let data = await res.json();
  let meal = data.meals[0];
  let recipes = getIngredientsList(meal);
  displayMealDetails(meal, recipes);
  hideLoader()
}

function displayMealDetails(meal, recipes) {
  document.getElementById("main").innerHTML = `
    <div class="row">
      <div class="col-md-4 text-white">
        <img src="${meal.strMealThumb}" class="img-fluid rounded" alt="">
        <h2>${meal.strMeal}</h2>
      </div>
      <div class="col-md-8 text-white">
      <h4 class="fs-3">Instructions</h4>
        <p>${meal.strInstructions}</p>
        <h4>Category : ${meal.strCategory}</h4>
        <h4>Area : ${meal.strArea}</h4>
        <h4 class="mt-3 ">Recipes : </h4>
        <div class="row g-2 ">
          ${recipes.map(item => `<div class="col-md-3 p-1 rounded mx-2 color-recipes w-auto">${item}</div>`).join('')}
       <div>
          <h4>Tags :</h4>
              <a href="${meal.strSource}" target="_blank" class="btn btn-success mt-2 text-capitalize">
              source
            </a>


              <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-2 text-capitalize">
              youTube
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

//Categories
async function getCategories() {
showLoader()
  let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  let data = await res.json();
  displayCategories(data.categories);
  console.log(data.categories)
hideLoader()
}

function displayCategories(categories) {
  let box = `<div class="row g-4">`;
  categories.forEach(cat => {
    box += `
      <div class="col-lg-3 col-md-4 col-sm-6 bg-transparent">
        <div class="card category-card cursor-pointer bg-transparent  position-relative  d-flex  overflow-hidden z-1" onclick="getMealsByCategory('${cat.strCategory}')">
          <img src="${cat.strCategoryThumb}" class="card-img-top" alt="${cat.strCategory}">
          <div class="card-body text-center position-absolute top-0 bottom-0 start-0 end-0  bg-white opacity-75 z-1">
            <h5 class="card-title category-title mb-1">${cat.strCategory}</h5>
            <p class="m-1">${cat.strCategoryDescription}</p>
          </div>
        </div>
      </div>
    `;
  });
  box += `</div>`;
  document.getElementById("main").innerHTML = box;
}

async function getMealsByCategory(category) {
  showLoader()
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  let data = await res.json();
  displayMealsByCategory(data.meals, category);
hideLoader()
}

function displayMealsByCategory(meals, categoryName) {
  let box = `<div class="row g-4 ">`;
  meals.forEach(meal => {
    box += `
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="meal-card cursor-pointer card category-card cursor-pointer bg-transparent  position-relative  d-flex overflow-hidden" onclick="getMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body  text-center position-absolute top-0 bottom-0 start-0 end-0  bg-white opacity-75 d-flex  align-content-center">
            <h5 class="card-title meal-title text-center text-dark position-relative top-50  start-0 fs-4">${meal.strMeal}</h5>
          </div>
        </div>
      </div>
    `;
  });
  box += `</div>`;
  document.getElementById("main").innerHTML = box;
}

//Area
async function getAreas() {
  showLoader()
  let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  let data = await res.json();
  displayAreas(data.meals);
  hideLoader()
}

function displayAreas(areas) {
  let box = `<div class="row mx-3">`;
  areas.forEach(area => {
    box += `
      <div class="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
        <div class="card area-card cursor-pointer text-center py-2 bg-transparent d-flex justify-content-center align-content-center text-white fs-1" 
             onclick="getMealsByArea('${area.strArea}')">
          <div >
              <div>
               <i class="fa-solid fa-house-laptop fw-bolder"></i>
              </div>
          <h5 class="card-title fs-3 text-white">${area.strArea}</h5>
          </div>
        </div>
      </div>
    `
  });
  box += `</div>`;
  document.getElementById("main").innerHTML = box;
}


async function getMealsByArea(areaName) {
  showLoader()
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
  let data = await res.json();

  let box = `<div class="row g-3">`;
  data.meals.forEach(meal => {
    box += `
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="meal-card cursor-pointer card category-card cursor-pointer bg-transparent  position-relative  d-flex overflow-hidden" onclick="getMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body  text-center position-absolute top-0 bottom-0 start-0 end-0  bg-white opacity-75 d-flex  align-content-center">
            <h5 class="card-title meal-title text-center text-dark position-relative top-50  start-0 fs-4">${meal.strMeal}</h5>
          </div>
        </div>
      </div>
    `;
  });
  box += `</div>`;
  document.getElementById("main").innerHTML = box;
  hideLoader()
}

//ingradient
async function getIngredients() {
showLoader()
  let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  let data = await res.json();
  displayIngredients(data.meals);
  // console.log(data.meals);
  hideLoader()
}

function displayIngredients(ingredients) {
  let box = `<div class="row g-3 d-flex justify-content-center">`;

  
  ingredients.slice(0, 20).forEach(ing => {
    box += `
      <div class="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
        <div class="card ingredient-card cursor-pointer text-center  bg-transparent text-white d-flex justify-content-center align-content-center text-dark "onclick="getMealsByIngredient('${ing.strIngredient}')">
  <div>
        <div>
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        </div>
          <h3 class="card-title">${ing.strIngredient}</h3>
          <p >
  ${truncateWords(ing.strDescription, 20)}
</p>

  </div>
        </div>
      </div>
    `;
  });

  box += `</div>`;
  document.getElementById("main").innerHTML = box;
}


async function getMealsByIngredient(ingredientName) {
  showLoader()
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
  let data = await res.json();
  displayMealsByCategory(data.meals, ingredientName);
  hideLoader()
}

// INIT
function initPage() {
  const path = window.location.pathname;
  if (path.includes("index.html") || path === "/") {
    getMeals();
  } else if (path.includes("pages/Categories.html")) {
    getCategories();
  } else if (path.includes("pages/Area.html")) {
    getAreas();
  } else if (path.includes("pages/Ingredients.html")) {
    getIngredients();
  }
}

initPage();







// show loader
function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  loader.style.opacity = "1";
}

// hide loader مع fade-out
function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0"; // يبدأ الـ fade
  setTimeout(() => {
    loader.style.display = "none"; // بعد الانتهاء يخفيه
  }, 500); // نفس مدة transition
}





// search
const searchByName = document.getElementById("searchInput1");
const searchByLetter = document.getElementById("searchInput2");
const mainContainer = document.getElementById("main");

function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  loader.style.opacity = "1";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
}


function displayMeals(meals) {
  if (!meals) {
    mainContainer.innerHTML = `<p class="text-center text-white fs-3">No meals found 😔</p>`;
    return;
  }

  let box = `<div class="row g-4">`;
  meals.forEach(meal => {
    box += `
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="meal-card cursor-pointer card category-card bg-transparent position-relative d-flex overflow-hidden" onclick="getMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body text-center position-absolute top-0 bottom-0 start-0 end-0 bg-white opacity-75 d-flex align-content-center">
            <h5 class="card-title meal-title text-dark position-relative top-50 start-0 fs-4">${meal.strMeal}</h5>
          </div>
        </div>
      </div>
    `;
  });
  box += `</div>`;
  mainContainer.innerHTML = box;
}


searchByName.addEventListener("input", async function() {
  let query = searchByName.value.trim();
  if (query.length === 0) {
    mainContainer.innerHTML = "";
    return;
  }

  showLoader();
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  let data = await res.json();
  displayMeals(data.meals);
  hideLoader();
});


searchByLetter.addEventListener("input", async function() {
  let query = searchByLetter.value.trim();
  if (query.length === 0) {
    mainContainer.innerHTML = "";
    return;
  }

 
  query = query[0];

  showLoader();
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`);
  let data = await res.json();
  displayMeals(data.meals);
  hideLoader();
});











