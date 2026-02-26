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
          height: 400,
          type: "bar",
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
          background: "transparent",
        },
        colors: ["#656ED3"],
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: "60%",
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#1a1a1a"],
          },
        },
        grid: {
          borderColor: "#f0f0f0",
          strokeDashArray: 4,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
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
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: "#666666",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#666666",
              fontSize: "12px",
              fontWeight: 500,
            },
            formatter: function (val) {
              return val;
            },
          },
        },
        title: {
          show: false,
        },
        tooltip: {
          theme: "light",
          style: {
            fontSize: "12px",
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
          height: 400,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
          background: "transparent",
        },
        colors: ["#27ae60"],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return "$" + val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#1a1a1a"],
          },
        },
        grid: {
          borderColor: "#f0f0f0",
          strokeDashArray: 4,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
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
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: "#666666",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#666666",
              fontSize: "12px",
              fontWeight: 500,
            },
            formatter: function (val) {
              return "$" + val;
            },
          },
        },
        title: {
          show: false,
        },
        tooltip: {
          theme: "light",
          style: {
            fontSize: "12px",
          },
        },
        stroke: {
          curve: "smooth",
          width: 3,
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
          <section className="admin-dashboard-section">
            <div className="adminsection">
              <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back! Here's what's happening with your platform.</p>
              </div>
              <div className="dashboard-stats">
                <div className="stat-card stat-card-users">
                  <div className="stat-card-icon">
                    <FaUserAlt />
                  </div>
                  <div className="stat-card-content">
                    <p className="stat-card-label">Total Users</p>
                    <h3 className="stat-card-value">{this.state.totalUser || 0}</h3>
                  </div>
                </div>
                <div className="stat-card stat-card-blogs">
                  <div className="stat-card-icon">
                    <BsFillPostcardFill />
                  </div>
                  <div className="stat-card-content">
                    <p className="stat-card-label">Total Blogs</p>
                    <h3 className="stat-card-value">{this.state.totalBlog || 0}</h3>
                  </div>
                </div>
                <div className="stat-card stat-card-ads">
                  <div className="stat-card-icon">
                    <RiAdvertisementFill />
                  </div>
                  <div className="stat-card-content">
                    <p className="stat-card-label">Total Advertisements</p>
                    <h3 className="stat-card-value">{this.state.totalAdvertisement || 0}</h3>
                  </div>
                </div>
                <div className="stat-card stat-card-payments">
                  <div className="stat-card-icon">
                    <BsFillPostcardFill />
                  </div>
                  <div className="stat-card-content">
                    <p className="stat-card-label">Total Payments</p>
                    <h3 className="stat-card-value">${this.state.Earning || 0}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog chart */}
            <div className="dashboard-chart">
              <div className="chart-header">
                <h2 className="chart-title">Monthly Blogs</h2>
                <p className="chart-subtitle">Blog creation trends over the past year</p>
              </div>
              <div className="chart-container">
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="bar"
                  height={400}
                />
              </div>
            </div>

            {/* Payment chart */}
            <div className="dashboard-chart">
              <div className="chart-header">
                <h2 className="chart-title">Monthly Payments</h2>
                <p className="chart-subtitle">Revenue trends from advertisements</p>
              </div>
              <div className="chart-container">
                <ReactApexChart
                  options={this.state.paymentOptions}
                  series={this.state.paymentSeries}
                  type="area"
                  height={400}
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
