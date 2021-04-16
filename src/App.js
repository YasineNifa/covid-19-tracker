
import './App.css';
import {FormControl, MenuItem, Select} from "@material-ui/core"
import {useState, useEffect} from 'react'
import InfoBox from './components/InfoBox';
import Table from './components/Table';
import Map from './components/Map';
import {Card, CardContent} from "@material-ui/core"
import {sortData} from './utils'
import LineGraph from './components/LineGraph';
// import axios from 'axios'
function App() {
  const [countries,setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  
  useEffect(()=>{
    const getCountriesData = async () =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(res => res.json())
      .then((data)=>{
        const countries = data.map((country) => (
          {
            name : country.country,
            value : country.countryInfo.iso2
          }
        )
        );
        const sortedData = sortData(data);
        setTableData(sortedData)
        setCountries(countries);
      });
    };
    getCountriesData();
    
  } ,[]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((res)=>res.json())
    .then((data) => {
      setCountryInfo(data)
    })
  },[])

  const onCountryChange = async (e) =>{
    const countryCode = e.target.value;
    setSelectedCountry(countryCode)
    const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setSelectedCountry(countryCode)
      setCountryInfo(data);
      // console.log("Infos : ", data)
      
    })
    console.log("Infos : ", countryInfo)
  }

  ///https://disease.sh/v3/covid-19/countries
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className = "app__dropdown">
            <Select variant = "outlined" value={selectedCountry} onChange = {onCountryChange}>
            <MenuItem value={selectedCountry}>{selectedCountry}</MenuItem>

              {
                countries.map((country,idx) => <MenuItem key={idx} value={country.value}>{country.name}</MenuItem>)
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox title="Coronavirus cases" cases = {countryInfo.todayCases} total={countryInfo.cases}/>
          <InfoBox title="Recovered" cases = {countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <InfoBox title="Deaths" cases = {countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map/>
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new cases</h3>
          <LineGraph/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
