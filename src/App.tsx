import React from 'react';
import './App.css';
import autobind from 'autobind-decorator';

enum CITY {
  OTTAWA = 'OTTAWA',
  TORONTO = 'TORONTO',
  WINDSOR = 'WINDSOR'
}

const latLong = {
  OTTAWA: {
    lat: '45.424721',
    long: '-75.695000'
  },
  TORONTO: {
    lat: '43.651070',
    long: '-79.347015'
  },
  WINDSOR: {
    lat: '42.317432',
    long: '-83.026772'
  }
}

type Climate = {
  temp: string,
  weather: string,
  icon: string,
  day: number
}

export interface AppState {
  selectedCity: string;
  today: Climate,
  nextDays: Climate[]
}

class App extends React.Component<{}, AppState>{

  state = {
    selectedCity: CITY.OTTAWA,
    today: {
      temp: '',
      weather: '',
      icon: '',
      day: 0
    },
    nextDays: []
  }

  kToC(temp: number) {
    return `${Math.ceil(temp - 273.15).toString()}\u00b0`;
  }

  @autobind
  handleSelectCity(selectedCity: CITY) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latLong[selectedCity].lat}&lon=${latLong[selectedCity].long}&appid=55249d75c077402e2e1a4eb1f3e75a3e`
    let nDays: any[] = [];
    fetch(url)
    .then(res=>res.json())
    .then((res: any) =>{
      res?.list.forEach((r: any, i: number)=>{
        if((i+1)%8 === 0) {
          nDays.push(r)
        }
      })
      nDays = nDays.slice(0,4)
      this.setState({
        selectedCity,
        today: {
          temp: this.kToC(res.list[0].main.temp),
          weather: res.list[0].weather[0].main,
          icon: res.list[0].weather[0].icon,
          day: (new Date(res.list[0].dt_txt)).getDay()
        },
        nextDays: nDays.map((day: any) => ({
          temp: this.kToC(day.main.temp),
          weather: day.weather[0].main,
          icon: day.weather[0].icon,
          day: (new Date(day.dt_txt)).getDay()
        }))
      });
    });
    
  }

  componentDidMount() {
    this.handleSelectCity(CITY.OTTAWA);
  }
  
  render() {
    const { selectedCity, today, nextDays } = this.state;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const cities = [CITY.OTTAWA, CITY.TORONTO, CITY.WINDSOR];
    return(
    <div className="App">
      <header className="App-header">
        <div className="City-div">
          {cities.map((city: CITY) =>
          <button
            key={city}
            className= {city === selectedCity ? "City-btn-selected" : "City-btn"}
            onClick={() => this.handleSelectCity(city)}
          >{city}</button>
          )}
        </div>
        <div className="Weather-div">
          <div className="Today-sec">
            <p className='level1-text'>Today</p>
            <div className='row'>
              <img alt="" src={`http://openweathermap.org/img/wn/${today.icon}@2x.png`} />
              <div>
                <p className='level1-temp'>{today.temp}</p>
                <p className='level1-text'>{today.weather}</p>
              </div>
            </div>
          </div>
          <div className="Next4-sec">
            {nextDays.map((item: Climate, i: number) =>
              <div key={i} className="Day-sec">
                <p className='level2-text'>{days[item.day]}</p>
                <img alt="" src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`} />
                <p className='level2-temp'>{item.temp}</p>
              </div>
            )}
          </div>

        </div>
      </header>
    </div>
    );
  }
}


export default App;
