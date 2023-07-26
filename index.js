const express = require("express");
const app = express();
const Razorpay = require("razorpay");

// Create a new instance of Razorpay with your API credentials
const razorpayInstance = new Razorpay({
  key_id: "<your_razorpay_key_id>",
  key_secret: "<your_razorpay_key_secret>",
});

app.use(express.static(__dirname));

app.post("/create-order", async (req, res) => {
  try {
    const { amount, payment_method, upi_id } = req.body;

    // Create order on Razorpay
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // Amount should be in paise, so multiply by 100
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 1
    });

    // Set payment method specific options
    const options = {
      key: razorpayInstance.options.key_id,
      amount: order.amount,
      order_id: order.id,
      name: "Your Company Name",
      description: "Test payment",
      image: "https://example.com/your_logo.png",
      currency: order.currency,
      handler: function (response) {
        res.json({ payment_id: response.razorpay_payment_id });
      },
      modal: {
        ondismiss: function () {
          res.status(400).json({ error: "Payment cancelled" });
        }
      }
    };

    if (payment_method === "UPI") {
      options.method = "upi";
      options.upi = {
        flow: "collect",
        vpa: upi_id
      };
    } else if (payment_method === "Card") {
      options.method = "card";
    } else if (payment_method === "Netbanking") {
      options.method = "netbanking";
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    res.json({ options });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
