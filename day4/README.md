# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Film Project, Part 4

## Your Mission

Let's go back to the film application you've started. You can run the app with `npm start`. Remember to stop any project you currently have running first.

The end is in sight! Here's what to do next:

- Display the details of each movie by pulling this information from TMDb.
- Refactor your React app to make it as clean as possible.

![](assets/bladerunner.png)

### Task 1: Adding the API Call

In React, API calls are handled using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) provided by modern browsers.

You already have a function in which you want the API call to go — `handleDetailsClick()` — so your `fetch()` task will work inside of that function. When a user clicks to see the details of a movie, you'll call the API to get those details.

#### Step 1: Set up the API key.

This step may seem challenging, but it's actually not. Here's a walk-through:

Because TMDb isn't a public API, you'll need to get an API key to add to your `fetch()` call. Make sure to keep the key in a safe spot.

- To gain access to the TMDb API, you'll need to get an API key from [TMDb](https://www.themoviedb.org).
  - TMDb only gives API keys to users with accounts, so you'll have to sign up first (it's free). However, it will ask for your phone number and address.
  - Then, request an API key on your profile page (further instructions [here](https://developers.themoviedb.org/3/getting-started)).
  - Once you have your API key, include it in your app. Because you **never want to store app secrets in your repository**, you'll use the [`dotenv`](https://github.com/motdotla/dotenv) package to keep the API key in a local file.

* You'll need to install `dotenv`.
  - Run `npm install --save dotenv` from the command line to add the dependency to your `package.json` file.
  - Create a new file at the root of your project called `.env.local` (accept the system warning).
  - In your `.env.local` file, add the line `REACT_APP_TMDB_API_KEY=<Your TMDB API v3 KEY>`.

**Note**: The `.env.local` file is located in your `.gitignore` by default when you create an app with `create-react-app`, so your secret will never leak into your repository. Because this is a front-end application, its JavaScript will contain the key, which means end users will be able to see it. However, that's fine for this practice app because you'll only be running it locally.

- You've now saved an API key in `dotenv`. Point your application to it by adding the following code to the top of your `TMDB.js` file:

```js
import dotenv from 'dotenv';

dotenv.config();
```

- Then replace `'<REPLACE_THIS_WITH_TMDB_API_KEY>'` with `process.env.REACT_APP_TMDB_API_KEY`.

Your secrets are now set up.

#### Step 2: Create a `const` called `url` with the API's URL.

Now that you have the API key to call for movie details, let's begin making that call.

In your `App.js` `handleDetailsClick()` method, add the following `const` right above your `setState()`:

```JavaScript
const url = `https://api.themoviedb.org/3/movie/${film.id}?api_key=${TMDB.api_key}&append_to_response=videos,images&language=en`;
```

This is the URL to which you'll send your request to get detailed information about each film. You're passing the `film.id` and the `TMDB.api_key` as query string parameters.

**Note**: Using `${film.id}` is a slightly faster shorthand for embedding variables in strings.

- For example, `const myString = "The " + film.id + " is great"` is the same as writing `const myString = "The ${film.id} is great"`.

#### Step 3: Make the API call.

Now that you have the API key and URL set up, fetch the API underneath the new URL variable.

```JavaScript
const url = `https://api.themoviedb.org/3/movie/${film.id}?api_key=${TMDB.api_key}&append_to_response=videos,images&language=en`

fetch(url)
  .then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data); // Take a look at what you get back.
  });
```

Try clicking a movie row in your browser — the data should appear in the console.

#### Step 4: Set the state when the API call completes.

Set your `current` state to the object you get back from TMDb. Move the `setState()` call into the API call.

```JavaScript
  .then(data => {
    console.log(data);
    this.setState({current: data});
  });
```

Now you have the API call to get information about your chosen movie.

### Task 2: Refactoring Our App

Before you continue displaying movie details to the user, let's clean up your application.

Let's refactor any components that only have a `render()` method into functional components, if you haven't already done so. Functional components are simpler and render faster than class components - you can see this by inspecting the generated code after building it. It's considered a best practice to use them whenever possible.

#### Step 1: Refactor `FilmPoster.js`.

1. Replace the `class` definition with a function. Remember that your function should accept a `props` argument.
2. Remove the `render()` method, keeping only the `return()` function.
3. Replace all instances of `this.props` with `props`.
4. Remove `{Component}` from the React `import` at the top, as you will no longer use it (however, still import `React`).

Check your app in your browser to make sure its functionality hasn't changed.

#### Step 2: Refactor `FilmRow`.

Follow the same steps to refactor the `FilmRow` component.

Check your app in your browser to make sure its functionality hasn't changed.

#### Step 3: Refactor `FilmDetails`.

You haven't written out the `FilmDetails` component yet, but it currently only renders UI. Therefore, you can also make it a functional component.

Follow the same steps as above, and again, check in your browser for functionality.

### Task 3: Adding Film Details

You're almost finished! Next, you'll render the film details you're receiving from the API (and currently logging to the console) in the browser window.

#### Step 1: Add image URLs for `FilmDetails`.

Above the `return()`, add the following `const` definitions for fetching backdrop and posters:

```js
const backdropUrl = `https://image.tmdb.org/t/p/w1280/${props.film.backdrop_path}`;
const posterUrl = `https://image.tmdb.org/t/p/w780/${props.film.poster_path}`;
```

#### Step 2: Render the empty case for `FilmDetails`.

When the app loads, there's no film selected to display in `FilmDetails`. When a user clicks on a film in `FilmListing`, you want to fetch and show its details. Thus, there are two scenarios for `FilmDetails`:

- The empty scenario (no film is selected).
- The populated scenario (a film is selected).

Start with the empty case. Add the following markup below the `.section-title`:

```html
<div className="film-detail">
  <p>
    <i className="material-icons">subscriptions</i>
    <span>No film selected</span>
  </p>
</div>
```

#### Step 3: Conditionally render the current film.

To start, create a new variable to hold on to your DOM tree. You'll conditionally assign the value to this variable depending on whether or not there's a film object passed in through the props.

Add this below the two declared `const` variables:

```js
let details;
```

Now, you need to determine if there's a film to render.

To do so, you just need to check if there's an `id` property on the `film` prop passed to `FilmDetail`.

- If there isn't, you want to render the empty case you added in the last step.
- If there is, you have a film to show, so you want to present the film details markup (don't copy this over yet):

```html
<div className="film-detail is-hydrated">
  <figure className="film-backdrop">
    <img src="{backdropUrl}" alt="" />
    <h1 className="film-title">{props.film.title}</h1>
  </figure>

  <div className="film-meta">
    <h2 className="film-tagline">{props.film.tagline}</h2>
    <p className="film-detail-overview">
      <img src="{posterUrl}" className="film-detail-poster" alt="{props.film.title}" />
      {props.film.overview}
    </p>
  </div>
</div>
```

- Your task here is to conditionally assign the film details block of markup to the `details` variable if there's a current `id`.
  - If there's no current `id`, render the JSX for the empty case instead.
- You still want to keep your `section-title`, which isn't part of this conditional.
  - Therefore, the `return()` statement of your `FilmDetails` function should finally look like this:

```html
return (
<div className="film-details">
  <h1 className="section-title">Details</h1>
  {detail}
</div>
)
```

**You're done for now!**
