import React, {Component} from 'react';
import Chart from "react-apexcharts";
import Grid from '@material-ui/core/Grid';


class LevelTile extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            data:props.Data,
            series: [44, 55],
            options: {
                chart: {
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 135,
                        dataLabels: {
                            name: {
                                fontSize: '11px',
                            },
                            value: {
                                fontSize: '8px',
                            },
                            total: {
                                show: true,
                                label: 'Level',
                                formatter: function (w) {
                                    // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                    return w.level
                                }
                            }
                        }
                    }
                },
                labels: ['C/KWh', 'CO2'],
            }
        }
    }



    updateChart = () => {

        let chartBuffer = [];

        let x = {
            chart: {
                height: "100",
                width:"50px",
                type: 'radialBar'
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    dataLabels: {
                        name: {
                            fontSize: '11px',
                        },
                        value: {
                            fontSize: '8px',
                        },
                        total: {
                            show: true,
                            label: this.props.label,
                            formatter: function (w) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                console.log(w)
                                return '';
                                
                            }
                        }
                    }
                }
            },
            labels: [this.props.label],
            fill: {
                colors: [this.props.color],
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,

                    gradientToColors: [this.props.colorTo],
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            }
        };

        chartBuffer.push(



                    <Chart options={x} series={this.state.data} type="radialBar"  width={300} height={250}  />


        );

        this.setState({buff:chartBuffer})

    };


    componentDidMount() {
        this.updateChart();
    }

    render() {
        return (

                <h1>{this.state.buff}</h1>

        );
    }
}

export default LevelTile;