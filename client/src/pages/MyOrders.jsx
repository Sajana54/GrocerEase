// import { useEffect, useState } from "react";
// import { useAppContext } from "../context/AppContext";


// const MyOrders = () => {
//   const [myOrders, setMyOrders] = useState([]);
//   const { currency, axios , user} = useAppContext();

//   const fetchMyOrders = async () => {
//     try{
// const {data} = await axios.get('/api/order/user')
// if(data.success){
//   setMyOrders(data.orders)
// }
//     }catch(error){
// console.log(error);
//     }
//   };

//   // Function to calculate total for an order
//   const calculateOrderTotal = (items) => {
//     return items.reduce(
//       (total, item) =>{if (!item.product) return total;
//         return total + item.product.price * item.quantity;},
//       0
//     );
//   };

//   useEffect(() => {
    
//     if(user){
//       fetchMyOrders();
//         }
//   }, [user]);

//   return (
//     <div className="mt-12 pb-16">
//       <div className="flex flex-col items-end w-max mb-8">
//         <p className="text-2xl font-medium uppercase">My Orders</p>
//         <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full"></div>
//       </div>

//       {myOrders.map((order, index) => {
//         const totalAmount = calculateOrderTotal(order.items);

//         return (
//           <div
//             key={index}
//             className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
//           >
//             {/* Order summary */}
//             <p className="flex justify-between md:items-center text-[#4fbf8b] md:font-medium max-md:flex-col max-md:gap-2 mb-4">
//               <span>Order ID: {order._id}</span>
//               <span>Payment: {order.paymentType}</span>
//               <span>
//                 Total Amount: {currency}
//                 {totalAmount}
//               </span>
//             </p>

//             {/* Ordered items list */}
//             <div className="space-y-4">
//               {order.items.map((item, itemIndex) => (
//                 <div
//                   key={itemIndex}
//                   className="flex items-center gap-4 border-t border-gray-200 pt-4"
//                 >
//                   <img
//                     src={item.product.image[0]}
//                     alt={item.product.name}
//                     className="w-16 h-16 object-cover rounded border"
//                   />
//                   <div className="flex flex-col">
//                     <p className="font-medium text-gray-700">
//                       {item.product.name}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Quantity: {item.quantity}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Price: {currency}
//                       {item.product.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default MyOrders;
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to calculate total for an order
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => {
      if (!item.product) return total; // skip deleted product
      return total + item.product.price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-12 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full"></div>
      </div>

      {myOrders.map((order, index) => {
        const totalAmount = calculateOrderTotal(order.items);

        return (
          <div
            key={index}
            className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            {/* Order summary */}
            <p className="flex justify-between md:items-center text-[#4fbf8b] md:font-medium max-md:flex-col max-md:gap-2 mb-4">
              <span>Order ID: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>
                Total Amount: {currency}
                {totalAmount}
              </span>
            </p>

            {/* Ordered items list */}
            <div className="space-y-4">
              {order.items.map((item, itemIndex) => {
                if (!item.product) {
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-4 border-t border-gray-200 pt-4 text-red-600"
                    >
                      <p className="italic">
                        This product has been removed from the store.
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-4 border-t border-gray-200 pt-4"
                  >
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium text-gray-700">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: {currency}
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;

