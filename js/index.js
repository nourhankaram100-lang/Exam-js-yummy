// contact us
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
        if (inputs[key]) {
            inputs[key].addEventListener("input", () => validateField(key));
            inputs[key].addEventListener("blur", () => validateField(key));
        }
    });

    if (form) {
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
    }
});

// navbar
var menu = document.querySelector(".menu");
var divNav = document.querySelector("div.nav");

if (menu && divNav) {
    menu.addEventListener("click", function () {
        if (divNav.classList.contains("d-none")) {
            divNav.classList.remove("d-none");
            menu.classList.replace("fa-align-justify", "fa-x");
        } else {
            divNav.classList.add("d-none");
            menu.classList.replace("fa-x", "fa-align-justify");
        }
    });
}

// Helpers
function truncateWords(text, limit) {
    if (!text) return "";
    let words = text.split(" ");   
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ");
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

// Loader
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "flex";
        loader.style.opacity = "1";
    }
}
function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0"; 
        setTimeout(() => { loader.style.display = "none"; }, 500); 
    }
}

// Meals
async function getMeals() {
    showLoader();
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    let data = await res.json();
    displayMeals(data.meals);
    hideLoader();
}
 
function displayMeals(meals) {
    if (!meals) {
        document.getElementById("main").innerHTML =
            `<p class="text-center text-white fs-3">No meals found 😔</p>`;
        return;
    }

    let box = `<div class="row g-4">`;
    meals.forEach(meal => {
        box += `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card meal-card cursor-pointer bg-dark text-white position-relative overflow-hidden" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body text-center position-absolute top-0 bottom-0 start-0 end-0 bg-white opacity-75 d-flex align-items-center justify-content-center">
                    <h5 class="card-title text-black position-absolute start-0 p-1 fs-3">${meal.strMeal}</h5>
                </div>
            </div>
        </div>`;
    });
    box += `</div>`;
    document.getElementById("main").innerHTML = box;

    // بعد ما العناصر اتضافت للـ DOM
    document.querySelectorAll(".meal-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            getMealDetails(id);
        });
    });
}


