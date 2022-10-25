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
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const params = useParams();
  const auth = getAuth();
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
        <div className=" w-full">
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
          <ul className="mb-6 flex space-x-4 items-center lg:space-x-10 text-sm font-semibold">
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
          {listing.userRef != auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:shadow-lg hover:bg-blue-700 focus:bg-blue-900 w-full transition duration-200 ease-in-out"
                onClick={() => setContactLandlord(true)}
              >
                Contact Landlord
              </button>
            </div>
          )}

          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className=" w-full z-10 h-[200px] md:h-auto overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default Listing;
