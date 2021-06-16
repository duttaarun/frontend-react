import React from "react";
import { Bar } from "react-chartjs-2";
import "./App.css";
import Loader from "react-loader-spinner";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      chartData: {},
      chinaBorderData: undefined,
      loading: true
    };
  }

  componentDidMount() {
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/getTopMostBorders`, {
        method: "get",
        headers: new Headers({
          Authorization: "Basic " + process.env.REACT_APP_BASIC_AUTH,
        }),
      })
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
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        ),

      fetch(`${process.env.REACT_APP_API_URL}/getChinaBorderList`, {
        method: "get",
        headers: new Headers({
          Authorization: "Basic " + process.env.REACT_APP_BASIC_AUTH,
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              chinaBorderData: result,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        ),
      setTimeout(() => {
        this.setState({ loading: false })
      }, 5000)
    ]);

  }

  render() {

    if (this.state.loading) {
      return (
        <div className="App loader">
          <Loader
            type="Puff"
            color="green"
            height={100}
            width={100}
            timeout={5000}
          />
        </div>
      )
    }
    else {
      return (
        <div className="App">

          <div className="header">
            <h1 className="title">Demo Application</h1>
            <div className="links"></div>
          </div>

          <button
            class="button button1"
            onClick={() =>
              window.open(
                `${process.env.REACT_APP_API_URL}/generatePdfForDashboard`,
                "_blank"
              )
            }
          >
            Generate PDF
          </button>

          <div className="barchart">
            <Bar
              width={50}
              height={20}
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
          </div>

          <h2>Countries bordered by China</h2>
          <div className="section">
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
        </div>
      );
    }
  }

  openInNewTab = (url) => {
    console.log("yyy");
    window.open(url, "_blank");
  };
}
