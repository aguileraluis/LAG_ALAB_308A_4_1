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
getFavouritesBtn.addEventListener("click", seeFavorites);
// Where to inser the carousel item
const carousel = document.getElementById("carouselInner");
const firstOption = document.createElement("option");
// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_8sXL4C3sTIacOY7cyCfdoHBCV4TSHK4RzHzFwHhXSU3hqDC0ubqeOdoN0OLV1SFe";
let body = document.getElementById("bodyId");
let favoritesArray = [];

function clearInfo() {
  while (infoDump.firstChild) {
    infoDump.removeChild(infoDump.firstChild);
  }
}

const initialLoad = async () => {
  try {
    axios.interceptors.request.use((config) => {
      console.log("Request sent.");
      config.metadata = { requestTime: new Date() };
      return config;
    });
    const data = await axios.get(`https://api.thecatapi.com/v1/breeds`);
    axios.interceptors.response.use(
      (response) => {
        const responseTime = new Date();
        const totalTime = responseTime - response.config.metadata.requestTime;
        console.log(`It took ${totalTime} milliseconds.`);
        body.style.cursor = "default";
        return response;
      },
      (error) => {
        // Failure: anything outside of status 2XX
        console.log("Unsuccessful response...");
        throw error;
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};
initialLoad().then((res) => {
  let response = res.data;
  firstOption.innerHTML = "Select a Breed";
  breedSelect.appendChild(firstOption);
  response.forEach((item) => {
    const option = document.createElement("option");
    option.innerHTML = item.name;
    option.setAttribute("value", item.id);
    breedSelect.appendChild(option);
  });
});
breedSelect.addEventListener("click", handleSelected);
function handleSelected(e) {
  e.preventDefault();
  const getSelected = async () => {
    let id = e.target.value;
    try {
      axios.interceptors.request.use((config) => {
        body.style.cursor = "progress";
        console.log("Request sent.");
        config.metadata = { requestTime: new Date() };
        config.onDownloadProgress = (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressBar.style.width = `${percentage}%`;
        };
        return config;
      });
      const selected = await axios.get(
        `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${id}&api_key=${API_KEY}`
      );
      axios.interceptors.response.use(
        (response) => {
          const responseTime = new Date();
          const totalTime = responseTime - response.config.metadata.requestTime;
          console.log(`It took ${totalTime} milliseconds.`);
          body.style.cursor = "default";
          return response;
        },
        (error) => {
          console.log("Unsuccessful response...");
          throw error;
        }
      );
      return selected;
    } catch (err) {
      console.log(err);
    }
  };
  if (e.target.value !== "Select a Breed" && e.target.value !== "undefined") {
    getSelected().then((res) => {
      if (res.data.length > 0) {
        let breeds = res.data;
        let table = document.createElement("table");
        let cat = breeds[0].breeds[0];
        if (cat) {
          const keys = Object.keys(cat);
          const values = Object.values(cat);
          for (let i = 0; i <= keys.length; i += 5) {
            let tableHead = document.createElement("thead");
            let tableBody = document.createElement("tbody");
            let bodyTableRow = document.createElement("tr");
            bodyTableRow.style.backgroundColor = "lightblue";
            let tableRow = document.createElement("tr");
            tableRow.style.backgroundColor = "brown";
            tableRow.style.color = "white";
            let keysTemp = keys.slice(i, i + 4);
            let valuesTemp = values.slice(i, i + 4);
            keysTemp.forEach((key, index) => {
              let tableHeadItem = document.createElement("th");
              tableHeadItem.style.textAlign = "center";
              let tableData = document.createElement("td");
              tableData.style.textAlign = "center";
              if (key === "weight") {
                let imperial = valuesTemp[index].imperial;
                let metric = valuesTemp[index].metric;
                tableHeadItem.innerHTML = key;
                tableData.innerHTML = `imperial: ${imperial}, metric: ${metric}`;
              } else {
                tableHeadItem.innerHTML = key;
                tableData.innerHTML = valuesTemp[index];
              }
              tableRow.appendChild(tableHeadItem);
              bodyTableRow.appendChild(tableData);
            });
            tableHead.appendChild(tableRow);
            table.appendChild(tableHead);
            tableBody.appendChild(bodyTableRow);
            table.appendChild(tableBody);
          }
        }
        infoDump.appendChild(table);
        breeds.forEach((breed) => {
          let url = breed.url;
          let carouselObject = Carousel.createCarouselItem(
            url,
            "image of a cat",
            breed.id
          );
          Carousel.appendCarousel(carouselObject);
          firstOption.innerHTML = breed.breeds[0].name;
          Carousel.start();
        });
      } else {
        Carousel.clear();
        clearInfo();
        progressBar.style.width = "0%";
      }
    });
    e.target.value = "Select a Breed";
    firstOption.innerHTML = "Select a Breed";
  }
}

export async function favourite(imgId) {
  async function getFavorites() {
    try {
      axios.interceptors.request.use((config) => {
        console.log("Request sent.");
        config.metadata = { requestTime: new Date() };
        return config;
      });

      let rawBody = JSON.stringify({
        image_id: imgId,
        sub_id: "user-12345",
      });

      const response = await fetch("https://api.thecatapi.com/v1/favourites", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": API_KEY,
        },
        body: rawBody,
      });
      const favourites = await response.json();

      axios.interceptors.response.use(
        (response) => {
          const responseTime = new Date();
          const totalTime = responseTime - response.config.metadata.requestTime;
          console.log(`It took ${totalTime} milliseconds.`);
          body.style.cursor = "default";
          return response;
        },
        (error) => {
          // Failure: anything outside of status 2XX
          console.log("Unsuccessful response...");
          throw error;
        }
      );

      return favourites;
    } catch (err) {
      console.log(err);
      alert(
        "Oops, you already added this cat to your favorites! Pick another cat."
      );
    }
  }
  getFavorites().then((value) => {
    console.log(value);
  });
}

async function seeFavorites() {
  Carousel.clear();
  try {
    const response = await fetch(
      "https://api.thecatapi.com/v1/favourites?limit=20&sub_id=user-12345&order=DESC",
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": API_KEY,
        },
      }
    );
    const favourites = await response.json();

    for (let i = 0; i <= favourites.length; i++) {
      let image = favourites[i].image;

      let id = image.id;
      let url = image.url;

      let carouselObject = Carousel.createCarouselItem(
        url,
        "image of a cat",
        id
      );
      Carousel.appendCarousel(carouselObject);
      Carousel.start();
      infoDump.innerHTML = "";
    }
  } catch (err) {
    console.log(err);
  }
}
