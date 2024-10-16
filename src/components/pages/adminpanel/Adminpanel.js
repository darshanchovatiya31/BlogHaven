import React, { Component } from "react";
import "../adminpanel/Adminpanel.css";
import { FaUserAlt } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import AdminHeader from "./AdminHeader";
import { BsFillPostcardFill } from "react-icons/bs";
import { BaseUrl } from "../../Service/Url";

class Adminpanel extends Component {

  async componentDidMount() {
    try {
      const response = await fetch(`${BaseUrl}/admin/chat/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           authorization:`Bearer ${localStorage.getItem("admintoken")}`
        },
      });
      const data = await response.json();
      
      if (data.success) {
        // Update the series data with the monthly blog count
        this.setState((prevState) => ({
          series: [
            {
              ...prevState.series[0],
              data: data.data, // Set the data from the API
            },
          ],
        }));
      } else {
        console.error("Error fetching data:", data.message);
      }


      const dashboardResponse = await fetch(`${BaseUrl}/admin/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           authorization:`Bearer ${localStorage.getItem("admintoken")}`
        },
      });
      const dashboardData = await dashboardResponse.json();

      if (dashboardData.success) {
        this.setState({
          totalUser: dashboardData.data.TotalUser,
          totalBlog: dashboardData.data.TotalBlog,
        });
      } else {
        console.error("Error fetching dashboard data:", dashboardData.message);
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Blogs",
          data: [],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        title: {
          text: "Monthly Blogs",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
        // Responsive behavior
        responsive: [
          {
            breakpoint: 1000, // Screen width below 1000px
            options: {
              chart: {
                height: 300,
              },
              plotOptions: {
                bar: {
                  horizontal: true, // Switch to horizontal bars
                },
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
          {
            breakpoint: 600, // Screen width below 600px
            options: {
              chart: {
                height: 250,
              },
              plotOptions: {
                bar: {
                  horizontal: true, // Keep horizontal for mobile devices
                },
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: "8px",
                  },
                },
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <>
        <div className="adminpanel">
          <div className="admin_head">
          <AdminHeader/>
          </div>
          <section>
            <div className="adminsection">
              <h2 className="p-3 text-uppercase"> Dashboard</h2>
              <div className="d-flex gap-3 justify-content-around mb-5 flex-wrap">
                <div className="paneldata d-flex align-items-center">
                  <div className="paneldata_icon">
                    <FaUserAlt />
                  </div>
                  <div>
                    <p className="mb-0">Total Users</p>
                    <h4 className="mb-0">{this.state.totalUser}</h4>
                  </div>
                </div>
                <div className="paneldata d-flex align-items-center">
                  <div className="paneldata_icon">
                  <BsFillPostcardFill />
                  </div>
                  <div>
                    <p className="mb-0">Total Blogs</p>
                    <h4 className="mb-0">{this.state.totalBlog}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="daigram">
              {/* ApexChart content goes here */}
              <div id="chart">
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="bar"
                  height={650}
                />
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default Adminpanel;
