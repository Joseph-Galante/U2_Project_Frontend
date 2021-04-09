# U2_Project_Frontend
GA Solo Project 2 - Minecraft Recipe API

## Overview
Minecraft recipes are often hard to remember and even harder to figure out on your own. This API provides a way to search all available recipes based on what ingredients you have. Input whatever ingredients you are curious about and see what recipes can be made from them!

## Wireframes
ERD

![wireframe](https://i.imgur.com/sCuVSRA.png)
- Shows the dual many-to-many relationship

Home Screen

![wireframe](https://i.imgur.com/UngJ4LR.png)
- Allows user to search for recipes with ingredients

Recipe Book

![wireframe](https://i.imgur.com/YdBQp37.png?1)
- Shows a user's saved recipes

## User Stories
1. When I load the page for the first time, I see the homescreen with links to 'Home', 'Signup', and 'Login' as well as a form with a search bar to input ingredients and quantities and a 'Get Recipes!' button
2. When I click the 'Signup' link, an input form appears where I can input my name, email, and password
3. When I click the 'Login' link, an input form where I can input my email and password appears
4. Upon signing up or logging in I am redirected back to the homescreen but instead of seeing 'Signup' and 'Login', there are 'Recipe Book' and 'Logout' links
5. Upon filling out the form on the homescreen and clicking 'Get Recipes!', the ingredients I provided are displayed along with recipes that can be made from those ingredients and a 'Save Recipe' button
6. When I click the 'Save Recipe' button, I am redirected to my recipe book and all of the recipes I've saved are displayed along with a 'Delete' button for each
7. When I click the 'Delete' button for a certain recipe, that recipe is removed from my recipe book
8. When I click the 'Logout' link I am redirected to the homescreen as if visiting the website for the first time
## MVP Goals
- Able to signup as a new user
- Able to login with user authentication
- Able to update user info
- Able to logout while logged in
- Able to search for food recipes with given ingredients
- Able to save recipes to a personal recipe book
- Able to update recipe names
- Able to remove recipes from recipe book
## Routes
    - Signup - POST /users
    - Login - POST /users/login
    - Update User Info - PUT /users/profile
    - Search - GET /users/ingredients
    - Save Recipe - POST /users/recipes
    - Update Recipe - PUT /users/recipes/:id
    - Delete Recipe - DELETE /users/recipes
## Stretch Goals
- Make divs for recipes similar to minecraft crafting table layout
- More recipes than food recipes
- Make it real purty (CSS)
- Autofill