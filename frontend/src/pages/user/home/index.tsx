import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import "./Home.css";
import Slide1 from "../../../assets/slide1.png";
import Slide2 from "../../../assets/slide2.png";
import iapp from "../../../assets/iapp.png"; 
import appointment from "../../../assets/appointment.PNG";
import doctor from "../../../assets/doctorg.png"; 

import { useEffect, useState } from "react";
import { Carousel, Spin } from "antd";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userId");
  console.log("userId", token);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token;

  const banners = [
  {
    image: Slide1, // or path from public folder
    title: "Bright Teeth, Light on Your Wallet!",
    description: "Get 20% off teeth whitening all month long!",
  },
  {
    image: Slide2,
    title: "Free Oral Health Checkup",
    description: "Free for the first 100 people who register in advance",
  },
  // {
  //   image: "/images/banner3.png",
  //   title: "โปรโมชั่นจัดฟัน",
  //   description: "จ่ายมัดจำเพียง 999 บาท เริ่มจัดฟันได้ทันที",
  // },
  // {
  //   image: "/images/banner4.png",
  //   title: "โปรฟันน้ำนม",
  //   description: "พิเศษสำหรับเด็ก 3-12 ปี ลดทันที 30%",
  // },
  // {
  //   image: "/images/banner5.png",
  //   title: "แคมเปญคนรักฟัน",
  //   description: "แนะนำเพื่อนมารักษา รับส่วนลดทั้งคู่!",
  // },
];


  useEffect(() => {
    // Delay แสดงผล 0.5 วิ
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {/* <Carousel autoplay className="carousel-container">
        <div>
          <img className="carousel-image1" src={Slide1} alt="promo1" />
        </div>
        <div>
          <img className="carousel-image1" src={Slide2} alt="promo2" />
        </div>
      </Carousel> */}
      <Carousel autoplay>
        {banners.map((banner, index) => (
          <div className="carousel-slide" key={index}>
            <img src={banner.image} alt={`Promo ${index}`} />
            <div className="carousel-overlay">
              <h3>{banner.title}</h3>
              <p>{banner.description}</p>
            </div>
          </div>
        ))}
      </Carousel>

      {!isLoggedIn && (
        <div className="home-warning">
          <p>Please login first to access features.</p>
        </div>
      )}

      <div className={`home-container ${!isLoggedIn ? "disabled" : ""}`}>
       
        <div
          className="card purple"
          onClick={() => isLoggedIn && navigate("/appointments", { state: { userId: token } })}
        >
          <img src={appointment} alt="calendar" />
          <div>APPOINTMENT</div>
        </div>

        <div
          className="card dark"
          onClick={() => isLoggedIn && navigate("/doctorlist")}
        >
          <img src={doctor} alt="doctor" />
          <div>DOCTOR</div>
        </div>

        <div
          className="card list"
          onClick={() => isLoggedIn && navigate("/my-appointments", { state: { userId: token } })}
        >
          <img src={iapp} alt="calendar" />
          <div>MY APPOINTMENTS</div>
        </div>

      </div>
    </div>
  );
};

export default Home;
