'use client';

import { useEffect, useState } from "react";


export default function GuidePage() {

  const [guide, setGuide] = useState<any[]>([]);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch("https://dev.maimai.moe/api/tutorial?limit=10&offset=0", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result) {
          const data = JSON.parse(result);
          setGuide(data);
        }
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    console.log(guide);
  }, [guide]);

  return (
    <div className="mx-auto w-[900px] h-[700px] mt-16 flex flex-col justify-center items-center">
      {guide.length === 0 ? (
        <>
          <p>No guides available</p>
        </>
      ) : (
        <ul>
          {guide.map((item, index) => (
            <li key={index}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

