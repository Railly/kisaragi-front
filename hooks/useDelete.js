export default function useDelete(field) {
  const deleteUser = async () => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_KISARAGI_API_URL}/${field}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  return deleteUser;
}
