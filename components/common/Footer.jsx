import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { getFirstPage } from "@/lib/api/api"; // Import the API function

function Footer() {
  // State to store API data
  const [presentationText, setPresentationText] = useState("");
  const [address, setAddress] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [installLink, setInstallLink] = useState("");

  // Effect to fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFirstPage(); // Fetch data from the API
        setPresentationText(data.presentation_text || "");
        setAddress(data.address || "");
        setShowAddress(data.show_address || false);
        setEmail(data.email || "");
        setPhoneNumber(data.phone_number || "");
        setTelegramLink(data.telegram_link || "");
        setInstallLink(data.install_link)
      } catch (error) {
        console.error("Error fetching data:", error);
        setPresentationText("");
        setAddress("");
        setShowAddress(false);
        setEmail("");
        setPhoneNumber("");
        setTelegramLink("");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col font-mitra md:flex-row-reverse items-center lg:items-start justify-center lg:justify-between pt-10 px-6 lg:pr-[200px] w-full bg-[#2A2B2D] text-white space-y-8 lg:space-y-0 h-auto lg:h-[350px]">
      {/* Right Side - Description and Location */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 text-right select-none">
        <div className="flex items-center justify-end space-x-3 text-3xl">
          <h1 className="flex gap-2">
            <span className="text-secondery">روبه راه</span>
            <span>خانواده</span>
          </h1>
          <img
            src="logo-white.png"
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex flex-col text-xl items-end leading-relaxed">
          <span className="md:w-90">{presentationText}</span>
        </div>
        {showAddress && address && (
          <div className="flex flex-row-reverse items-center gap-2 text-md">
            <FaLocationDot />
            <span>{address}</span>
          </div>
        )}
      </div>

      {/* Left Side - Contact Info */}
      <div className="w-full lg:w-1/2 flex flex-col items-end gap-4 text-md mb-4">
        <h1 className="text-2xl lg:text-2xl select-none">ارتباط با ما</h1>
        <div className="flex flex-row-reverse gap-3 items-center">
          <FaPhoneVolume className="text-xl" />
          <span>{phoneNumber}</span>
        </div>
        <div className="flex flex-row-reverse gap-3 items-center">
          <MdOutlineEmail className="text-2xl" />
          <span>{email}</span>
        </div>
        <div className="flex flex-row-reverse gap-3 items-center">
          <FaInstagram className="text-2xl" />
          <span>{installLink}</span>
        </div>
        <div className="flex flex-row-reverse gap-3 items-center">
          <FaTelegramPlane className="text-2xl" />
          <span>{telegramLink}</span>
        </div>
      </div>
      <div>
      <img
            src="logo-white.png"
            alt="Logo"
            className="h-40 w-40  mt-8 ml-40 max-lg:hidden rounded-lg"
          />
      </div>
    </div>
  );
}

export default Footer;