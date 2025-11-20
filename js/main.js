const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
const sideNavMenu = $(".side-nav-menu");
const navTab = $(".nav-tab");

$(document).ready(() => {
    searchByName("");
});

function closeNav() {
    let tabWidth = navTab.outerWidth();
    sideNavMenu.animate({ left: `-${tabWidth}px` }, 500);
    $("#toggleBtn").removeClass("fa-xmark").addClass("fa-bars");
    $(".nav-links li").animate({top: 300}, 500);
}

function openNav() {
    sideNavMenu.animate({ left: "0px" }, 500);
    $("#toggleBtn").removeClass("fa-bars").addClass("fa-xmark");
    $(".nav-links li").animate({top: 0}, 500);
}

$("#toggleBtn").click(() => {
    sideNavMenu.css("left") === "0px" ? closeNav() : openNav();
});

async function fetchData(url, callback) {
    $(".loading-screen").fadeIn(300);
    closeNav();
    try {
        const response = await fetch(url);
        const data = await response.json();
        callback(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    $(".loading-screen").fadeOut(300);
}

function displayMeals(arr) {
    const cartoona = arr.map(meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center justify-content-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

function displayCategories(arr) {
    const cartoona = arr.map(category => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2 d-flex flex-column justify-content-center align-items-center">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

function displayArea(arr) {
    const cartoona = arr.map(area => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

function displayIngredients(arr) {
    const cartoona = arr.map(ingredient => `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription ? ingredient.strDescription.split(" ").slice(0, 20).join(" ") : ""}</p>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

function displayMealDetails(meal) {
    searchContainer.style.display = "none";
    
    let recipes = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            recipes += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }

    let tags = meal.strTags?.split(",").map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("") || "";

    const cartoona = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${recipes}
        </ul>
        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tags}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;
    
    rowData.innerHTML = cartoona;
}

function showSearch() {
    searchContainer.style.display = "flex";
    rowData.innerHTML = "";
    closeNav();
}

function showContact() {
    searchContainer.style.display = "none";
    rowData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100">Special characters and numbers not allowed</div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100">Email not valid *example@yyy.zzz</div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100">Enter valid Phone Number</div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100">Enter valid age</div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100">Enter valid password (Min 8 chars, 1 letter, 1 number)</div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100">Passwords not match</div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-4 mt-3">Submit</button>
        </div>
    </div>`;
    closeNav();
}

function searchByName(term) {
    fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`, (data) => {
        displayMeals(data.meals || []);
    });
}

function searchByFLetter(term) {
    term = term || "a";
    fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`, (data) => {
        displayMeals(data.meals || []);
    });
}

function getCategories() {
    searchContainer.style.display = "none";
    fetchData(`https://www.themealdb.com/api/json/v1/1/categories.php`, (data) => {
        displayCategories(data.categories);
    });
}

function getArea() {
    searchContainer.style.display = "none";
    fetchData(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`, (data) => {
        displayArea(data.meals);
    });
}

function getIngredients() {
    searchContainer.style.display = "none";
    fetchData(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`, (data) => {
        displayIngredients(data.meals.slice(0, 20));
    });
}

function getCategoryMeals(category) {
    fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`, (data) => {
        displayMeals(data.meals.slice(0, 20));
    });
}

function getAreaMeals(area) {
    fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`, (data) => {
        displayMeals(data.meals.slice(0, 20));
    });
}

function getIngredientsMeals(ingredients) {
    fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`, (data) => {
        displayMeals(data.meals.slice(0, 20));
    });
}

function getMealDetails(mealID) {
    searchContainer.style.display = "none";
    fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`, (data) => {
        displayMealDetails(data.meals[0]);
    });
}

function inputsValidation() {
    const rules = {
        nameInput: /^[a-zA-Z ]+$/,
        emailInput: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        phoneInput: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        ageInput: /^[1-9][0-9]?$|^100$/,
        passwordInput: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    };

    let valid = true;

    for (const [id, regex] of Object.entries(rules)) {
        const input = document.getElementById(id);
        const alert = document.getElementById(id.replace("Input", "Alert"));
        
        if (regex.test(input.value)) {
            alert.style.display = "none";
        } else {
            alert.style.display = "block";
            valid = false;
        }
    }

    const pass = document.getElementById("passwordInput").value;
    const rePass = document.getElementById("repasswordInput");
    const reAlert = document.getElementById("repasswordAlert");
    
    if (rePass.value === pass && rePass.value !== "") {
        reAlert.style.display = "none";
    } else {
        reAlert.style.display = "block";
        valid = false;
    }

    document.getElementById("submitBtn").disabled = !valid;
}