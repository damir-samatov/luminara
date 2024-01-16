import { useEffect, useState } from "react";
import { onGetViewerToken } from "@/actions/viewer-token.actions";
// import { jwtDecode, JwtPayload } from "jwt-decode";

// TODO REFACTOR this crap

export const useViewerToken = (hostUserId: string) => {
  const [token, setToken] = useState<string>("");
  // const [name, setName] = useState<string>("");
  // const [identity, setIdentity] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const viewerJwt = await onGetViewerToken(hostUserId);
        setToken(viewerJwt);

        // const decodedToken = jwtDecode(viewerJwt) as JwtPayload & {
        //   name?: string;
        // };
        //
        // console.log(decodedToken);
        //
        // const name = decodedToken?.name;
        // const identity = decodedToken?.jti;
        //
        // if (name) setName(name);
        // if (identity) setIdentity(identity);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [hostUserId]);

  return {
    // name,
    // identity,
    token,
    isLoading,
  };
};
