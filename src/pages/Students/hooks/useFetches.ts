import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Student } from "../StudentTable";

export const useGetStudentById = (
  studentId: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select: ((data: AxiosResponse<Student, any>) => any) | undefined = (data) =>
    data?.data
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["student-by-id", studentId],
    queryFn: ({ signal }) =>
      axios.get<Student>(`student/${studentId}`, { signal }),
    staleTime: 5000,
    enabled: studentId !== undefined,
    select,
  });

  return { student: data, isPending, isError };
};
