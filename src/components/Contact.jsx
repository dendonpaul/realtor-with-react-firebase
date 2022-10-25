import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

const Contact = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get Landlord details");
      }
    };
    getLandlord();
  }, [userRef]);
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p className="">
            Contact the {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="mt-6 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600"
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-900 transition duration-200 ease-in-out w-full text-center mb-6"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
