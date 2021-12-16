export default function useDelete(field) {
  const deleteUser = async () => {
    const token = JSON.parse(window.localStorage.getItem("token"));

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/${field}`,
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
