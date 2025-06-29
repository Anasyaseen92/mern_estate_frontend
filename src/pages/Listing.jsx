import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Contact from "../components/Contact";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { currentUser } = useSelector((store) => store.user);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`https://mern-estate-backend-pied.vercel.app/api/listing/get/${params.listingId}`);
        const jsonData = await response.json();
        console.log("Fetched listing:", jsonData); // ✅ Debug log

        if (jsonData.success == false) {
          console.log(jsonData.message);
          setError(jsonData.message);
          setLoading(false);
          return;
        }

        // ✅ Automatically detect correct image key
        const images =
          jsonData.imagesUrls || jsonData.imageUrls || jsonData.images || [];

        setListing({ ...jsonData, imagesUrls: images });
        setLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  return (
    <main>
      {loading && (
        <p className="text-2xl my-7 text-center font-bold">
          loading...
        </p>
      )}
      {error && (
        <p className="text-2xl my-7 text-center font-bold">
          something went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imagesUrls?.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt={`Slide ${index}`}
                  className="w-full h-[275px] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className="fixed top-[13%] right-[3%] z-10 border rounded-full
                     w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
          >
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-2 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p>
              <span className="text-black font-bold">Description-</span>
              {" " + listing.description}
            </p>

            <ul className="text-green-900 font-semibold text-sm gap-6 flex flex-wrap">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedRooms > 1
                  ? `${listing.bedRooms} beds`
                  : `${listing.bedRooms} bed`}
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathRooms > 1
                  ? `${listing.bathRooms} baths`
                  : `${listing.bathRooms} bath`}
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking" : "No Parking"}
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* ✅ FIXED: Safe comparison between userRef and _id */}
            {currentUser &&
              String(listing.userRef) !== String(currentUser.listingId) &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white
             uppercase p-3 rounded-lg hover:opacity-85"
                >
                  Contact landlord
                </button>
              )}

            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
