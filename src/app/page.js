"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import location from "./data/locations.js";
import news from "./data/news.js";
import parking from "./data/parkings.js";

import Header from "./Components/Header";
import NewsCard from "./Components/NewsCard";
import ParkCard from "./Components/ParkCard";
const OpenStreetMap = dynamic(() => import("./Components/OpenStreetMap"), {
  ssr: false,
});

export default function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [data, setData] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const router = useRouter();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extract latitude and longitude from position.coords
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error("Error fetching data:", error));
        },

        (error) => console.error("Error getting user location:", error)
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    let city = data?.address?.suburb || "";
    setLocationId(
      location.filter((x) => x.slug == city.replace(" ", "-").toLowerCase())[0]
        ?.id
    );

  }, [data]);

  return (
    <>
      {data ? (
        <Header content={"Kamu Berada di "} city={data?.address?.suburb} />
      ) : null}
      {userLocation ? <OpenStreetMap position={userLocation} /> : null}
      <div className="section2 d-flex justify-content-between align-content-center mt-5">
        <p className="h3">
          <strong>
            Berita Lalu Lintas Hangat di <br />
            {data ? (
              <em className="text-primary">{data?.address?.suburb}</em>
            ) : null}
          </strong>
        </p>

        {data ? (
          <button
            className="border text-center align-content-center m-0 text-secondary text-decoration-none"
            type="button"
            onClick={() =>
              router.push(
                `/news?city=${data?.address?.suburb}&locationId=${locationId}`
              )
            }
          >
            Lihat semua &gt;
          </button>
        ) : null}
      </div>

      {/* News Section */}
      <div className="row justify-content-start">
        {locationId
          ? news
              .filter((x) => x.location_id == locationId)
              .slice(0, 3)
              .map((data, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <NewsCard
                    title={data.title}
                    time={data.published_at}
                    imageUrl={data.cover_url}
                  />
                </div>
              ))
          : null}
      </div>

      {/* Parking Section */}
      <div className="section2 d-flex justify-content-between align-content-center mt-5">
        <p className="h3">
          <strong>
            Area Parkir Terdekat di <br />
            {data ? (
              <em className="text-primary">{data?.address?.suburb}</em>
            ) : null}
          </strong>
        </p>

        {data ? (
          <button
            className="border text-center align-content-center m-0 text-secondary text-decoration-none"
            type="button"
            onClick={() =>
              router.push(
                `/park?city=${data?.address?.suburb}&locationId=${locationId}`
              )
            }
          >
            Lihat semua &gt;
          </button>
        ) : null}
      </div>
      <div className="row justify-content-around">
        {locationId
          ? parking
              .filter((x) => x.location_id == locationId)
              .slice(0, 3)
              .map((data, index) => (
                <div className="col-md-4" key={index}>
                  <ParkCard
                    isFull={data.booked_count >= data.total_space}
                    type={data.type}
                    totalSpace={data.total_space}
                    bookedSpace={data.booked_count}
                    title={data.name}
                    openTime={data.open_time}
                    pricePerHour={data.price_per_hour}
                    closeTime={data.close_time}
                    mapsUrl={data.maps_url}
                    imageUrl={[...data.images]}
                    publicTransportData={data.public_transport_nearby[0]}
                  />
                </div>
              ))
          : null}
      </div>
    </>
  );
}
