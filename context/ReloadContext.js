import { createContext, useContext, useState } from "react";

const ReloadContext = createContext();

export default function ReloadProvider({ children }) {
  const [reload, setReload] = useState(false);

  function reloadPage() {
    setReload(!reload);
  }

  return (
    <ReloadContext.Provider value={{ reload, reloadPage }}>
      {children}
    </ReloadContext.Provider>
  );
}

export function useReload() {
  const { reload, reloadPage } = useContext(ReloadContext);

  return { reload, reloadPage };
}
