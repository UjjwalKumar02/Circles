import { useEffect, useState } from "react";

interface useFetchProps {
  link: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: object;
  contentType?: string;
}

export default function useFetch({
  link,
  method,
  data,
  contentType,
}: useFetchProps) {
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    try {
      setLoading(true);
      console.log("fetching");
      const res = await fetch(link, {
        method,
        credentials: "include",
        headers:
          method !== "GET"
            ? { "Content-Type": contentType || "application/json" }
            : undefined,
        body: method !== "GET" ? JSON.stringify(data) : undefined,
      });

      if (!res.ok) {
        throw new Error("Request failed!");
      }

      const json = await res.json();
      setResponseData(json);
      setLoading(false);
      console.log("fetched");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, [link, method, data, contentType]);

  return { responseData, loading };
}
