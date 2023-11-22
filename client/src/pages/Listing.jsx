import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SpinnerInfinity } from "spinners-react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
export const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const fetchingListing = async () => {
      try {
        setError(false);
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setError(data.message);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchingListing();
  }, [id]);
  console.log(listing);
  return (
    <main>
      {loading && (
        <div className="flex justify-center items-center h-96">
          <SpinnerInfinity />
        </div>
      )}
      {error && (
        <>
          <p className="text-center text-red-600 mt-40 mb-7 font-bold text-4xl">
            Something went wrong!!
          </p>
          <p className="text-center">
            <Link to="/" className="hover:underline ">
              Back to Home
            </Link>
          </p>
        </>
      )}
      {listing && !error && !loading && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    background: `url(${imageUrl}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[550px]"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};
