export default function useUpdate(field) {
  const updateUser = async (data) => {
    const token = window.localStorage.getItem("token");
    console.log(token, "token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_KISARAGI_API_URL}/${field}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      const parseResponse = await response.json();
      console.log(parseResponse);
    } catch (error) {
      console.error(error);
    }
  };

  return updateUser;
}
