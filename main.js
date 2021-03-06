//=============== VARIABLES ===============//
// final recipe array
let validRecipes = [];
// autocomplete ingredients array
const VALID_INGREDIENTS = ['wooden plank', 'bowl', 'red mushroom', 'brown mushroom', 'wheat', 'apple', 'gold nugget', 'sugar cane', 'milk bucket', 'sugar', 'egg', 'cocoa beans', 'melon slice', 'pumpkin', 'carrot', 'cooked rabbit', 'baked potato', 'flower', 'glass bottle', 'honey block', 'gold ingot'].sort();


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
const div_RecipeGrid = document.querySelector('.recipe-grid');

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
const but_PrevRecipe = document.querySelector('#prev-recipe');
const but_NextRecipe = document.querySelector('#next-recipe');
const but_SaveRecipe = document.querySelector('#save-recipe');
const but_DeleteRecipe = document.querySelector('#delete-recipe');

// misc
const messages = document.querySelector('#messages');


//=============== EVENT LISTENERS ===============//

// home page
nav_HomeLink.addEventListener('click', () => {
    // show home screen
    displayDiv(div_Home);
    // clear recipe id from local storage
    localStorage.removeItem('recipe');
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
    showRecipeBook();
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

// previous recipe
but_PrevRecipe.addEventListener('click', () =>
{
    showRecipes(validRecipes, false, true, false);
})
// next recipe
but_NextRecipe.addEventListener('click', () =>
{
    showRecipes(validRecipes, false, false, true);
})
// save recipe
but_SaveRecipe.addEventListener('click', saveRecipe);
// delete recipe
but_DeleteRecipe.addEventListener('click', deleteRecipe);


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
    const res = await axios.post('https://minecraft-recipe-app.herokuapp.com/users', {
        name: name,
        email: email,
        password: password
    })
    console.log(res.data)
    // grab user id
    const userId = res.data.userId;
    // add to local storage - login user
    localStorage.setItem('userId', userId);

    // display proper nav links
    checkForUser();
    // display home screen
    displayDiv(div_Home);

    } catch (error) {
        alert('email is already taken');
        console.log(error.message)
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
    const res = await axios.post('https://minecraft-recipe-app.herokuapp.com/users/login', {
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
    validRecipes = [];
    // get ingredients
    const ingredients = document.querySelectorAll('.ingredient');
    // populate recipe info section
    ingredients.forEach(ingredient =>
    {
        // get ingredient values
        const name = ingredient.children[0].children[0].value;
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
    // display recipe book, profile, logout links
    nav_RecipeLink.classList.remove('hidden');
    nav_ProfileLink.classList.remove('hidden');
    nav_LogoutLink.classList.remove('hidden');
    // show active save recipe button
    but_SaveRecipe.classList.remove('hidden');
    but_SaveRecipe.style.backgroundColor = 'olivedrab';
  }
  // no user logged in
  else
  {
    // hide recipe book, profile, logout links
    nav_RecipeLink.classList.add('hidden');
    nav_ProfileLink.classList.add('hidden');
    nav_LogoutLink.classList.add('hidden');
    // display signup, login links
    nav_SignupLink.classList.remove('hidden');
    nav_LoginLink.classList.remove('hidden');
    // show inactive save recipe button
    but_SaveRecipe.classList.remove('hidden');
    but_SaveRecipe.style.backgroundColor = 'gray';
  }
}
// call on page load - see if user is still logged in
checkForUser();


// update UI based on nav link clicked
function displayDiv (element)
{
    // check if viewing recipes
    if (element.classList.contains('recipe-grid'))
    {
        // show recipes
        div_RecipeGrid.classList.remove('hidden');
        // check if on recipe book page
        if (!div_Recipes.classList.contains('hidden'))
        {
            // hide save recipe button
            but_SaveRecipe.classList.add('hidden');
            // show delete recipe button
            but_DeleteRecipe.classList.remove('hidden');
        }
        // not on recipe book page - home
        else
        {
            // hide delete recipe button
            but_DeleteRecipe.classList.add('hidden');
        }
        return;
    }

    // remove save button if no user
    checkForUser();

    // hide all divs
    document.querySelectorAll('div').forEach(d => d.classList.add('hidden'));
    // hide profile update form
    form_UpdateProfile.classList.add('hidden');
    // hide messages
    messages.classList.add('hidden');

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
    // new autocomplete section
    const newAuto = document.createElement('section');
    newAuto.classList.add('autocomplete');

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
    newAuto.append(newName);
    newIngredient.append(newAuto, newQuantity);
    // add new ingredient to ingredients section
    sec_Ingredients.append(newIngredient);
    // run autocomplete
    autocomplete(document.querySelector(`#${nameId}`), VALID_INGREDIENTS);
}
// remove ingredient DOM element
function removeIngredient ()
{
    // check if there is at least one ingredient
    if (sec_Ingredients.childElementCount > 1)
    {
        // remove last child of ingredients section
        sec_Ingredients.removeChild(sec_Ingredients.lastElementChild);
    }
}
// check for possible recipes with given ingredients
async function checkRecipes (ingredients)
{
    // see if an ingredient can be used for a recipe and if so check for the other required ingredients. if everything checks out, add recipe to array to be returned
    // condensed ingredients array
    let givenIngredients = [];
    try {
        // condense ingredient objects
        ingredients.forEach(ingredient =>
        {
            // grab ingredient values
            const name = ingredient.children[0].children[0].value.toLowerCase();
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
        // get all recipes
        const res = await axios.get('https://minecraft-recipe-app.herokuapp.com/recipes');
        const recipes = res.data.recipes;
        // condense recipe ingredients
        recipes.forEach(recipe =>
        {
            recipe.requiredIngredients = [];
            // loop through ingredients
            for (let i = 1; i <= 9; i++)
            {
                // get ingredient name
                const name = eval(`recipe.ing${i}`);
                // check if name is empty
                if (name !== '')
                {
                    // check if array is empty
                    if (recipe.requiredIngredients.length === 0)
                    {
                        // initialize array
                        recipe.requiredIngredients.push({ ingredient: name, quantity: 1 });
                    }
                    // array not empty
                    else
                    {
                        for (let i = 0; i < recipe.requiredIngredients.length; i++)
                        {
                            // check if ingredient already exists
                            if (name === recipe.requiredIngredients[i].ingredient)
                            {
                                // increment quantity of ingredient required
                                recipe.requiredIngredients[i].quantity++;
                                break;
                            }

                            // at end of ingredients
                            if (i === recipe.requiredIngredients.length - 1)
                            {
                                // add ingredient to array
                                recipe.requiredIngredients.push({ ingredient: name, quantity: 1 });
                                break;
                            }
                        }
                    }
                }
            }
            // check if given ingredients match required ingredients
            let count = 0;
            recipe.requiredIngredients.forEach(requiredIngredient =>
            {
                givenIngredients.forEach(ingredient =>
                {
                    // check if names match
                    if (requiredIngredient.ingredient === ingredient.name)
                    {
                        // check if given quantity is enough for recipe
                        if (ingredient.quantity >=  requiredIngredient.quantity)
                        {
                            count++;
                        }
                        
                        // check if count reached length of required ingredients
                        if (recipe.requiredIngredients.length === count)
                        {
                            // push recipe to output array
                            validRecipes.push(recipe);
                        }
                    }
                    // rabbit stew check
                    if (requiredIngredient.ingredient == 'mushroom')
                    {
                        // check if given ingredient is red or brown mushroom
                        if (ingredient.name === 'red mushroom' || ingredient.name === 'brown mushroom')
                        {
                            // check if given quantity is enough for recipe
                            if (ingredient.quantity >=  requiredIngredient.quantity)
                            {
                                count++;
                            }
                            
                            // check if count reached length of required ingredients
                            if (recipe.requiredIngredients.length === count)
                            {
                                // push recipe to output array
                                validRecipes.push(recipe);
                            }
                        }
                    }
                })
            })
        })
        // display recipe info
        showRecipes(validRecipes, true, false, false);
    } catch (error) {
        alert('there was a problem with getting the recipes');
        console.log(error.message);
    }
}
// display recipes
function showRecipes (recipes, start, prev, next)
{
    // check for empty recipes arr
    if (recipes.length === 0)
    {
        div_RecipeGrid.classList.add('hidden');
        return;
    }
    // display recipe grid div
    displayDiv(div_RecipeGrid);
    // current recipe var
    let currentRecipe;
    let i = localStorage.getItem('recipe');
    // check if starting recipe and there is at least one recipe
    if (start && recipes.length > 0)
    {
        i = 0;
        localStorage.setItem('recipe', i);
        currentRecipe = recipes[i];
        // hide previous recipe button
        but_PrevRecipe.classList.add('hidden');
        // show next recipe button if there are more recipes
        if (i < recipes.length - 1)
        {
            but_NextRecipe.classList.remove('hidden');
        }
        else
        {
            but_NextRecipe.classList.add('hidden');
        }
    }
    // previous recipe
    else if (prev && i > 0)
    {
        i--;
        localStorage.setItem('recipe', i);
        currentRecipe = recipes[i];
        // hide previous recipe button if i is 0
        if (i === 0)
        {
            but_PrevRecipe.classList.add('hidden');
        }
        // show next recipe
        but_NextRecipe.classList.remove('hidden');
    }
    // next recipe
    else if (next && i < recipes.length - 1)
    {
        i++;
        localStorage.setItem('recipe', i);
        currentRecipe = recipes[i];
        // hide next recipe button if at last recipe
        if (i === recipes.length - 1)
        {
            but_NextRecipe.classList.add('hidden');
        }
        // show prev recipe button
        but_PrevRecipe.classList.remove('hidden');
    }

    // set dom elements id to current recipe name
    document.querySelector('.recipe-name').id = currentRecipe.name;
    document.querySelector('.recipe-name').innerHTML = currentRecipe.name;

    // fill dom elements with recipe info one at a time
    for (let i = 1; i < 10; i++)
    {
        let ingredient = eval(`currentRecipe.ing${i}`);
        const slot = `#ingredient-slot-${i}`;
        const sec_Slot = document.querySelector(slot);
        sec_Slot.className = '';
        sec_Slot.classList.add('slot');
        // clear all children of slot
        sec_Slot.innerHTML = '';
        if (ingredient !== '')
        {
            // create dom elements for tooltip
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.innerHTML = ingredient;
            // add tooltip to slot
            sec_Slot.append(tooltip);
            ingredient = ingredient.replace(/\s/g, '_');
            sec_Slot.classList.add(ingredient);
        }
    }
}
// save recipe
async function saveRecipe ()
{
    // return if no user logged in
    if (!localStorage.getItem('userId'))
    {
        displayMessage(false, 'You can only save a recipe while logged in. Signup or login to start a recipe book.')
        return;
    }
    // get recipe name from dom element
    const recipe = document.querySelector('.recipe-name').id;

    try {
        // save recipe to user
        const res = await axios.post('https://minecraft-recipe-app.herokuapp.com/users/recipes', {
            recipe: recipe
            }, {
            headers: {
                Authorization: localStorage.getItem('userId')
            }
        })
        // check if recipe was already saved
        if (res.data.message === 'recipe already saved')
        {
            // show recipe save fail message
            displayMessage(false, 'Recipe is already in your recipe book. You may not save the same recipe multiple times.');
        }
        // not saved yet
        else
        {
            // show recipe save success message
            displayMessage(true, 'Recipe saved successfully. Go to your recipe book to view all of your saved recipes.');
        }
    } catch (error) {
        alert('recipe could not be saved');
        console.log(error.message);
    }
}
// delete recipe
async function deleteRecipe ()
{
    // get recipe name from dom element
    const recipe = document.querySelector('.recipe-name').id;

    try {
        // delete recipe from recipe book
        const res = await axios.delete('https://minecraft-recipe-app.herokuapp.com/users/recipes', {
            headers: {
                Authorization: localStorage.getItem('userId')
            },
            data: {
                recipe: recipe
            }
        })
        displayMessage(true, 'Recipe deleted successfully.')
        // show recipe book
        showRecipeBook();
    } catch (error) {
        alert('recipe could not be deleted');
        console.log(error.message);
    }
}

// show recipe book recipes
async function showRecipeBook ()
{
    // clear recipe id from local storage
    localStorage.removeItem('recipe');
    // empty recipes
    validRecipes = [];
    try {
        // grab user
        const userRes = await axios.get('https://minecraft-recipe-app.herokuapp.com/users/profile', {
            headers: {
                Authorization: localStorage.getItem('userId')
            }
        });
        const user = userRes.data.user;
        // show user info
        document.querySelector('#user-recipe-book').innerHTML = `${user.name}'s Recipe Book`;

        // grab users saved recipes
        const res = await axios.get('https://minecraft-recipe-app.herokuapp.com/users/recipes', {
            headers: {
                Authorization: localStorage.getItem('userId')
            }
        });
        validRecipes = res.data.recipes;

        showRecipes(validRecipes, true, false, false);
    } catch (error) {
        alert('could not get recipe book');
        console.log(error.message);
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
    const res = await axios.get('https://minecraft-recipe-app.herokuapp.com/users/profile', {
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
    // hide messages
    messages.classList.add('hidden');
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
            await axios.put('https://minecraft-recipe-app.herokuapp.com/users/profile', {
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
            displayMessage(true, 'Profile updated successfully.');
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



// autocomplete
function autocomplete (input, ingredients)
{
    let currentFocus;
    // when user is writing in text field
    input.addEventListener("input", function(e) {
        let i;
        let val = this.value;
        // close any open autocomplete lists
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        // create section for autocomplete info
        const newSection = document.createElement("section");
        newSection.id = 'autocomplete-list';
        newSection.classList.add('autocomplete-items');
        // add section to autocomplete container
        this.parentNode.append(newSection);
        // loop through ingredients
        for (i = 0; i < ingredients.length; i++) {
            // check if input matches any known ingredients
            if (ingredients[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            // create a section for each match
            autoSection = document.createElement("section");
            // bold matching letters
            autoSection.innerHTML = "<strong>" + ingredients[i].substr(0, val.length) + "</strong>";
            autoSection.innerHTML += ingredients[i].substr(val.length);
            // insert input field for current ingredient
            autoSection.innerHTML += "<input type='hidden' value='" + ingredients[i] + "'>";
            // click on ingredient in list
            autoSection.addEventListener("click", function(e) {
                // insert ingredient into text field
                input.value = this.getElementsByTagName("input")[0].value;
                // close all autocomplete lists
                closeAllLists();
            });
            newSection.append(autoSection);
            }
        }
    });
    // scroll through list with keyboard
    input.addEventListener("keydown", function(e) {
        let autoList = document.querySelector('#autocomplete-list');
        if (autoList) autoList = autoList.getElementsByTagName("section");
        if (e.keyCode == 40) {
            // arrow down
            currentFocus++;
            addActive(autoList);
        }
        else if (e.keyCode == 38) {
            // arrow up
            currentFocus--;
            addActive(autoList);
        }
        else if (e.keyCode == 13) {
            // enter key - submit
            e.preventDefault();
            if (currentFocus > -1) {
                // manual submit
                if (autoList) autoList[currentFocus].click();
            }
        }
    });
    function addActive(autoList) {
        // check for list
        if (!autoList) return false;
        // remove active on all lists
        removeActive(autoList);
        if (currentFocus >= autoList.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (autoList.length - 1);
        // make active autocomplete list
        autoList[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(autoList) {
        // remove active from input autocomplete list
        for (let i = 0; i < autoList.length; i++) {
            autoList[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(element) {
        // close all autocomplete lists except input element
        let autoItems = document.querySelectorAll('.autocomplete-items');
        for (let i = 0; i < autoItems.length; i++)
        {
            if (element != autoItems[i] && element != input) {
                autoItems[i].parentNode.removeChild(autoItems[i]);
            }
        }
    }
    // close autocomplete lists if click is outside of list
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
// call autocomplete on page load
autocomplete(document.querySelector('#ingredient-name-1'), VALID_INGREDIENTS);


// display message
function displayMessage (success, message)
{
    if (success)
    {
        messages.classList.remove('fail');
        messages.classList.add('success');
    }
    else
    {
        messages.classList.remove('success');
        messages.classList.add('fail');
    }
    messages.innerHTML = message;
    messages.classList.remove('hidden');
}