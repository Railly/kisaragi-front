export default function useDelete(field) {
  const deleteUser = async (id, formData) => {
    const token = JSON.parse(window.localStorage.getItem("token"));

    if (!token) {
      return;
    }

    try {
      const enviromentVariables = {
        users: `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}`,
        publications: `${process.env.NEXT_PUBLIC_KISARAGI_PUBLICATIONS_API}`,
        commentaries: `${process.env.NEXT_PUBLIC_KISARAGI_PUBLICATIONS_API}`,
      };
      let newPromise = null;
      if (id) {
        if (formData) {
          newPromise = await fetch(
            `${enviromentVariables[field]}/${field}/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );
        } else {
          newPromise = await fetch(
            `${enviromentVariables[field]}/${field}/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } else {
        newPromise = await fetch(`${enviromentVariables[field]}/${field}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      const response = await newPromise.json();
    } catch (error) {
      console.error(error);
    }
  };

  return deleteUser;
}
