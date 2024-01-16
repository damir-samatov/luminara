import { useEffect, useState } from "react";
import { createViewerToken } from "@/actions/token.actions";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const useViewerToken = (hostId: string) => {
  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [identity, setIdentity] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const viewerJwt = await createViewerToken(hostId);
        setToken(viewerJwt);
        const decodedToken = jwtDecode(viewerJwt) as JwtPayload & {
          name?: string;
        };

        const name = decodedToken?.name;
        const identity = decodedToken?.jti;

        if (name) setName(name);
        if (identity) setIdentity(identity);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [hostId]);

  return {
    token,
    name,
    identity,
    isLoading,
  };
};
