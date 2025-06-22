import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  console.log(saleListing);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const response = await fetch("/api/listing/get?offer=true&limit=4");
        const jsonData = await response.json();
        setOfferListing(jsonData);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchRentListing = async () => {
      try {
        const response = await fetch("/api/listing/get?type=rent&limit=4");
        const jsonData = await response.json();
        setRentListing(jsonData);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const response = await fetch("/api/listing/get?type=sale&limit=4");
        const jsonData = await response.json();
        setSaleListing(jsonData);
      } catch (e) {
        console.log(e);
      }
    };

    // Call all fetches
    fetchOfferListing();
    fetchRentListing();
    fetchSaleListing();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col gap-6 py-28 px-6 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm ">
          Shaheen Estate is the best place for your next perfect place to live
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          className="text-blue-800 font-bold hover:underline text-xs sm:text-sm"
          to={"/search"}
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper for Offers */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing, index) => (
            <SwiperSlide key={index}>
              <img
                src={listing?.imageUrls?.[0] || "/fallback.jpg"}
                alt={`Slide ${index}`}
                className="w-full h-[450px] object-cover"
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* Offers */}
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentListing && rentListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale */}
        {saleListing && saleListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
