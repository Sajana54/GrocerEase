import "dotenv/config";
import axios from "axios"; // ensure axios is imported
import Order from "../models/Order.js";
import Product from "../models/Product.js";
console.log("Khalti Secret Key:", process.env.KHALTI_SECRET_KEY);

// INITIATE PAYMENT
export const paymentInit = async (req, res) => {
  const { amount, name, email, phone } = req.body;

  if (!amount || !name || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payload = {
      return_url: "http://localhost:5173/khaltiverify", // ✅ make sure this matches frontend route
      website_url: "http://localhost:5173", // or your production domain
      amount, // already in paisa
      purchase_order_id: "order-" + Date.now(),
      purchase_order_name: "Product Purchase",
      customer_info: { name, email, phone },
    };

    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    res.status(200).json({
      payment_url: khaltiRes.data.payment_url,
      pidx: khaltiRes.data.pidx,
    });
  } catch (error) {
    console.error(
      "Khalti initiation error:",
      error?.response?.data || error.message
    );
    res.status(500).json({
      error: error?.response?.data || "Payment initiation failed",
    });
  }
};

//Verify Payment

export const paymentVerification = async (req, res) => {
  const { pidx, items, address, userId } = req.body;

  if (!pidx || !items || !address || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const verifyRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    const isSuccess = verifyRes.data.status === "Completed";
    if (!isSuccess) {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }

    //Calculate amount server-side
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02); // Add 2% tax

    // ✅ Save order
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: true,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed.",
    });
  } catch (error) {
    console.error(
      "Khalti verification error:",
      error?.response?.data || error.message
    );
    res.status(500).json({
      error: error?.response?.data || "Payment verification failed",
    });
  }
};
