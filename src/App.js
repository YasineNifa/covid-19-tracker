
import './App.css';
import {FormControl, MenuItem, Select} from "@material-ui/core"
import {useState, useEffect} from 'react'
import InfoBox from './components/InfoBox';
import Table from './components/Table';
import Mapp from './components/Mapp';
import {Card, CardContent} from "@material-ui/core"
import {sortData} from './utils'
import LineGraph from './components/LineGraph';
import "leaflet/dist/leaflet.css"
// import axios from 'axios'
function App() {
  const [countries,setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  
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
    //setSelectedCountry(countryCode)
    const url = 
    countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setSelectedCountry(countryCode)
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      
    })
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
        <Mapp 
          center = {mapCenter}
          zoom = {mapZoom}
          />
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


//=============================================================================


// import React, { useState, useEffect } from "react";
// import "./App.css";
// import {
//   MenuItem,
//   FormControl,
//   Select,
//   Card,
//   CardContent,
// } from "@material-ui/core";
// import InfoBox from "./components/InfoBox";
// import LineGraph from "./components/LineGraph";
// import Table from "./components/Table";
// import { sortData } from "./utils";
// import numeral from "numeral";
// import Map from "./components/Mapp";
// import "leaflet/dist/leaflet.css";

// const App = () => {
//   const [country, setInputCountry] = useState("worldwide");
//   const [countryInfo, setCountryInfo] = useState({});
//   const [countries, setCountries] = useState([]);
//   const [mapCountries, setMapCountries] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [casesType, setCasesType] = useState("cases");
//   const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
//   const [mapZoom, setMapZoom] = useState(3);

//   useEffect(() => {
//     fetch("https://disease.sh/v3/covid-19/all")
//       .then((response) => response.json())
//       .then((data) => {
//         setCountryInfo(data);
//       });
//   }, []);

//   useEffect(() => {
//     const getCountriesData = async () => {
//       fetch("https://disease.sh/v3/covid-19/countries")
//         .then((response) => response.json())
//         .then((data) => {
//           const countries = data.map((country) => ({
//             name: country.country,
//             value: country.countryInfo.iso2,
//           }));
//           let sortedData = sortData(data);
//           setCountries(countries);
//           setMapCountries(data);
//           setTableData(sortedData);
//         });
//     };

//     getCountriesData();
//   }, []);

//   console.log(casesType);

//   const onCountryChange = async (e) => {
//     const countryCode = e.target.value;

//     const url =
//       countryCode === "worldwide"
//         ? "https://disease.sh/v3/covid-19/all"
//         : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
//     await fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         setInputCountry(countryCode);
//         setCountryInfo(data);
//         setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
//         setMapZoom(4);
//       });
//   };

//   return (
//     <div className="app">
//       <div className="app__left">
//         <div className="app__header">
//           <h1>COVID-19 Tracker</h1>
//           <FormControl className="app__dropdown">
//             <Select
//               variant="outlined"
//               value={country}
//               onChange={onCountryChange}
//             >
//               <MenuItem value="worldwide">Worldwide</MenuItem>
//               {countries.map((country) => (
//                 <MenuItem value={country.value}>{country.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </div>
//         <div className="app__stats">
//           <InfoBox
//             onClick={(e) => setCasesType("cases")}
//             title="Coronavirus Cases"
//             isRed
//             active={casesType === "cases"}
//             // cases={prettyPrintStat(countryInfo.todayCases)}
//             total={numeral(countryInfo.cases).format("0.0a")}
//           />
//           <InfoBox
//             onClick={(e) => setCasesType("recovered")}
//             title="Recovered"
//             active={casesType === "recovered"}
//             // cases={prettyPrintStat(countryInfo.todayRecovered)}
//             total={numeral(countryInfo.recovered).format("0.0a")}
//           />
//           <InfoBox
//             onClick={(e) => setCasesType("deaths")}
//             title="Deaths"
//             isRed
//             active={casesType === "deaths"}
//             // cases={prettyPrintStat(countryInfo.todayDeaths)}
//             total={numeral(countryInfo.deaths).format("0.0a")}
//           />
//         </div>
//         <Map
//           countries={mapCountries}
//           casesType={casesType}
//           center={mapCenter}
//           zoom={mapZoom}
//         />
//       </div>
//       <Card className="app__right">
//         <CardContent>
//           <div className="app__information">
//             <h3>Live Cases by Country</h3>
//             <Table countries={tableData} />
//             <h3>Worldwide new {casesType}</h3>
//             <LineGraph casesType={casesType} />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default App;