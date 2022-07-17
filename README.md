# Weather_App
The weather app with a nice layout

Description.
The weather app with a nice and responsive layout. With it you can check the weather and sunrise/sunset time in a specified town.

Idea.
This is one of my first pet projects. The idea was to create a weather app using API from OpenWeather.co.uk.
In addition, I wanted to implement different backgrounds depending on the time of day and the type of weather. 
Plus, I wanted to make it using preprocessor SASS (SCSS) and EJS templates. For parsing data, I used the npm package body-parser.

Implementation.
The most challenging part was figuring out how to implement different backgrounds using a specific parameter coming through the API. Also, I learned how to put the backgrounds on the page. 
That's how I did it:
I used undraw.com to find individual parts and elements for my backgrounds and then customised and constructed them on Figma.
Then I put them all together and implemented in the code.
The set of SVG that will be shown on the screen is selected depending on the icon coming through API and the screen size (responsive layout).
Also, I use the function timeConverter to transform the UTC format for sunrise/sunset into a human-readable form.

Known issues.
An API request uses the name of the city but not its code. In the future, I would like to add the ability to search for cities by the unique code of the town and also add auto-filling into the input.

Currently, the application doesn't consider regions with DST (daylight saving time)  properly. The work on this issue is in progress.


Expected updates.
I would like to add some animation to SVGs, so check for new releases :)
