import { APIResponse } from "@/common/type/type";
import { Subject } from "@/pages/Subjects/SubjectTable";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

type SubjectDetail = Subject & {
  co: {
    instance: string;
    name: string;
    id: string;
    ga: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
};

export const useGetSubjectDetail = (subjectId: string | undefined) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["subject-detail-by-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get<SubjectDetail>(`subject_detail/${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select: (data) => data?.data,
  });

  return { subject: data, isPending, isError };
};

//================================================================================================

type Attribute = {
  name: string;
  id: string;
  type: string;
  instance: number;
  marks: { id: string; mark: number; gaSlug: string; gaID: string }[];
  co: { id: string; name: string; instance: number }[];
};

type AttributeResponse = APIResponse & {
  items: Attribute[];
};

type AttributeWithCoGaMarksProps = {
  subjectId: string | undefined;
  type?: "EXAM" | "COURSEWORK";
  select?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((data: AxiosResponse<AttributeResponse, any>) => AttributeResponse)
    | undefined;
};

export const useGetAttributeWithCoGaMarks = (
  props: AttributeWithCoGaMarksProps
) => {
  const { subjectId, type, select = (data) => data?.data } = props;

  let queryStr = "page=1";
  if (type) queryStr += `&type=${type}`;

  const { data, isPending, isError } = useQuery({
    queryKey: ["attributes-co-ga-marks"],
    queryFn: ({ signal }) =>
      axios.get<AttributeResponse>(
        `attributes_ga_mark/${subjectId}?${queryStr}`,
        {
          signal,
        }
      ),
    enabled: subjectId !== undefined,
    staleTime: 5000,
    select,
  });

  return { attributes: data, isPending, isError };
};

//================================================================================================
