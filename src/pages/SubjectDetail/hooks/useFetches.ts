import { Subject } from "@/pages/Subjects/SubjectTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
      axios.get<SubjectDetail>(`subject-detail/${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select: (data) => data?.data,
  });

  return { subject: data, isPending, isError };
};
