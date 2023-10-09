import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowDown,
  faArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./AppStyle/App.css";
import { useEffect, useState } from "react";

function App() {
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [region, setregion] = useState("");
  const [temperature, setTemperature] = useState("");
  const [condition, setCondition] = useState("");
  const [sensation, setSensation] = useState("");
  const [wind, setWind] = useState("");
  const [humidity, setHumidity] = useState("");
  const [UV, setUV] = useState("");
  const [user, setuser] = useState(0);
  const [image, setImage] = useState("");

  /**
   *  A página pedirá e utilizará a localização apenas na primeira renderização da mesma.
   */
  useEffect(() => {
    setuser(1);
    navigator.geolocation.getCurrentPosition((location) => {
      Weatherapi(location.coords.latitude + ",", location.coords.longitude);
    });
  },[user]);

  const Weatherapi = async (latitudeProps, longitudeProps) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=742ff23b82c349f499a214120232409&q=${latitudeProps}${longitudeProps}&aqi=no`;
    const config = {
      headers: {
        Vary: "Accept-Encoding",
        "CDN-PullZone": "93447",
        "CDN-Uid": "8fa3a04a-75d9-4707-8056-b7b33c8ac7fe",
        "CDN-RequestCountryCode": "GB",
        Age: "0",
        "CDN-ProxyVer": "1.04",
        "CDN-RequestPullSuccess": "True",
        "CDN-RequestPullCode": "200",
        "CDN-CachedAt": "09/25/2023 18:42:50",
        "CDN-EdgeStorageId": "1048",
        "CDN-Status": "200",
        "CDN-RequestId": "a0c300c97cb1c93e884e047a5f97efca",
        "CDN-Cache": "MISS",
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=180",
        "Content-Type": "application/json",
        Server: "BunnyCDN-DE1-1047",
      },
    };

    //integração com a api do weather
    await axios.get(url, config).then((e) => {
    
      //traduzindo informações de EN para PT-BR do json
      const translate = {
        "Partly cloudy": "Parcialmente Nublado",
        Clear: "Limpo",
        Sunny: "Sol",
        Mist: "Neblina",
        Overcast: "Nublado",
        "Light rain":"Chuva Fina",
        Brazil:"Brasil",
      };

      const data = {
        'country':e.data.location.country,
        'region':e.data.location.region,
        'location':e.data.location.name,
        'temperature':e.data.current.temp_c,
        'condition':e.data.current.condition.text,
        'sensation':e.data.current.feelslike_c,
        'wind':e.data.current.wind_kph,
        'humidity':e.data.current.humidity,
        'uv':e.data.current.uv,
        'image':e.data.current.condition.icon,
      }

      setLocation(data.location);
      setregion(data.region);
      setCountry(translate[data.country] || data.country);
      setTemperature(data.temperature);
      setCondition(translate[data.condition] || data.condition);
      setSensation(Math.round(data.sensation) + "º");
      setWind(Math.round(data.wind) + "KM/h");
      setHumidity(Math.round(data.humidity) + "%");
      setUV(data.uv);
      setImage(data.image.replace('//','https://'))
    
    
    });

    //após o await rodar a animação da abertura do modal
    animationOpenScreen();
  };

  //animação da abertura do modal
  const animationOpenScreen = () => {
    const screen = document.querySelector(".container__search__screen");
    screen.style.display = "block";
    setTimeout(() => {
      screen.style.transition = "200ms";
      screen.style.opacity = 1;
    }, 200);
  };

  //animação do fechamento do modal
  const closeAnimationOpenScreen = () => {
    const screen = document.querySelector(".container__search__screen");
    screen.style.opacity = 0;

    setTimeout(() => {
      screen.style.display = "none";
    }, 200);
  };

  //como a api não tem a minima e a maxima do dia, aqui adiciono 10% da temperatura do dia na maxima e retiro 10% na minima
  const MinTemperature =
    Math.round(temperature - (temperature / 100) * 10) + "º";
  const MaxTemperature =
    Math.round(temperature + (temperature / 100) * 10) + "º";

  return (
    <>
      <section className="container">
        <div className="container__search">
          <h1> Meteorologia em tempo <span>Real</span> </h1>
          <div className="container__search__screen">
            <span className="container__search__screen__close" onClick={closeAnimationOpenScreen}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <strong>
              {location}, {region} - {country}
            </strong>
            
            <article className="container__search__screen_condition">
            <h1>
              {condition}<img src={image} width='60px' height='60px'/>
            </h1>
            <article className="container__search__screen__temperature">
               <span>{temperature}ºC</span>
            </article>

            </article>

            <div className="container__search__screen__average">
              <table className="container_search_screen_avarange_minmax">
                <tbody>
                  <tr>
                    <td className="container_search_screen_avarange_minmax__icon">
                      <FontAwesomeIcon icon={faArrowDown} />{" "}
                      <strong>{MinTemperature}</strong>
                    </td>
                    <td className="container_search_screen_avarange_minmax__icon">
                      <FontAwesomeIcon icon={faArrowUp} />{" "}
                      <strong>{MaxTemperature}</strong>
                    </td>
                    <td>
                      Sensação <strong>{sensation}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Vento <strong>{wind}</strong>
                    </td>
                    <td>
                      Humidade <strong>{humidity}</strong>
                    </td>
                    <td>
                      Índice UV <strong>{UV}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <article className="container__search__inputAlign">
            <input
              type="text"
              id="city"
              name="text"
              placeholder="insira aqui o nome da cidade"
            />
            <i
              id="magnifyGlass"
              onClick={() => {
                const city = document.querySelector("#city");
                Weatherapi(city.value, "");
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </i>
          </article>
        </div>
      </section>
    </>
  );
}

export default App;
