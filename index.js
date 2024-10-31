import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
// Where to inser the carousel item
const carousel = document.getElementById('carouselInner');

const firstOption = document.createElement('option'); 

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_8sXL4C3sTIacOY7cyCfdoHBCV4TSHK4RzHzFwHhXSU3hqDC0ubqeOdoN0OLV1SFe";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
const initialLoad = async () => {
  try {
   const data = await axios.get(`https://api.thecatapi.com/v1/breeds`); 
  
     return data; 
  } catch (err) {
    console.log(err); 
  }
}

initialLoad().then((res) => {

  let response = res.data; 


  firstOption.innerHTML = "Select a Breed"; 
  breedSelect.appendChild(firstOption)

  response.forEach((item) => {
    
    const option = document.createElement('option'); 
    option.innerHTML = item.name; 
  
    option.setAttribute('value', item.id); 
    breedSelect.appendChild(option); 
  })
}); 

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

  breedSelect.addEventListener('click', handleSelected); 

  function handleSelected(e) {
    e.preventDefault(); 
    
  
      // console.log(e.target.value); 

      const getSelected = async () => {

        let id = e.target.value; 

    
        try {
          const selected = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${id}&api_key=${API_KEY}`); 

        return selected; 
        
      } catch(err) {
        console.log(err); 
      }
  
      }

      
      if (e.target.value !== 'Select a Breed') {

          getSelected().then((res) => {
            carousel.innerHTML = "";  
         

            let breeds = (res.data); 

            breeds.forEach((breed) => {
        
  
              let carouselItem = document.createElement('div'); 

              carouselItem.classList.add('carousel-item'); 
  
              let url = breed.url; 
  
              let template = document.getElementById('carouselItemTemplate'); 
  
  
              let cardItem = document.createElement('div'); 
              cardItem.classList.add('card'); 
  
              let cardImgWrapper = document.createElement('div'); 
              cardImgWrapper.classList.add('img-wrapper'); 
  
              let imageItem = document.createElement('img'); 
              imageItem.setAttribute('src', url); 
              imageItem.style.display = 'flex'; 
              imageItem.style.width = '100%'; 
              imageItem.setAttribute('alt', 'image of a cat'); 
  
              cardImgWrapper.appendChild(imageItem); 
  
              let btn = document.createElement('div'); 
              btn.setAttribute('data-img-id', breed.id); 
              btn.classList.add('favourite-button'); 
  
              let svg = document.createElement('svg'); 
              svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); 
              svg.setAttribute('viewBox', '0 0 512 512'); 
              svg.setAttribute('fill', 'currentColor'); 
  
              btn.appendChild(svg); 
  
              let path = document.createElement('path');
              path.setAttribute('d', 'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z')
  
              btn.appendChild(path); 
              cardImgWrapper.appendChild(btn); 
              cardItem.appendChild(cardImgWrapper); 
              carouselItem.appendChild(cardItem); 
              carouselItem.classList.add('active');
              carousel.appendChild(carouselItem); 

              // console.log(template); 
  
              // console.log(breed)

            })
   
          })
      } 
     
      firstOption.innerHTML = "Select a Breed";  
      carousel.innerHTML = ""; 

      let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

next.addEventListener("click", function () {
  let items = document.querySelectorAll(".item");
  document.querySelector(".slide").appendChild(items[0]);
  console.log(items);
});

prev.addEventListener("click", function () {
  let items = document.querySelectorAll(".item");
  document.querySelector(".slide").prepend(items[items.length - 1]);
  console.log(items);
});
 }

 

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
