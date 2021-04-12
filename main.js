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
const sec_ProfileInfo = document.querySelector('.profile-info');

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
    showProfile();
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
// remove ingredient
but_RemoveIngredient.addEventListener('click', removeIngredient);

// edit profile
but_EditProfile.addEventListener('click', editProfile);
// save profile changes
but_SaveChanges.addEventListener('click', saveChanges);
// cancel profile changes
but_CancelChanges.addEventListener('click', cancelChanges);


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
        console.log(error.message);
    }
})

// recipe search
document.querySelector('.recipe-form').addEventListener('submit', (event) => 
{
    event.preventDefault();
    // clear recipe info
    clearElement(div_RecipeInfo);
    // get ingredients
    const ingredients = document.querySelectorAll('.ingredient');
    // populate recipe info section
    ingredients.forEach(ingredient =>
    {
        // get ingredient values
        const name = ingredient.children[0].value;
        const quantity = ingredient.children[1].value;
        // check if fields are empty
        if (name !== '' && quantity !== '')
        {
            // create new ingredient section
            const newIngredient = document.createElement('section');
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
        }
    })
    // display recipe info
    checkRecipes(ingredients);
    displayDiv(div_RecipeInfo);
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
// check for possible recipes with given ingredients
async function checkRecipes (ingredients)
{
    // see if an ingredient can be used for a recipe and if so check for the other required ingredients. if everything checks out, add recipe to array to be returned

    // final recipe array
    let validRecipes = [];
    // condensed recipe ingredients array
    let requiredIngredients = [{ recipes }];
    // condensed ingredients array
    let givenIngredients = [];
    try {
        // condense ingredient objects
        ingredients.forEach(ingredient =>
        {
            // grab ingredient values
            const name = ingredient.children[0].value.toLowerCase();
            const quantity = ingredient.children[1].value;
            // check if either value is empty
            if (name !== '' && quantity !== '')
            {
                // new ingredient obj
                const denseIngredient = {
                    name: name,
                    quantity: quantity
                }
                // add to array
                givenIngredients.push(denseIngredient);
            }
        })
        console.log(givenIngredients);
        // get all recipes
        const res = await axios.get('http://localhost:3001/recipes');
        const recipes = res.data.recipes;
        // condense recipe ingredients
        recipes.forEach(recipe =>
        {
            // loop through ingredients
            for (let i = 1; i <= 9; i++)
            {
                // get ingredient name
                const name = eval(`recipe.ing${i}`);
                // check if name is empty
                if (name !== '')
                {
                    // check if array is empty
                    if (requiredIngredients.recipes.length === 0)
                    {
                        requiredIngredients.recipes.push({ ingredient: name, quantity: 1 })
                    }
                    // array not empty
                    else
                    {
                        // loop through recipes to check for ingredients
                        requiredIngredients.recipes.forEach(recipe =>
                        {
                            // ingredient already exists
                            if (name === recipe.ingredient)
                            {
                                recipe.quantity++;
                            }
                            // does not exist
                            else
                            {
                                // requiredIngredients.push({ ingredient: name, quantity: 1 })
                            }
                        })
                    }
                }
            }
        })
        console.log(requiredIngredients);
        // console.log(recipes);
        // // check if ingredients match recipes
        // recipes.forEach(recipe =>
        // {
        //     // array to store recipe matching ingredients
        //     let recipeIngredients = [];
        //     // loop through each ingredient listed in recipe
        //     for (let i = 1; i <= 9; i++)
        //     {
        //         // loop through each given ingredient and see if it matches the recipes ingredient
        //         givenIngredients.forEach(ingredient =>
        //         {
        //             const ingredientName = ingredient.name;
        //             if (ingredientName === eval(`recipe.ing${i}`))
        //             {
        //                 // check if this is first ingredient
        //                 if (recipeIngredients.length === 0)
        //                 {
        //                     recipeIngredients.push({ name: ingredientName, quantity: 1 });
        //                 }
        //                 // array already has ingredients
        //                 else
        //                 {
        //                     // check if array already contains ingredient
        //                     recipeIngredients.forEach(ingredient =>
        //                     {
        //                         // ingredient already exists
        //                         if (ingredientName === ingredient.name)
        //                         {
        //                             ingredient.quantity++;
        //                         }
        //                         // ingredient does not exist
        //                         else
        //                         {
        //                             recipeIngredients.push({ name: ingredientName, quantity: 1 });
        //                         }
        //                     })
        //                 }
        //             }
        //         })
        //     }
        //     console.log(recipeIngredients)
        //     givenIngredients.forEach(givenIngredient =>
        //     {
        //         recipeIngredients.forEach(ingredient =>
        //         {
        //             // check if given ingredients match required
        //             if (givenIngredient.name === ingredient.name)
        //             {
        //                 // check if quantity is high enough
        //                 if (givenIngredient.quantity >= ingredient.quantity)
        //                 {
        //                     // add recipe as valid recipe if not already present
        //                     if (!validRecipes.includes(recipe))
        //                     {
        //                         validRecipes.push(recipe);
        //                     }
        //                 }
        //             }
        //         })
        //     })
        // })
        // console.log(validRecipes);
    } catch (error) {
        alert('there was a problem with getting the recipes');
    }
}


// show profile info
async function showProfile ()
{
    // show profile div
    displayDiv(div_Profile);
    // show profile info and edit button
    sec_ProfileInfo.classList.remove('hidden');
    but_EditProfile.classList.remove('hidden');

    // grab user
    const res = await axios.get('http://localhost:3001/users/profile', {
        headers: {
            Authorization: localStorage.getItem('userId')
        }
    })
    const user = res.data.user;
    // show user info
    document.querySelector('#profile-name').innerHTML = user.name;
    document.querySelector('#profile-email').innerHTML = user.email;
    // document.querySelector('#profile-password').innerHTML = user.password;
    // fill edit fields
    document.querySelector('#update-name').value = user.name;
    document.querySelector('#update-email').value = user.email;
}
// update user profile
function editProfile ()
{
    // hide edit button and profile info
    but_EditProfile.classList.add('hidden');
    sec_ProfileInfo.classList.add('hidden');
    // show update form and fill fields
    form_UpdateProfile.classList.remove('hidden');
}
// save profile changes
async function saveChanges ()
{
    // get changes for user
    const name = document.querySelector('#update-name').value;
    const email = document.querySelector('#update-email').value;
    // const password = document.querySelector('#update-password').value;
    try {
        // check if any fields are empty
        if (name === '' || email === '')// || password === '')
        {
            alert('all fields are required');
        }
        // no empty fields
        else
        {
            // update user
            await axios.put('http://localhost:3001/users/profile', {
                name: name,
                email: email
                // password: password
            }, {
                headers: {
                    Authorization: localStorage.getItem('userId')
                }
            })
            // display new profile info
            showProfile();
        }
    } catch (error) {
        alert('profile could not be updated');
    }
}
// cancel profile changes
function cancelChanges ()
{
    // display profile info and edit button
    showProfile();
}


// clear DOM element of all but one child
function clearElement (element)
{
    while (element.childElementCount > 1)
    {
        element.removeChild(element.lastElementChild);
    }
}