import { useEffect, useState } from "react";

export default function useGetAll(field) {
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getField = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_KISARAGI_API_URL}/${field}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    const token = window.localStorage.getItem("token");

    if (token) {
      getField();
    }
  }, [reload, field]);

  return { data, refetch: () => setReload(!reload) };
}
