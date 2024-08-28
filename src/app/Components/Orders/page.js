"use client";
import React, { use } from "react";
import style from "./order.module.scss";
import { useState, useEffect } from "react";
import { fetchOrdersDataDB } from "./orderFetchFunction";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Scroller from "@/app/Scroller/scroller";
import MiniScroller from "../miniScroller/page";
import { ToastContainer, toast } from "react-toastify";


function OrdersPage() {
  const [orderData, setOrderData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading,setLoading] = useState(true);
  
  const path = usePathname();
  
  const router = useRouter();
  
  if(userData.length >= 1){
    setTimeout(()=>{
      setLoading(false)  
    },100) 
 }else if(userData.length === 0){
       setTimeout(()=>{
          setLoading(false)
       },5000)    
  }
  

  const fetchOrdersData = async () => {
    let getData = await fetchOrdersDataDB();
    if(getData.result.success){
      console.log(getData)
      setOrderData(getData.result);
    }
    return;
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);
  
  useEffect(() => {
    const fetchOrders = async () => {
      let token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      } else {
        try {
          let req = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST_NAME}/api/Orders`,
            { token: token }
          );

          if (req.data.success){
            setUserData(req.data.result);
          }
          return req;
        } catch (error) {
         return;
        }
      }
    };
    fetchOrders();
  }, []);

  
  const handleUrl = (url)=>{
    setLoading(true)
    if(path === url){
        router.push(path);
        setLoading(false);
     }
     router.push(url)
}  
     
   
  const handleDeleteOrder = async (id)=>{
    toast.success('Wait...', {
      position: "top-right",
      autoClose: 1400,
      theme: "light",
    }); 
    try {
      let req =  await axios.delete(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Orders/${id}`)
   
      if(req.data.success){
        toast.success('order Delete Successfully', {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });  
       }else{  
        toast.error('OOps!, something went wrong.', {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      }
       return;
    } catch (err) {
       toast.error('OOps!, something went wrong.', {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
      });
       return;
    }  
}

   
  return (
    <div className={style.myOrders}>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    {loading ? (
        <div className={style.loading}>
          <MiniScroller/>
        </div>
      ) : userData && userData.length === 0 ? (
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          No Orders Available <Link style={{ color: "blue" }} href="/">Order Now</Link>
        </h1>
      ) : (<div className={style.ordersPage}>
      <h3>Orders page</h3>
      <div className={style.orderTable}>
      <table className={style.order_table}>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Email</th>
          <th>Amount</th>
          <th>Details Link</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {userData &&  userData.map((order ,i) => { 
          return  <tr key={order._id}>
            <td>{order.orderId}</td>
            <td>{order.email.slice(0,9)}</td>
            <td>₹{order.amount}</td>
            <td>
                <p onClick={()=>handleUrl(`/Components/Orders/${order._id}`)}>Details</p>
            </td>
            <td onClick={()=>handleDeleteOrder(order._id)}><button>Delete</button></td>
          </tr>
           })}
      </tbody>
    </table>
      </div>
    </div>)}
</div>  );
}

export default OrdersPage;
