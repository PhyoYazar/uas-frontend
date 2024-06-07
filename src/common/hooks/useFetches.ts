import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
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

//================================================================================================

type AttributeType = "EXAM" | "COURSEWORK";

export type Attribute = {
  id: string;
  name: string;
  type: string;
  instance: number;
};

type AttributeResponse = APIResponse & {
  items: Attribute[];
};

type AttributeProps = {
  name?: string;
  type: AttributeType;
  select: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((data: AxiosResponse<AttributeResponse, any>) => Attribute[]) | undefined;
};

export const useGetAttributes = (props: AttributeProps) => {
  const { type, name, select } = props;

  let queryStr = `page=1&rows=50&type=${type}`;
  if (name) queryStr += `&name=${name}`;

  const { data, isPending, isError } = useQuery({
    queryKey: ["get-all-attributes", type],
    queryFn: ({ signal }) =>
      axios.get<AttributeResponse>(`attributes?${queryStr}&orderBy=instance`, {
        signal,
      }),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    select,
  });

  return { isPending, isError, attributes: data };
};
