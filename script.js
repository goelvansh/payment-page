function toggleUPIField(show) {
    const upiGroup = document.querySelector(".upi-group");
    if (show) {
      upiGroup.style.display = "block"; //show upi id input only if user selects upi
    } else {
      upiGroup.style.display = "none";
    }
  }
  
  function handlePayment() {
    const form = document.querySelector(".payment-form");
    const formData = new FormData(form);
    const paymentMethod = formData.get("payment_method");
    const amount = formData.get("amount");
    
    if (Number(amount) <= 0) {
      alert("Amount should be greater than zero.");
      return;
    }
  
    if (paymentMethod === "UPI") {
      const upi_id = formData.get("upi_id");
      createRazorpayOrder(amount, "UPI", upi_id);
    } else if (paymentMethod === "Card" || paymentMethod === "Netbanking") {
      // Handle other payment methods (Card, Netbanking) here
      alert("Other payment methods are not implemented in this example.");
    } else {
      alert("Please select a payment method.");
    }
  }
  
  function createRazorpayOrder(amount, method, upi_id) {
    // Send the payment details to the server
    fetch("/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        payment_method: method,
        upi_id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the server response and open Razorpay payment window
        const options = data.options;
        options.handler = function (response) {
          // Handle the success payment response here
          alert("Payment successful. Payment ID: " + response.razorpay_payment_id);
        };
  
        options.modal.ondismiss = function () {
          // Handle the payment failure or window close here
          alert("Payment failed or window closed.");
        };
  
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch or payment process
        alert("Error occurred: " + error.message);
      });
  }
  
