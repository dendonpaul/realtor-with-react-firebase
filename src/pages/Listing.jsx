import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(false);
  const params = useParams();
  // SwiperCore.use(Autoplay, Navigation, Pagination);
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  if (loading) return <Spinner />;
  console.log(listing);

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 4000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative overflow-hidden h-[400px] w-full"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 cursor-pointer bg-white border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLink(true);
          setTimeout(() => {
            setShareLink(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
        {shareLink && (
          <span className="absolute top-[50px] right-6 border-2 border-gray-400 whitespace-nowrap text-sm bg-gray-100 p-2">
            Link Copied!
          </span>
        )}
      </div>
      <div className="flex flex-col md:flex-row max-w-6xl m-4 lg:mx-auto p-4 rounded  bg-white lg:space-x-5">
        <div className=" w-full h-[200px] lg:h-[400px]">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " /month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 gap-2 font-semibold">
            <FaMapMarkerAlt className=" text-green-700" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md text-white text-center font-semibold shadow-md p-1">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-800 w-full max-w-[200px] rounded-md text-white text-center font-semibold shadow-md p-1">
                {listing.regularPrice - listing.discountedPrice + " discount"}
              </p>
            )}
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>{" "}
            {listing.description}
          </p>
          <ul className="flex space-x-4 items-center lg:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowraps">
              <FaBed className="text-lg mr-1" />
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : "1 bed"}
            </li>
            <li className="flex items-center whitespace-nowraps">
              <FaBath className="text-lg mr-1" />
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 bath"}
            </li>
            <li className="flex items-center whitespace-nowraps">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking Available" : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowraps">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
        </div>
        <div className="bg-blue-300 w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden"></div>
      </div>
    </main>
  );
};

export default Listing;
