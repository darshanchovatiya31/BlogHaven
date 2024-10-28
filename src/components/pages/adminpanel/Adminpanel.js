import React, { Component } from "react";
import "../adminpanel/Adminpanel.css";
import { FaUserAlt } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import AdminHeader from "./AdminHeader";
import { BsFillPostcardFill } from "react-icons/bs";
import { BaseUrl } from "../../Service/Url";
import { RiAdvertisementFill } from "react-icons/ri";
import { Navigate } from "react-router-dom";

class Adminpanel extends Component {
  async componentDidMount() {
    try {
      const response = await fetch(`${BaseUrl}/admin/chat/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        this.setState((prevState) => ({
          series: [
            {
              ...prevState.series[0],
              data: data.data,
            },
          ],
        }));
      } else {
        console.error("Error fetching blog data:", data.message);
      }

      // Fetch dashboard data (users, blogs, ads, earnings)
      const dashboardResponse = await fetch(`${BaseUrl}/admin/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });
      const dashboardData = await dashboardResponse.json();

      if (dashboardData.success) {
        this.setState({
          totalUser: dashboardData.data.TotalUser,
          totalBlog: dashboardData.data.TotalBlog,
          totalAdvertisement: dashboardData.data.TotalAdvertisement,
          Earning: dashboardData.data.Earning,
        });
      } else {
        if (data.message === "TokenExpiredError: jwt expired") {
          localStorage.clear();
          Navigate("/login");
        }
      }

      // Fetch payment data
      const paymentResponse = await fetch(
        `${BaseUrl}/admin/chat/dashboard/payment`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        this.setState((prevState) => ({
          paymentSeries: [
            {
              ...prevState.paymentSeries[0],
              data: paymentData.data, // Set payment data
            },
          ],
        }));
      } else {
        console.error("Error fetching payment data:", paymentData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  constructor(props) {
    super(props);

    // Blog chart options
    this.state = {
      series: [
        {
          name: "Blogs",
          data: [], // Data for blogs
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
          position: "bottum",
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
        responsive: [
          {
            breakpoint: 1000,
            options: {
              chart: {
                height: 300,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
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
            breakpoint: 600,
            options: {
              chart: {
                height: 250,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
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

      // Payment chart options
      paymentSeries: [
        {
          name: "Payments",
          data: [], // Data for payments
        },
      ],
      paymentOptions: {
        chart: {
          type: "area",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return "$" + val; // Add $ sign to values
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
          position: "bottum",
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
              return "$" + val; // Add $ sign to y-axis values
            },
          },
        },
        title: {
          text: "Monthly Payments",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {
              chart: {
                height: 300,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
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
            breakpoint: 600,
            options: {
              chart: {
                height: 250,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
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
            <AdminHeader />
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
                <div className="paneldata d-flex align-items-center">
                  <div className="paneldata_icon">
                    <RiAdvertisementFill />
                  </div>
                  <div>
                    <p className="mb-0">Total Advertisements</p>
                    <h4 className="mb-0">{this.state.totalAdvertisement}</h4>
                  </div>
                </div>
                <div className="paneldata d-flex align-items-center">
                  <div className="paneldata_icon">
                    <BsFillPostcardFill />
                  </div>
                  <div>
                    <p className="mb-0">Total Payments</p>
                    <h4 className="mb-0">${this.state.Earning}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog chart */}
            <div className="daigram">
              <h2>Monthly Blogs</h2>
              <div id="chart">
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="bar"
                  height={650}
                />
              </div>
            </div>

            {/* Payment chart */}
            <div className="daigram">
              <h2>Monthly Payments</h2>
              <div id="chart">
                <ReactApexChart
                  options={this.state.paymentOptions}
                  series={this.state.paymentSeries}
                  type="area"
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
