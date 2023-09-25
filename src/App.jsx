import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import "./AppStyle/App.css"
import { useState } from 'react'

function App() {
  const [country, setCountry] = useState('')
  const [location, setLocation] = useState('')
  const [region, setregion] = useState('')
  const [temperature, setTemperature] = useState('')
  const [condition, setCondition] = useState('')
  const [sensation, setSensation] = useState('')
  const [wind, setWind] = useState('')
  const [humidity, setHumidity] = useState('')



  const Weatherapi = () => {
    const country = document.querySelector("#country");

    axios.get(`http://api.weatherapi.com/v1/current.json?key=742ff23b82c349f499a214120232409&q=${'itaborai'}&aqi=no`)
      .then((e) => {
        setLocation(e.data.location.name)
        setregion(e.data.location.region)
        setCountry(e.data.location.country)

        setTemperature(e.data.current.temp_c)
        setCondition(e.data.current.condition.text)

        setSensation(Math.round(e.data.current.feelslike_c) + 'º')
        setWind(Math.round(e.data.current.wind_kph) + 'KM/h')
        setHumidity(Math.round(e.data.current.humidity) + '%')


        console.log(e.data)
      })

  }

  const MinTemperature = Math.round(temperature - temperature / 100 * 10) + 'º'
  const MaxTemperature = Math.round(temperature + temperature / 100 * 10) + 'º'

  return (
    <>
      <section className="container">
        <div className="container__search">
          <h1>Previsão do Tempo</h1>
          <div className="container__search__screen">
            <strong>{location}, {region} - {country}</strong>
            <h1>{temperature}º - {condition}</h1>
            <div className="container__search__screen__average">

              <table className="minmax">
                <tbody>
                  <tr>
                    <td className="minmax__icon"><FontAwesomeIcon icon={faArrowDown} />Min <strong>{MinTemperature}</strong></td>
                    <td className="minmax__icon"><FontAwesomeIcon icon={faArrowUp} />Max <strong>{MaxTemperature}</strong></td>
                    <td>Sensação {sensation}</td>
                  </tr>

                  <tr>
                    <td>Vento {wind}</td>
                    <td>Humidade {humidity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <article className="container__search__inputAlign">
            <input type="text" id="country" placeholder='insira aqui o nome da cidade' />
            <i onClick={Weatherapi}><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
          </article>
        </div>
      </section>
    </>
  )
}

export default App
