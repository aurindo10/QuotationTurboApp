import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useProtectedRoute = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user?.publicMetadata.idEmpresa === undefined && isLoaded) {
      router.replace({
        pathname: "/criarempresa",
      });
    }
  }, [isLoaded, user, router]);

  return { user, isLoaded };
};

export default useProtectedRoute;