async function getMealDetails(id) {
    showLoader();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await res.json();
    let meal = data.meals[0];
    let recipes = getIngredientsList(meal);
    displayMealDetails(meal, recipes);
    hideLoader();
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
            <h4>Category: ${meal.strCategory}</h4>
            <h4>Area: ${meal.strArea}</h4>
            <h4 class="mt-3">Recipes:</h4>
            <div class="row g-2">
                ${recipes.map(item => `<div class="col-md-3 p-1 rounded mx-2 color-recipes w-auto">${item}</div>`).join('')}
            </div>
            <div>
                <h4>Tags:</h4>
                <a href="${meal.strSource}" target="_blank" class="btn btn-success mt-2 text-capitalize">source</a>
                <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-2 text-capitalize">youTube</a>
            </div>
        </div>
    </div>`;
}

// Categories
async function getCategories() {
    showLoader();
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let data = await res.json();
    displayCategories(data.categories);
    hideLoader();
}

function displayCategories(categories) {
    let box = `<div class="row g-4">`;
    categories.forEach(cat => {
        box += `
        <div class="col-lg-3 col-md-4 col-sm-6 bg-transparent">
            <div class="card category-card cursor-pointer bg-transparent position-relative d-flex overflow-hidden" onclick="getMealsByCategory('${cat.strCategory}')">
                <img src="${cat.strCategoryThumb}" class="card-img-top" alt="${cat.strCategory}">
                <div class="card-body text-center position-absolute top-0 bottom-0 start-0 end-0 bg-white opacity-75 d-flex flex-column justify-content-center">
                    <h5 class="card-title category-title mb-1">${cat.strCategory}</h5>
                    <p class="m-1">${truncateWords(cat.strCategoryDescription, 20)}</p>
                </div>
            </div>
        </div>`;
    });
    box += `</div>`;
    document.getElementById("main").innerHTML = box;
}

async function getMealsByCategory(category) {
    showLoader();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await res.json();
    displayMeals(data.meals);
    hideLoader();
}

// Areas
async function getAreas() {
    showLoader();
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let data = await res.json();
    displayAreas(data.meals);
    hideLoader();
}

function displayAreas(areas) {
    let box = `<div class="row mx-3">`;
    areas.forEach(area => {
        box += `
        <div class="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
            <div class="card area-card cursor-pointer text-center py-2 bg-transparent d-flex justify-content-center align-content-center text-white fs-1" onclick="getMealsByArea('${area.strArea}')">
                <div>
                    <i class="fa-solid fa-house-laptop fw-bolder"></i>
                    <h5 class="card-title fs-3 text-white">${area.strArea}</h5>
                </div>
            </div>
        </div>`;
    });
    box += `</div>`;
    document.getElementById("main").innerHTML = box;
}

async function getMealsByArea(areaName) {
    showLoader();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    let data = await res.json();
    displayMeals(data.meals);
    hideLoader();
}

// Ingredients
async function getIngredients() {
    showLoader();
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let data = await res.json();
    displayIngredients(data.meals.slice(0, 20));
    hideLoader();
}

function displayIngredients(ingredients) {
    let box = `<div class="row g-3 d-flex justify-content-center">`;
    ingredients.forEach(ing => {
        box += `
        <div class="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
            <div class="card ingredient-card cursor-pointer text-center bg-transparent d-flex justify-content-center align-content-center text-white text-center" onclick="getMealsByIngredient('${ing.strIngredient}')">
                <i class="fa-solid fa-drumstick-bite fa-4x m-auto"></i>
                <h3 class="card-title">${ing.strIngredient}</h3>
                <p>${truncateWords(ing.strDescription, 20)}</p>
            </div>
        </div>`;
    });
    box += `</div>`;
    document.getElementById("main").innerHTML = box;
}

async function getMealsByIngredient(ingredientName) {
    showLoader();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
    let data = await res.json();
    displayMeals(data.meals);
    hideLoader();
}

// Init page
// function initPage() {
//     const path = window.location.pathname;
//     if (path.includes("index.html") || path === "/") getMeals();
//     else if (path.includes("pages/Categories.html")) getCategories();
//     else if (path.includes("pages/Area.html")) getAreas();
//     else if (path.includes("pages/Ingredients.html")) getIngredients();
// }

// function initPage() {
//     const path = window.location.pathname;

//     if (path.includes("Exam-js-yummy") && (path.includes("index.html") || path === "/")) getMeals();
//     else if (path.includes("Exam-js-yummy") && path.includes("Categories.html")) getCategories();
//     else if (path.includes("Exam-js-yummy") && path.includes("Area.html")) getAreas();
//     else if (path.includes("Exam-js-yummy") && path.includes("Ingredients.html")) getIngredients();
// }

// initPage();


function initPage() {
    const path = window.location.pathname;

    if ((path.includes("Exam-js-yummy") || (path.includes("index.html") || path === "/")) || path.includes("index.html") || path === "/") {
        getMeals();
    } else if ((path.includes("Exam-js-yummy") || path.includes("Categories.html")) || path.includes("Categories.html")) {
        getCategories();
    } else if ((path.includes("Exam-js-yummy") || path.includes("Area.html")) || path.includes("Area.html")) {
        getAreas();
    } else if ((path.includes("Exam-js-yummy") || path.includes("Ingredients.html")) || path.includes("Ingredients.html")) {
        getIngredients();
    }
}
initPage();

// function initPage() {
//     const path = window.location.pathname.toLowerCase();
//     if (path.includes("exam-js-yummy") && (path.includes("index") || path.endsWith("/"))) {
//         getMeals();
//     } 
//     else if (path.includes("exam-js-yummy") && path.includes("categories")) {
//         getCategories();
//     } 
//     else if (path.includes("exam-js-yummy") && path.includes("area")) {
//         getAreas();
//     } 
//     else if (path.includes("exam-js-yummy") && path.includes("ingredients")) {
//         getIngredients();
//     } 

//     else {
//         getMeals();
//     }
// }

// // شغّل الدالة
// initPage();


// function initPage() {
//     const path = window.location.pathname.toLowerCase();

//     if (path.includes("categories")) {
//         getCategories();
//     } 
//     else if (path.includes("area")) {
//         getAreas();
//     } 
//     else if (path.includes("ingredients")) {
//         getIngredients();
//     } 
//     else {
//         getMeals();   // دي صفحة index
//     }
// }

// initPage();



// function initPage() {
//     const path = window.location.pathname.toLowerCase();

//     // صفحات الاندكس + كونتاكت + سيرش
//     if (
//         path.includes("index") ||
//         path.includes("contact") ||
//         path.includes("search") ||
//         path.endsWith("/") // لما يكون في الـ root
//     ) {
//         getMeals();
//     }
//     else if (path.includes("categories")) {
//         getCategories();
//     }
//     else if (path.includes("area")) {
//         getAreas();
//     }
//     else if (path.includes("ingredients")) {
//         getIngredients();
//     }
// }
// initPage();



// Search
const searchByName = document.getElementById("searchInput1");
const searchByLetter = document.getElementById("searchInput2");
const mainContainer = document.getElementById("main");

if (searchByName) {
    searchByName.addEventListener("input", async function () {
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
}

if (searchByLetter) {
    searchByLetter.addEventListener("input", async function () {
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
}
// nourhan