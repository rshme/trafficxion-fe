"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Header from "../Components/Header";
import ParkCard from "../Components/ParkCard";
import parking from "../data/parkings.js";

const TabsComponent = ({ activeTab, setActiveTab }) => {
  return (
    <div className="my-2">
      <ul className="nav nav-tabs mb-3 justify-content-center">
        <li className="nav-item">
          <a
            className={`nav-link ${
              activeTab === "car"
                ? "active bg-primary text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => setActiveTab("car")}
          >
            Car
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${
              activeTab === "motorcycle"
                ? "active bg-primary text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => setActiveTab("motorcycle")}
          >
            Motor
          </a>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "car" && (
          <div className="tab-pane fade show active">
            <h2>Car Content</h2>
            <p>This is the content for the Car tab.</p>
          </div>
        )}
        {activeTab === "motorcycle" && (
          <div className="tab-pane fade show active">
            <h2>Motor Content</h2>
            <p>This is the content for the Motor tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Page = ({ searchParams }) => {
  const [city, setCity] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [activeTab, setActiveTab] = useState("car");
  const result = React.use(searchParams);
  useEffect(() => {
    setCity(result.city);
    setLocationId(result.locationId);
  }, [result]);

  return (
    <>
      <Header content={"Area Parkir di"} city={city} />

      <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="row justify-content-start">
        {parking ? (
          parking
            .filter((x) => x.location_id == locationId)
            .filter((x) => x.type == activeTab)
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
        ) : (
          <p>loadingg</p>
        )}
      </div>
    </>
  );
};

export default Page;
