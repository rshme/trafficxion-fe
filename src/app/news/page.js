"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Header from "../Components/Header";
import NewsCard from "../Components/NewsCard";
import news from "../data/news.js";

const Page = ({ searchParams }) => {
  const [city, setCity] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const result = React.use(searchParams);
  useEffect(() => {
    setCity(result.city);
    setLocationId(result.locationId);
  }, [result]);

  return (
    <>
      <Header content={"Berita di"} city={city} />
      <div className="section2 w-50 mt-5">
        <p className="h3">
          <strong>Apa yang Sedang Terjadi di Sekitar Mu</strong>
        </p>
      </div>

      <div className="row justify-justify-content-start mt-5">
        {news ? (
          news
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
        ) : (
          <p>loading</p>
        )}
      </div>
    </>
  );
};

export default Page;
