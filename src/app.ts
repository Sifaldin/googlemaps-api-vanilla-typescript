import axios from "axios";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

type GoogleGeocoding = {
  results: {geometry: {location: {lat: number, lng: number}}}[];
  status: 'OK' | 'ZERO_RESULTS';
} 

function searchAdressHandler(e: Event) {
  e.preventDefault();
  const enteredAddress = addressInput.value;
  axios
    .get<GoogleGeocoding>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${process.env.GOOGLE_API_KEY}`
    )
    .then(res => {
      if(res.data.status !== 'OK'){throw new Error("Could not fetch location!")}
      const coodinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coodinates,
        zoom: 16,
      });
      new google.maps.Marker({
        position: coodinates,
        map: map,
      });
    })
    .catch(e => alert(e.message))
}

form.addEventListener("submit", searchAdressHandler);
