import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faArrowDown, faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons'
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
  const [UV, setUV] = useState('')



  const Weatherapi = async () => {
    const country = document.querySelector("#country");

   await axios.get(`http://api.weatherapi.com/v1/current.json?key=742ff23b82c349f499a214120232409&q=${'itaborai'}&aqi=no`)
      .then((e) => {
        setLocation(e.data.location.name)
        setregion(e.data.location.region)
        setCountry(e.data.location.country)

        setTemperature(e.data.current.temp_c)

        switch (e.data.current.condition.text) {
          case 'Partly cloudy': setCondition('Parcialmente Nublado')
        }

        setSensation(Math.round(e.data.current.feelslike_c) + 'º')
        setWind(Math.round(e.data.current.wind_kph) + 'KM/h')
        setHumidity(Math.round(e.data.current.humidity) + '%')
        setUV(e.data.current.uv)


        console.log(e.data)
      })

    animationOpenScreen()

  }

  const animationOpenScreen = () => {
    const screen = document.querySelector(".container__search__screen")
    screen.style.display='block'
    setTimeout(() => {
      screen.style.transition='200ms'
    screen.style.opacity=1
      
    }, 200);
    
  }

  const closeAnimationOpenScreen = ()=>{
    const screen = document.querySelector(".container__search__screen")
    screen.style.opacity=0
    
    setTimeout(() => {
    screen.style.display='none'


      
    }, 200);
    
  }
  const MinTemperature = Math.round(temperature - temperature / 100 * 10) + 'º'
  const MaxTemperature = Math.round(temperature + temperature / 100 * 10) + 'º'

  return (
    <>
      <section className="container">
        <div className="container__search">
          <h1>Meteorologia em tempo <span>Real</span></h1>
          <div className="container__search__screen">
            <span className='container__search__screen__close' onClick={closeAnimationOpenScreen}>
            <FontAwesomeIcon icon={faXmark}/>
            </span>
            <strong>{location}, {region} - {country}</strong>
            <h1>{temperature}ºC<span>{condition}</span></h1>
            <div className="container__search__screen__average">

              <table className="container_search_screen_avarange_minmax">
                <tbody>
                  <tr>
                    <td className="container_search_screen_avarange_minmax__icon"><FontAwesomeIcon icon={faArrowDown} /> <strong>{MinTemperature}</strong></td>
                    <td className="container_search_screen_avarange_minmax__icon"><FontAwesomeIcon icon={faArrowUp} /> <strong>{MaxTemperature}</strong></td>
                    <td>Sensação <strong>{sensation}</strong></td>
                  </tr>

                  <tr>
                    <td>Vento <strong>{wind}</strong></td>
                    <td>Humidade <strong>{humidity}</strong></td>
                    <td>Índice UV <strong>{UV}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <article className="container__search__inputAlign">
            <input type="text" id="country" name='text' placeholder='insira aqui o nome da cidade' />
            <i onClick={Weatherapi}><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
          </article>
        </div>
      </section>
    </>
  )
}

export default App
