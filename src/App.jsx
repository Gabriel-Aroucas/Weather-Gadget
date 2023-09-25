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

//caso aperte enter, rode a função para não depender do click no icone da lupa.
  document.addEventListener("keypress", (e) => {
    switch (e.code) {
      case 'Enter': Weatherapi()
    }
  })

  const Weatherapi = async () => {
    const country = document.querySelector("#country");

    //validando o campo do input, caso esteja vazio
    country.value.length == 0 ? alert("Digite o nome de uma cidade") : ''

    //integração com a api do weather
    await axios.get(`http://api.weatherapi.com/v1/current.json?key=742ff23b82c349f499a214120232409&q=${country.value}&aqi=no`)
      .then((e) => {
        setLocation(e.data.location.name)
        setregion(e.data.location.region)
        setCountry(e.data.location.country)

        setTemperature(e.data.current.temp_c)

        //traduzindo informações de EN para PT-BR do json
        if (e.data.current.condition.text == 'Partly cloudy') {
          setCondition('Parcialmente Nublado')
        } else if (e.data.current.condition.text == 'Clear') {
          setCondition('Limpo')
        } else if (e.data.current.condition.text == 'Sunny') {
          setCondition('Sol')
        } else {
          setCondition(e.data.current.condition.text)
        }
        //arredondando numeros quebrados e inserindo no useState
        setSensation(Math.round(e.data.current.feelslike_c) + 'º')
        setWind(Math.round(e.data.current.wind_kph) + 'KM/h')
        setHumidity(Math.round(e.data.current.humidity) + '%')
        setUV(e.data.current.uv)

      })

    //após o await rodar a animação da abertura do modal
    animationOpenScreen()

  }

  //animação da abertura do modal
  const animationOpenScreen = () => {
    const screen = document.querySelector(".container__search__screen")
    screen.style.display = 'block'
    setTimeout(() => {
      screen.style.transition = '200ms'
      screen.style.opacity = 1

    }, 200);

  }

  //animação do fechamento do modal
  const closeAnimationOpenScreen = () => {
    const screen = document.querySelector(".container__search__screen")
    screen.style.opacity = 0

    setTimeout(() => {
      screen.style.display = 'none'



    }, 200);

  }

  //como a api não tem a minima e a maxima do dia, aqui adiciono 10% da temperatura do dia na maxima e retiro 10% na minima
  const MinTemperature = Math.round(temperature - temperature / 100 * 10) + 'º'
  const MaxTemperature = Math.round(temperature + temperature / 100 * 10) + 'º'

  return (
    <>
      <section className="container">
        <div className="container__search">
          <h1>Meteorologia em tempo <span>Real</span></h1>
          <div className="container__search__screen">
            <span className='container__search__screen__close' onClick={closeAnimationOpenScreen}>
              <FontAwesomeIcon icon={faXmark} />
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
