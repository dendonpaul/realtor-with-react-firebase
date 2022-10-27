import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Category = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastFetchListing, setLastFetchListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(2)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);

        const listing = [];
        querySnap.forEach((doc) =>
          listing.push({
            id: doc.id,
            data: doc.data(),
          })
        );

        setListings(listing);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  const params = useParams();

  const fetchMoreListings = async () => {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListing),
        limit(2)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      const listing = [];
      querySnap.forEach((doc) =>
        listing.push({
          id: doc.id,
          data: doc.data(),
        })
      );

      setListings((prevState) => [...prevState, ...listing]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center">
        Places for
        {" " +
          params.categoryName.charAt(0).toUpperCase() +
          params.categoryName.slice(1)}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchListing && (
            <div className="flex justify-center items-center mt-5">
              <button
                className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded duration-200 transition ease-in-out"
                onClick={fetchMoreListings}
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        "There are no current offers"
      )}
    </div>
  );
};

export default Category;
