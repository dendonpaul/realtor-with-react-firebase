import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeSlider from "../components/HomeSlider";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";

const Home = () => {
  //Offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        //get reference
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);

        const listing = [];
        querySnap.forEach((doc) => {
          listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listing);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  //Rent listing
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        //get reference
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);

        let listing = [];
        querySnap.forEach((doc) =>
          listing.push({
            id: doc.id,
            data: doc.data(),
          })
        );
        setRentListings(listing);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRentListings();
  }, []);
  //Sale listing
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    const fetchSaleListings = async () => {
      try {
        //get reference
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);

        const listing = [];
        querySnap.forEach((doc) => {
          listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listing);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSaleListings();
  }, []);
  return (
    <div>
      <HomeSlider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Rent lsiting */}
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for Rent
            </h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Sale lsiting */}
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Recent Places for Sale
            </h2>
            <Link to="/category/sale">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                Show more Places for Sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
