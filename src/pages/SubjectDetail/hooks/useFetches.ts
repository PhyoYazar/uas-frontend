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
  items: Attribute[] | null;
};

type AttributeWithCoGaMarksProps = {
  subjectId: string | undefined;
  select?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((data: AxiosResponse<AttributeResponse, any>) => Attribute[]) | undefined;
};

export const useGetExamAttributeWithCoGaMarks = (
  props: AttributeWithCoGaMarksProps
) => {
  const { subjectId, select = (data) => data?.data?.items } = props;

  const { data, isPending, isError } = useQuery({
    queryKey: ["attributes-co-ga-exam-marks", subjectId],
    queryFn: ({ signal }) =>
      axios.get<AttributeResponse>(
        `attributes_ga_mark?page=1&subject_id=${subjectId}&type=EXAM&orderBy=instance`,
        {
          signal,
        }
      ),
    enabled: subjectId !== undefined,
    select,
  });

  return { attributes: data, isPending, isError };
};

export const useGetCWAttributeWithCoGaMarks = (
  props: AttributeWithCoGaMarksProps
) => {
  const { subjectId, select = (data) => data?.data?.items } = props;

  const { data, isPending, isError } = useQuery({
    queryKey: ["attributes-co-ga-cw-marks", subjectId],
    queryFn: ({ signal }) =>
      axios.get<AttributeResponse>(
        `attributes_ga_mark?page=1&subject_id=${subjectId}&type=COURSEWORK&orderBy=name,DESC`,
        {
          signal,
        }
      ),
    enabled: subjectId !== undefined,
    select,
  });

  return { attributes: data, isPending, isError };
};

//================================================================================================

export const useGetSubjectById = (
  subjectId: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select: ((data: AxiosResponse<Subject, any>) => any) | undefined = (data) =>
    data?.data
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["subject-by-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get<Subject>(`subjects/${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select,
  });

  return { subject: data, isPending, isError };
};
