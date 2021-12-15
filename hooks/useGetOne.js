import { useEffect, useState } from "react";

export default function useGetOne(field, id) {
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getUser = async (a) => {
      try {
        if (id) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_KISARAGI_API_URL}/${field}/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          console.log(data, "useGetOne");
          setData(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const token = window.localStorage.getItem("token");

    if (token) {
      getUser();
    }
  }, [reload, id, field]);

  return { data: data, refetch: () => setReload(!reload) };
}
