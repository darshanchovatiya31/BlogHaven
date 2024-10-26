import React, { useEffect, useState } from "react";
import "./Invoice.css"; // Custom styles if you need to add any
import { Link, useParams } from "react-router-dom";
import { BaseUrl } from "../../Service/Url";

const Invoice = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hide, sethide] = useState(false)
    const token = localStorage.getItem("token");

    const { adId } = useParams();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`${BaseUrl}/user/invoicesingle/${adId}`, {
                    method: "GET",
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  });

                if (!response.ok) {
                    throw new Error('Failed to fetch invoice');
                }
                const data = await response.json();
                setInvoiceData(data.data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [adId]);

    const handelhide = () => {
        window.print()
        sethide(true)
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const paymentDetails = invoiceData.payment.length > 0 ? invoiceData.payment[0] : null;

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <img
          src={invoiceData.userId?.profile || "fallback_image_url.jpg"}
          alt="Profile"
          className="invoice-profile"
        />
        <div className="invoice-header-details">
          <h1>Blog Haven</h1>
          <p className="invoice-date">
            Date: {new Date(invoiceData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="invoice-body">
        <div className="invoice-details">
          <h2>Customer Details</h2>
          <table className="invoice-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{invoiceData.userId?.fname}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{invoiceData.userId?.email}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{paymentDetails.customer_details.customer_phone}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoice-details">
          <h2>Advertisement Details</h2>
          <table className="invoice-table">
            <tbody>
              <tr>
                <th>Order ID</th>
                <td>{paymentDetails.order_id}</td>
              </tr>
              <tr>
                <th>Title</th>
                <td>{invoiceData.title}</td>
              </tr>
              <tr>
                <th>Duration</th>
                <td>{invoiceData.ad_duration} days</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>₹{invoiceData.price}</td>
              </tr>
              <tr>
                <th>Order Status</th>
                <td>{paymentDetails.order_status}</td>
              </tr>
              <tr>
                <th>Order Date</th>
                <td>{new Date(paymentDetails.created_at).toLocaleDateString("en-IN")}</td>
              </tr>
              <tr>
                <th>expiry Date</th>
                <td>{new Date(invoiceData.lastTime).toLocaleDateString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div className="text-end">
        <button
          className="btn btn-success print-hide"
          onClick={() => window.print()}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Invoice;
