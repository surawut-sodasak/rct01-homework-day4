# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Film Project, Part 3

## Your Mission

Stop any project you currently have running; let's go back to the film application that you started. You can run the app with `npm start`.

You're almost finished! Now you need to:

- Add films to a user's faves.
- Filter the films at which the user is looking.

You'll need to move your state up to the top of the component tree to shared data across components. Remember unidirectional flow: Data moves down the component tree, so you'll want your states as high up as possible.

![](http://bitmakerhq.s3.amazonaws.com/resources/react-film-library-component-hierarchy.png)

### Task 1: Add State to the `App` Component

Your `App` component will be the main place where states are set. These states are then passed as props down to other components.

#### Step 1: Initialize state in `App.js`

In `App.js`, start by creating an initial state object with the following three states:

1. `films`: Initialize this key to hold a reference to `TMDB.films`.
2. `faves`: This key should simply start off as an empty array.
3. `current`: This key should start off as an empty object.

#### Step 2: Pass State Values to `FilmListing` and `FilmDetails` as Props

You can now pass the states as props to child components. Change `App.js` as follows:

- `FilmListing` should receive a `films` prop that now references your state's `films` property and a `faves` prop that references your state's `faves` property.
- `FilmDetails` should receive a `films` prop that references your state's `current` property.

You will not see any change in your app since nothing is being done with these props yet.


### Task 2: Move the `fave` Event Handler Up the Component Tree

When a user favorites a film, that information needs to be shared with other components. The `FilmListing` component needs to know which films are favorites to enable the filter.

This is not possible now, because the toggling of a film is handled by the `Fave` component at the bottom of the component tree. Props and state only flow downward. Also, the `Fave` component does not know which film is being favorited, so this is a bad place to store the state for whether or not a film is a favorite.

Let's fix this:

#### Step 1: Remove the State Setter in the `fave`

Take the `isFave` state out of the `fave` component.


#### Step 2: Replace `setState` in `handleClick` handler

The `Fave` component should not hold state, so the `isFave` state cannot be set directly in the `handleClick` function.

Instead, we will make the parent component pass a handler function called `onFaveToggle` down to this `Fave` component through props.

Change `handleClick()` as follows:

```js
# /src/Fave.js

handleClick = (e) => {
  e.stopPropagation();
  console.log('Handling Fave click!');

  // Add this line. You'll call the function passed through props.
  this.props.onFaveToggle();

  // Delete the `setState` line. You no longer track state here.
  // this.setState({isFave: !this.state.isFave});
}
```

Now, when a user clicks, `onFaveToggle` will be called by the component that passed it in.

#### Step 3: Change `isFave` to a Prop Rather Than a State

The `isFave` state is taken out of `Fave`, but we will pass down a prop called `isFave` instead. In the `Fave` component, replace `this.state.isFave` with `this.props.isFave`. A parent component will send that information down.

This is all you need to change in `fave.js`! It will still check to see if the user has clicked the "Fave" toggle button. The difference is that, once the user clicks, instead of changing the `faves` array directly, the `handleClick` function will call `onFaveToggle` to do it.

You'll define `onFaveToggle` in a higher component.

#### Step 4: Define `handleFaveToggle` on the `App` Component

The `Fave` component needs a prop, but it does not exist yet. Let's change that now by moving the "Fave" toggle functionality up to the `App` component, where the state for `films` and `faves` is stored.

In the `App` component, create a `handleFaveToggle` function. It does not need to do anything now, but it will later update the `faves` array when a film is favorited or unfavorited. The `handleFaveToggle` function should accept a film object as an argument (this will be the film that the user is toggling).

#### Step 5: Bind the Handler to the Component

Add the following to the `App` component:

```js
handleFaveToggle = film => {
  // do stuff here
}
```

#### Step 6: Clone the `faves` State

The `faves` state is going to hold the user's favorite films. When the user clicks the icon to favorite or unfavorite a film, we will either add or remove the given film from the `faves` array.

To do this, call `setState` and give it the updated array. Remember that you can't just update it directly. Otherwise, React won't know to re-render the components to reflect the changes. So, make a copy of the existing `faves` array, update it, and then pass the copy to `setState`.

Remember that we can shallow clone an array by using the ES6 spread operator, e.g. `[...faves]`. This will create a **new** array with all the objects from the `faves` array in it.

(Note: In older codebases, you might see the JavaScript [`Array.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method being used instead.)

#### Step 7: Find the Index of the Passed Film in the `faves` Array

Use the JavaScript [`Array.prototype.indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf) method to store the position of the film in the array in a `const` variable called `filmIndex`.

Now, `filmIndex` will be an index value starting at `0`.

#### Step 8: Set Up a Conditional for Adding or Removing Film From the `faves` Array

If the film is found in the array, `indexOf` returns an index value starting at `0`. If not, `indexOf` returns `-1`.

Because the `handleFaveToggle` function must change the array of the user's film favorites, when the user clicks the button, it must either:
- If the film is in their favorites, they want to remove it from their favorites. Take the film out of the `faves` array.
- If the film is not in their favorites, they want to add it to their favorites. Add the film to the `faves` array.

Write a conditional statement covering the two cases. When adding a film to `faves`, log out `Adding [FILM NAME] to faves...`; when removing a film from `faves`, log out `Removing [FILM NAME] from faves...`.

#### Step 9: Change Whether or Not the Film Is in `faves`

To remove a film that's already in the `faves` array, use the [`Array.prototype.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) method.

To add a new film to the `faves` array, just [`push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) it onto the end of the array.

#### Step 10: Use `setState` to Update the State of `faves`

After updating the `faves` array, call `setState()` so React will re-render the appropriate components. It should look like this (using ES6 object literal shorthand syntax):

```js
this.setState({faves})

// The above is exactly the same as this.setState({faves: faves}).
```

#### Step 11: Pass the `handleFaveToggle` Function to `FilmListing` Through Props

Now that the `handleFaveToggle` method is in the `App` component, pass it all the way down the component tree so that it can be called when the "Fave" button is clicked.

In the `App` component's `render` method, add a new prop to the `FilmListing` component called `onFaveToggle`. Its value should be a reference to the `handleFaveToggle` method.

#### Step 12: Pass the `onFaveToggle` Function to `FilmRow` Through Props

In the `FilmListing` component, render one `FilmRow` component for each film in the `films` prop. Pass the `onFaveToggle` function down to each `FilmRow`. 

However, you need to make sure that it passes the **current film** in each row up to the `handleFaveToggle` method in the `App` component when called.

To make this happen, we can't just pass the function down to `FilmRow` as a prop as it is; We have to wrap it in another function that calls the `onFaveToggle` function passed down from `App` through props (remember, `onFaveToggle` in `FilmListing` is just a reference to `handleFaveToggle` in the `App` component).

In the `FilmListing` component's `render` method, add the `onFaveToggle` variable. Replace your existing `map` function with this:

```js
const allFilms = this.props.films.map((film) => {
  return (
    <FilmRow
    film={film}
    key={film.id}
    onFaveToggle={() => this.props.onFaveToggle(film)}
    />
  )
});
```


#### Step 14: Pass the `onFaveToggle` Function to `fave` Through Props

The `FilmRow` component now receives the `onFaveToggle` function as a prop. But the `FilmRow` component does not need the function. The `Fave` component does. Just pass it along as a prop to `Fave`.

In `FilmRow`'s `render` function, add a prop called `onFaveToggle` to the `Fave` component and pass it the `onFaveToggle` prop that `FilmRow` received.

Great! The `onFaveToggle` function is now being passed from the `App` component where it's defined, down to the `FilmListing` component, down to the `FilmRow` component, down to the `Fave` component.

#### Step 15: Pass `isFave` Down From `FilmListing` Through `FilmRow`

The `Fave` component is also expecting to receive a prop called `isFave`, so you need to pass `isFave` to the `Fave` component from `FilmRow`.

`FilmRow` does not know about the `faves` array, but its parent component `FilmListing` does.

The `isFave` prop should be true or false depending on if the film is in the `faves` array.

When creating each `FilmRow`, pass a prop called `isFave` whose value uses the [`Array.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) method to determine if the film is in the `faves` array.

Now `FilmRow` is getting the `isFave` prop, but it does not need it. It needs to pass it along. In `FilmRow`, pass that prop through to `Fave`.

`Fave` is now getting the true or false Boolean of whether or not a film is a favorite (`isFave`), as well as being passed the "Fave" toggle function (`onFaveToggle`).

`Fave` now has everything it needs!

Look in your browser to see this working: The JavaScript console will log if something is added or removed from the user's favorites.

#### Step 16: Update the `faves` Counter

The `faves` counter now always displays `0`. Let's update the counter in `FilmListing` to show the actual number of faves in the array.

In the `FilmListing` component, the `faves` counter is hard-coded to `0`. Replace that with the length of the `faves` array.

You now have favorites properly stored and available to all components, and you have a counter that accurately reflects that to the user.

Great job! Check it out in your browser.

### Task 3: Move the Details Event Handler Up Component Tree From `FilmRow`

In `FilmRow`, there's still the function to handle when a user clicks a row for more details.

Following the same steps as you did for the `fave` event handler, move the `handleDetailsClick` definition to the `App` component.

For `handleDetailsClick` in the `App` component, just log into the console and set the `current` state to the passed film for now. You'll handle looking up film details later. Make sure you pass the `current` state as a `films` prop to the `FilmDetails` component.

### Task 4: Make the Filter Work on `FilmListing`

The `filter` state is on `FilmListing`, but the UI still needs to be updated. You're not going to move the `filter` state because this filter only affects the `FilmListing`, not any other parts of the app.

Add a conditional in `FilmListing` so that if the `filter` state is set to `faves`, the listing only shows films in the `faves` array. Otherwise, it shows all films.

Try it out; you should be able to add films to your favorites and view only your favorites list by clicking that tab.
