import React from "react";
import { Bar } from "react-chartjs-2";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      chartData: {},
      chinaBorderData: undefined,
    };
  }

  componentDidMount() {
    Promise.all([
      fetch("http://localhost:8080/api/v1/getTopMostBorders")
        .then((res) => res.json())
        .then(
          (result) => {
            let labels = [],
              chartData = [];
            result.forEach((element) => {
              labels.push(element.countryName);
              chartData.push(element.borderCount);
            });

            const generatedChartState = {
              isLoaded: true,
              countryList: {
                labels: labels,
                datasets: [
                  {
                    label: "Most Number of borders (Top 10)",
                    backgroundColor: "rgba(96,190,62,1)",
                    borderColor: "rgba(0,0,0,1)",
                    borderWidth: 2,
                    data: chartData,
                  },
                ],
              },
            };
            this.setState({
              chartData: generatedChartState.countryList,
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        ),

      fetch("http://localhost:8080/api/v1/getChinaBorderList")
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              chinaBorderData: result,
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        ),
    ]);
  }

  render() {
    return (
      
      <div className="App">
        <div className="header">
          <h1 className="title">Demo Application</h1>
          <div className="links"></div>
        </div>
        
        <button class="button button1" onClick={()=> window.open("http://localhost:8080/api/v1/generatePdfForDashboard", '_blank')}>Generate PDF</button>
        
        <Bar
          width={50}
          height={50}
          data={this.state.chartData}
          options={{
            maintainAspectRatio: true,
            title: {
              display: true,
              text: "Countries with most border",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />        

        <h2>Countries bordered by China</h2>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Region</td>
              <td>Area</td>
              <td>Population</td>
              <td>Flag</td>
            </tr>
          </thead>
          <tbody>
            {this.state.chinaBorderData &&
              this.state.chinaBorderData.map((listValue, index) => {
                return (
                  <tr key={index}>
                    <td>{listValue.countryName}</td>
                    <td>{listValue.region}</td>
                    <td>{listValue.area}</td>
                    <td>{listValue.population}</td>
                    <td>
                      {" "}
                      <img
                        src={listValue.flagSvgUrl}
                        width="35px"
                        height="25px"
                        alt="Not Found"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }

  openInNewTab= (url) => {
    console.log('yyy')
    window.open(url, '_blank');
   }

}

