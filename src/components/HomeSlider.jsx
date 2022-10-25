import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { useNavigate } from "react-router";

const HomeSlider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listing = [];
      querySnap.forEach((doc) => {
        return listing.push({ id: doc.id, data: doc.data() });
      });
      //   console.log(listing);
      setListings(listing);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) return <Spinner />;
  if (listings.length === 0) return <></>;
  return (
    listings && (
      <>
        <Swiper
          // install Swiper modules
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {listings.map((listing) => (
            <SwiperSlide
              key={listing.id}
              onClick={() =>
                navigate(`/category/${listing.data.type}/${listing.id}`)
              }
            >
              <div
                className="relative overflow-hidden h-[400px] w-full"
                style={{
                  background: `url(${listing.data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
              <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {listing.data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {listing.data.discountedPrice ?? listing.data.regularPrice}
                {listing.data.type === "rent" && " /month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
        ;
      </>
    )
  );
};

export default HomeSlider;
