import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIResponse } from "../type/type";

type GA = {
  name: string;
  id: string;
  slug: string;
};

type GAResponse = APIResponse & {
  items: GA[];
};

export const useGetAllGAs = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["get-all-gas"],
    queryFn: ({ signal }) =>
      axios.get<GAResponse>(`gas?page=1&rows=12`, {
        signal,
      }),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    select: (data) => data?.data?.items,
  });

  return { isPending, isError, allGAs: data };
};
