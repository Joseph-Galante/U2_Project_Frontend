//=============== DOCUMENT QUERIES ===============//

// nav links
const nav_HomeLink = document.querySelector('#home-link');
const nav_SignupLink = document.querySelector('#signup-link');
const nav_LoginLink = document.querySelector('#login-link');
const nav_RecipeLink = document.querySelector('#recipe-link');
const nav_ProfileLink = document.querySelector('#profile-link');
const nav_LogoutLink = document.querySelector('#logout-link');

// divs
const div_Home = document.querySelector('.homeScreen');
const div_RecipeInfo = document.querySelector('.recipeInfo');
const div_Signup = document.querySelector('.signUpScreen');
const div_Login = document.querySelector('.loginScreen');
const div_Recipes = document.querySelector('.recipeBook');
const div_Profile = document.querySelector('.profile');

//sections
const sec_Ingredients = document.querySelector('.ingredients');

// forms
const form_UpdateProfile = document.querySelector('.update-form');

// buttons
const but_AddIngredient = document.querySelector('#add-ingredient');
const but_RemoveIngredient = document.querySelector('#remove-ingredient');
const but_EditProfile = document.querySelector('#edit-user');
const but_CancelChanges = document.querySelector('#cancel-changes');
const but_SaveChanges = document.querySelector('#save-changes');

//=============== EVENT LISTENERS ===============//

// home page
nav_HomeLink.addEventListener('click', () => {
    // show home screen
    displayDiv(div_Home);
})

// signup form
nav_SignupLink.addEventListener('click', () => {
    // show signup form
    displayDiv(div_Signup);
})

// login form
nav_LoginLink.addEventListener('click', () => {
    // show login form
    displayDiv(div_Login);
})

// recipe book
nav_RecipeLink.addEventListener('click', async () => {
    // show recipe book
    displayDiv(div_Recipes);
})

// profile
nav_ProfileLink.addEventListener('click', async () => {
    // show profile
    displayDiv(div_Profile);
    // fill update form values with current info
})

// logout
nav_LogoutLink.addEventListener('click', () => {
    // return to home screen
    displayDiv(div_Home);
    // remove id from local storage
    localStorage.removeItem('userId');
    // display proper links
    checkForUser();
})

// add ingredient
but_AddIngredient.addEventListener('click', addIngredient);
but_RemoveIngredient.addEventListener('click', removeIngredient);


//=============== FORM SUBMISSIONS ===============//

// sign-up
document.querySelector('.signup-form').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // get name
    const name = document.querySelector('#signup-name').value;
    // get email
    const email = document.querySelector('#signup-email').value;
    // get pw
    const password = document.querySelector('#signup-password').value;

    try {
    // make user
    const res = await axios.post('http://localhost:3001/users', {
        name: name,
        email: email,
        password: password
    })
    // grab user id
    const userId = res.data.user.id;
    // add to local storage - login user
    localStorage.setItem('userId', userId);

    // display proper nav links
    checkForUser();
    // display home screen
    displayDiv(div_Home);

    } catch (error) {
    alert('email is already taken');
    }
})

// login
document.querySelector('.login-form').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // get email
    const email = document.querySelector('#login-email').value;
    // get pw
    const password = document.querySelector('#login-password').value;

    try {
    // login user
    const res = await axios.post('http://localhost:3001/users/login', {
        email: email,
        password: password
    })
    // grab user id
    const userId = res.data.userId;
    // add id to local storage - login user
    localStorage.setItem('userId', userId);

    // display proper nav links
    checkForUser();
    // display home screen
    displayDiv(div_Home);

    } catch (error) {
    alert('login failed');
    }
})

// recipe search
document.querySelector('.recipe-form').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // clear recipe info
    clearElement(div_RecipeInfo);
    // get ingredients
    const ingredients = document.querySelectorAll('.ingredient');
    // populate recipe info section
    ingredients.forEach(ingredient =>
    {
        // create new ingredient section
        const newIngredient = document.createElement('section');
        // get ingredient values
        const name = ingredient.children[0].value;
        const quantity = ingredient.children[1].value;
        // check if ingredient quantity is 1
        if (quantity == 1)
        {
            // one of ingredient
            newIngredient.innerHTML = `${quantity}x ${name}`;
        }
        // quantity other than 1
        else
        {
            // many of ingredient
            newIngredient.innerHTML = `${quantity}x ${name}s`;
        }
        // add new ingredient to recipe info
        div_RecipeInfo.append(newIngredient);
    })
    // display recipe info
    displayDiv(div_RecipeInfo);
    try {

    } catch (error) {
    alert('recipe search failed');
    }
})

// update profile
document.querySelector('.update-form').addEventListener('submit', async (event) => 
{
    event.preventDefault();

    try {

    } catch (error) {
    alert('profile update failed');
    }
})


//=============== FUNCTIONS ===============//

// displays appropriate nav links when user is logged in or out
function checkForUser ()
{
  // check for logged in user on page load
  if (localStorage.getItem('userId'))
  {
    // hide signup, login links
    nav_SignupLink.classList.add('hidden');
    nav_LoginLink.classList.add('hidden');
    // display recipe book, logout link
    nav_RecipeLink.classList.remove('hidden');
    nav_LogoutLink.classList.remove('hidden');
    // display user with saved weather locations
  }
  // no user logged in
  else
  {
    // hide recipe book, logout link
    nav_RecipeLink.classList.add('hidden');
    nav_LogoutLink.classList.add('hidden');
    // display signup, login links
    nav_SignupLink.classList.remove('hidden');
    nav_LoginLink.classList.remove('hidden');
  }
}
// call on page load - see if user is still logged in
checkForUser();


// update UI based on nav link clicked
function displayDiv (element)
{
    // hide all divs
    document.querySelectorAll('div').forEach(d => d.classList.add('hidden'));
    // hide profile update form
    form_UpdateProfile.classList.add('hidden');

    // check if user is searching for recipes
    if (element.classList.contains('recipeInfo'))
    {
        // show home screen
        div_Home.classList.remove('hidden');
        // show recipe info
        element.classList.remove('hidden');
    }
    // not searching
    else
    {
        // show only desired div
        element.classList.remove('hidden');
    }
}
// call on page load - go to home screen
displayDiv(div_Home);


// add ingredient DOM element
function addIngredient ()
{
    // create new ingredient section
    const newIngredient = document.createElement('section');
    newIngredient.classList.add('ingredient');
    // create new input fields for new ingredient
    // new name field
    const newName = document.createElement('input');
    newName.type = "text";
    nameId = `ingredient-name-${sec_Ingredients.childElementCount + 1}`;
    newName.id = nameId;
    newName.placeholder = "Ingredient";
    // new quantity field
    const newQuantity = document.createElement('input');
    newQuantity.type = "number";
    quantityId = `ingredient-quantity-${sec_Ingredients.childElementCount + 1}`;
    newQuantity.id = quantityId;
    newQuantity.placeholder = "Quantity";
    // add input fields to new ingredient
    newIngredient.append(newName, newQuantity);
    // add new ingredient to ingredients section
    sec_Ingredients.append(newIngredient);
}

// remove ingredient DOM element
function removeIngredient ()
{
    // remove last child of ingredients section
    sec_Ingredients.removeChild(sec_Ingredients.lastElementChild);
}

// clear DOM element
function clearElement (element)
{
    while (element.childElementCount > 1)
    {
        element.removeChild(element.lastElementChild);
    }
}