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
  const [country, setCountry] = useState();
  const [location, setLocation] = useState();
  const [region, setregion] = useState();
  const [temperature, setTemperature] = useState();
  const [condition, setCondition] = useState();
  const [sensation, setSensation] = useState();
  const [wind, setWind] = useState();
  const [humidity, setHumidity] = useState();
  const [UV, setUV] = useState();
  const [image, setImage] = useState();

/**
	* @function useEffect Verificaa se é o primeiro acesso nesta sessão e caso sim, injeta na api as informações com a localização do usuário.
 */
useEffect(() => {
	if(!sessionStorage.getItem("first_user_visit")){
		sessionStorage.setItem("first_user_visit","true")
  navigator.geolocation.getCurrentPosition((location) => {
			Weatherapi(location.coords.latitude + ",", location.coords.longitude);
		});
	}else{
				console.log('welcome back')
	}
});

  /**
   *
   * @param { *latitude_local Por parâmetro deve receber a latitude local do usuário. }
   * @param { *longitude_local Por parâmetro deve receber a longitude local do usuário. }
   *
   */
const Weatherapi = async (latitude_local, longitude_local) => {
	const url = `https://api.weatherapi.com/v1/current.json?key=742ff23b82c349f499a214120232409&q=${latitude_local}${longitude_local}&aqi=no`;
	const config = {
  headers: {
    "Vary": "Accept-Encoding",
    "CDN-PullZone": "93447",
    "CDN-Uid": "8fa3a04a-75d9-4707-8056-b7b33c8ac7fe",
    "CDN-RequestCountryCode": "GB",
    "Age": "0",
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
	await axios.get(url, config).then((e) => {

	const translate = {
	"Partly cloudy": "Parcialmente Nublado",
	Clear: "Limpo",
	Sunny: "Sol",
	Mist: "Neblina",
	Overcast: "Nublado",
	"Light rain": "Chuva Fina",
	Brazil: "Brasil",
	};		
	const data = {
	country: e.data.location.country,
	region: e.data.location.region,
	location: e.data.location.name,
	temperature: e.data.current.temp_c,
	condition: e.data.current.condition.text,
	sensation: e.data.current.feelslike_c,
	wind: e.data.current.wind_kph,
	humidity: e.data.current.humidity,
	uv: e.data.current.uv,
	image: e.data.current.condition.icon,
	};

	setLocation(data.location);
	setregion(data.region);
	setCountry(translate[data.country] || data.country);
	setTemperature(data.temperature);
	setCondition(translate[data.condition] || data.condition);
	setSensation(Math.round(data.sensation) + "º");
	setWind(Math.round(data.wind) + "KM/h");
	setHumidity(Math.round(data.humidity) + "%");
	setUV(data.uv);
	setImage(data.image.replace("//", "https://")); 
	});

	Animation_open_screen(1);
};

/**
	* @function **Animation_open_screen** Cria uma pequena transição de abertura do modal.
	* @param speed Define a velocidade do efeito de abertura do modal.
	* @constant screen recebe o modal e adiciona ao display usando o display Block
	* @argument setTimeOut define um tempo para que o modal receba uma transição de 200ms e em seguida apareça na tela já com a transição recebendo a opacidade 1.
	*/
const Animation_open_screen = (speed) => {
    const screen = document.querySelector(".container__search__screen");
    screen.style.display = "block";
    setTimeout(() => {
      screen.style.transition = `${speed*1000}ms`;
      screen.style.opacity = 1;
    }, 200);
  };

		/**
			* @function **Animation_close_screen** Cria uma pequena transição de fechamento do modal.
			* @constant screen recebe o modal e define como opacidade 0
			* @argument setTimeOut define um tempo para que o modal seja removido do display, para que não sobreponha outros botões e inputs.
			*/
const Animation_close_screen = () => {
	const screen = document.querySelector(".container__search__screen");
	screen.style.opacity = 0;
	setTimeout(() => {
		screen.style.display = "none";
	}, 200);
};

 /**
			* este algorítimo recebe a temperatura local, converte em porcentagem.
   * @function **Min_temperature** esta função recebe a temperatura local, converte em porcentagem e injeta as informações no modal.
			* @param percent Por parâmetro você deve passar manualmente quantos % ele deve remover da temperatura atual para classificar como a temperatura minima do dia. 
		*/
const Min_temperature = (percent) => {
	const round = Math.round(temperature - (temperature / 100) * percent);
	return <>{round}º</>;
};
  /**
			* este algorítimo recebe a temperatura local, converte em porcentagem.
   * @function **Max_temperature** esta função recebe a temperatura local, converte em porcentagem e injeta as informações no modal.
			* @param percent Por parâmetro você deve passar manualmente quantos % ele deve adicionar da temperatura atual para classificar como a temperatura minima do dia. 
		*/
const Max_temperature = (percent) => {
	const round = Math.round(temperature + (temperature / 100) * percent);
	return <>{round}º</>;
};

return (
    <>
      <section className="container">
        <div className="container__search">
          <h1>
            {" "}
            Meteorologia em tempo <span>Real</span>{" "}
          </h1>
          <div className="container__search__screen">
            <span
              className="container__search__screen__close"
              onClick={Animation_close_screen}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <strong>
              {location}, {region} - {country}
            </strong>

            <article className="container__search__screen_condition">
              <h1>
                {condition}
                <img src={image} width="60px" height="60px" />
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
                      <strong>{Min_temperature(40)}</strong>
                    </td>
                    <td className="container_search_screen_avarange_minmax__icon">
                      <FontAwesomeIcon icon={faArrowUp} />{" "}
                      <strong>{Max_temperature(15)}</strong>
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
