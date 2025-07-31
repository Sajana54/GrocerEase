import Order from "../models/Order.js";
import Product from "../models/Product.js";

//place order cod: /api/order/cod
export const placeOrderCOD = async (req,res)=>{
    try{
        const { items, address} = req.body;
        const userId=req.userId
        if(!address || items.length ===0){
return res.json({success: false, message: "Invalid data"})
        }
        //calculate amount using items
        let amount =await items.reduce(async (acc, item)=>{
           const product = await Product.findById(item.product);
           return (await acc) + product.offerPrice * item.quantity;
        }, 0)
        

        //add tax charge(2%)
        amount += Math.floor(amount *0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });
        return res.json({success: true, message: "order placed successfully"})
    }
    catch(error){
return res.json ({success: false, message: error.message});
    }
};
// place order for Khalti (online payment)
export const placeOrderKhalti = async (req, res) => {
  try {
    const { items, address, amount } = req.body; 
    // paymentDetails can include txn id, etc. for reference

    const userId = req.userId;

    if (!address || !items?.length || !amount) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate amount server side to verify client sent correct amount
    let calculatedAmount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    calculatedAmount += Math.floor(calculatedAmount * 0.02); // add 2% tax

    // Verify that client sent amount matches calculated amount (basic check)
    if (calculatedAmount !== amount) {
      return res.json({ success: false, message: "Amount mismatch" });
    }

    // Create the order with paymentType Online and mark as paid
    await Order.create({
      userId,
      items,
      amount: calculatedAmount,
      address,
      paymentType: "Online",
      isPaid: true,
    });

    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//get orders by user id : /api/order/user
export const getUserOrders = async (req, res)=>{
    try{
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    }
    catch(error){
res.json ({success: false, message: error.message});
    }
}

//get all orders (for seller /admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try{
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    }
    catch(error){
res.json ({success: false, message: error.message});
    }
}