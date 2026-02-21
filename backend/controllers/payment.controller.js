const axios = require("axios");
const Booking = require("../models/booking.model");

const CASHFREE_URL = "https://sandbox.cashfree.com/pg/orders"; // Sandbox URL

const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("customer");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const orderId = `ORDER_${Date.now()}_${bookingId}`;
    const amount = booking.price;

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: booking.customer._id.toString(),
        customer_email: booking.customer.email,
        customer_phone: booking.customer.phone || "9999999999",
      },
      order_meta: {
        return_url: `http://localhost:${process.env.PORT || 7000}/api/payments/verify?order_id={order_id}`,
      },
      order_note: `Payment for Booking ${bookingId}`,
    };

    const headers = {
      "x-client-id": process.env.TEST_CASHFREE_APP_ID,
      "x-client-secret": process.env.TEST_CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
    };

    console.log("Sending payload to Cashfree:", JSON.stringify(payload, null, 2));
    console.log("Using Headers:", JSON.stringify({...headers, "x-client-secret": "***"}, null, 2));

    let response;
    try {
        response = await axios.post(CASHFREE_URL, payload, { headers });
        console.log("Cashfree Success Response:", response.data);
    } catch (axiosError) {
        console.error("Axios Call Failed:");
        if (axiosError.response) {
            console.error("Status:", axiosError.response.status);
            console.error("Data:", JSON.stringify(axiosError.response.data, null, 2));
        } else {
            console.error("Message:", axiosError.message);
        }
        throw axiosError; // Re-throw to be caught by outer catch
    }
    
    // Save order_id to booking if needed, or just return payment_session_id
    res.json(response.data);

  } catch (error) {
    console.error("Final Catch Block - Error creating order:", error.message);
    res.status(500).json({ 
      message: "Payment initiation failed", 
      error: error.response ? error.response.data : error.message 
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { order_id } = req.query;

    const headers = {
        "x-client-id": process.env.TEST_CASHFREE_APP_ID,
        "x-client-secret": process.env.TEST_CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
    };

    const response = await axios.get(`${CASHFREE_URL}/${order_id}`, { headers });
    const orderStatus = response.data.order_status;

    // In a real app, you would check for "PAID". 
    // For this demo, we treat "ACTIVE" (created) as success to simulate payment flow without redirection.
    if (orderStatus === "PAID" || orderStatus === "ACTIVE") {
        const parts = order_id.split("_");
        const bookingId = parts[2];

        await Booking.findByIdAndUpdate(bookingId, { status: "accepted" }); // Payment confirmed → provider must mark complete after delivering
        // Redirect to Frontend Success Page
        // Assuming Frontend runs on localhost:5173 (standard Vite port)
        // In production, use process.env.FRONTEND_URL
        const frontendUrl = "http://localhost:5173"; 
        res.redirect(`${frontendUrl}/payment/success?bookingId=${bookingId}`);
    } else {
        const frontendUrl = "http://localhost:5173"; 
        res.redirect(`${frontendUrl}/payment/failed?bookingId=${order_id.split("_")[2]}`);
    }

  } catch (error) {
    console.error("Cashfree Verification Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

const createPlanOrder = async (req, res) => {
  try {
    const { amount, name, email, phone, plan } = req.body;

    if (!amount || !email || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = `PLAN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: email.replace(/[^a-zA-Z0-9]/g, "_"), // Simple ID from email
        customer_email: email,
        customer_phone: phone || "9999999999",
        customer_name: name
      },
      order_meta: {
        return_url: `http://localhost:5173/register?order_id={order_id}&plan=${plan}`, // Redirect back to register
      },
      order_note: `${plan.toUpperCase()} Plan Subscription`,
    };

    const headers = {
      "x-client-id": process.env.TEST_CASHFREE_APP_ID,
      "x-client-secret": process.env.TEST_CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
    };

    console.log("Plan Payment Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(CASHFREE_URL, payload, { headers });
    res.json(response.data);

  } catch (error) {
    const errorDetails = error.response ? error.response.data : error.message;
    console.error("Cashfree API Failure:", errorDetails);
    res.status(500).json({ 
      message: "Cashfree initiation failed", 
      error: errorDetails
    });
  }
};

module.exports = { createOrder, verifyPayment, createPlanOrder };
