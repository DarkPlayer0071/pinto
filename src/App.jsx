import '@fortawesome/fontawesome-free/css/all.min.css'
import { useState } from "react"
import { api } from "./services/api"

const WeatherMain = {
  Clear: 'clear.png',
  Rain: 'rain.png',
  Snow: 'snow.png',
  Clouds: 'cloud.png',
  Haze: 'mist.png',
}

function App() {
  const [pesquisa, setPesquisa] = useState("");
  const [tempo, setTempo] = useState(null);
  const [erro, setErro] = useState(false);

  const pesquisar = async (cidade) => {
    try {
      const response = await api.post("/history", { cidade });
      console.log("Response data: ", response.data);
    } catch (error) {
      console.error("Erro ao pesquisar cidade: ", error);
    }
  }

  const pesquisarCidade = async (cidade) => {
    try {
      const dadosTempo = await api.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=cebcd482eda57fa9a6714c1c2ba91885&lang=pt_br&units=metric`);
      
      if (dadosTempo?.data) {
        console.log("Dados do tempo: ", dadosTempo.data);
        setTempo(dadosTempo.data);
        setErro(false);
        await pesquisar(cidade);
      }
    } catch (error) {
      console.error("Erro ao pesquisar cidade: ", error);
      setErro(true);
      setTempo(null);
    }
  }

  console.log("Tempo: ", tempo);

  return (
    <div className="caixa">
      <div className="caixa-pesquisar">
        <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
        <input 
          type="text" 
          placeholder="Escreva o nome da cidade" 
          value={pesquisa} 
          onChange={e => setPesquisa(e.target.value)} 
        />
        <button 
          className="fa-solid fa-magnifying-glass" 
          onClick={() => pesquisarCidade(pesquisa)}
        ></button>
      </div>

      {erro && (
        <div className="nao-encontrado">
          <img src="./assets/404.png" alt="Cidade não encontrada" />
          <p>Ops! Cidade não encontrada :/</p>
        </div>
      )}

      {tempo && (
        <div className="caixa-tempo">
          <div className="image-container">
            <img src={require(`./assets/${WeatherMain[tempo.weather[0].main]}`)} alt="Condições climáticas" />
          </div>
          <div className="info-container">
            <div className="temperature-container">
              <span className="temperature">{parseInt(tempo.main.temp)}</span>
              <span>°C</span>
            </div>
            <p className="descricao">{tempo.weather[0].description}</p>
            <div className="caixa-detalhes">
              <div className="detalhes-container">
                <div className="humidade">
                  <i className="fa-solid fa-water" aria-hidden="true"></i>
                  <div className="text">
                    <p className="humidade">{parseInt(tempo.main.humidity)}%</p>
                    <span>Humidade</span>
                  </div>
                </div>
                <div className="vento">
                  <i className="fa-solid fa-wind" aria-hidden="true"></i>
                  <div className="text">
                    <p className="vento">{parseInt(tempo.wind.speed)}Km/h</p>
                    <span>Velocidade do vento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
