import { useGetAllGAs } from "@/common/hooks/useFetches";
import { APIResponse } from "@/common/type/type";
import { Subject } from "@/pages/Subjects/SubjectTable";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

type SubjectDetail = Subject & {
  co: {
    instance: string;
    name: string;
    id: string;
    mark: number;
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

  const cos =
    data?.co?.filter((c) => c.id !== "00000000-0000-0000-0000-000000000000") ??
    [];

  return { subject: data, cos, isPending, isError };
};

//================================================================================================
export type StudentLists = {
  id: string;
  rollNumber: number;
  studentName: string;
  attributes: {
    attributeId: string;
    studentMarkId: string;
    mark: number;
    name: string;
  }[];
};

type StudentListResponse = APIResponse & {
  items: StudentLists[];
};

export const useGetAllStudentsBySubject = (
  year: string | undefined,
  academicYear: string | undefined
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["all-students-by-subject-id", year, academicYear],
    queryFn: ({ signal }) =>
      axios.get<StudentListResponse>(
        `student_attributes_marks?year=${year}&academic_year=${academicYear}`,
        { signal }
      ),
    staleTime: 5000,
    enabled: !!year && !!academicYear,
    select: (data) => data?.data,
  });

  // const clone = JSON.parse(JSON.stringify(data)).items?.sort(
  //   (a, b) => a?.rollNumber - b?.rollNumber
  // );

  return { students: data, isPending, isError };
};

//================================================================================================

type DefaultAttribute = {
  name: string;
  id: string;
  type: string;
  instance: number;
  fullMark: number;
  marks: { id: string; mark: number; gaSlug: string; gaID: string }[];
};

export type Attribute = DefaultAttribute & {
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
        `attributes_ga_mark/${subjectId}?type=EXAM&orderBy=instance`,
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
        `attributes_ga_mark/${subjectId}?page=1&type=COURSEWORK&orderBy=name,DESC`,
        {
          signal,
        }
      ),
    enabled: subjectId !== undefined,
    select,
  });

  return { attributes: data, isPending, isError };
};

//=======================================================

type GetAttributeWithCoGaMarksProps = {
  subjectId: string | undefined;
  type?: "Question" | "Tutorial" | "Assignment" | "Lab" | "Practical" | "Total";
  select?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((data: AxiosResponse<AttributeResponse, any>) => Attribute[]) | undefined;
};

export const useGetAttributeWithCoGaMarks = (
  props: GetAttributeWithCoGaMarksProps
) => {
  const { subjectId, type, select = (data) => data?.data?.items } = props;

  const { data, isPending, isError } = useQuery({
    queryKey: ["attributes-co-ga-all-marks", subjectId, type],
    queryFn: ({ signal }) =>
      axios.get<AttributeResponse>(
        `attributes_ga_mark/${subjectId}?page=1${
          type !== "Total" ? `&name=${type}` : ""
        }&orderBy=instance`,
        {
          signal,
        }
      ),
    enabled: subjectId !== undefined,
    staleTime: 5000,
    select,
  });

  return { attributes: isPending ? [] : data, isPending, isError };
};

//================================================================================================

export const useGetSubjectById = (
  subjectId: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select: ((data: AxiosResponse<Subject, any>) => Subject) | undefined = (
    data
  ) => data?.data
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

// =================================================================================================

export const useCalculateMarks = (attributes: Attribute[]) => {
  const { allGAs } = useGetAllGAs();
  const gaMarks: { id: string; mark: number; gaSlug: string; gaID: string }[] =
    allGAs?.map((g) => ({ id: "null", mark: 0, gaID: g.id, gaSlug: g.slug })) ??
    [];

  attributes?.forEach((attribute) => {
    attribute.marks.forEach((mark) => {
      const index = gaMarks.findIndex((g) => mark.gaID === g.gaID);

      if (index !== -1) gaMarks[index].mark = gaMarks[index].mark + mark.mark;
    });
  });

  return { gaMarks };
};

// =================================================================================================
type Co = {
  coName: string;
  coInstance: number;
  coId: string;
  totalFullMarks: number;
  totalMarks: number;
};

export type StudentCoGrade = {
  studentName: string;
  rollNumber: number;
  id: string;
  co: Co[];
};

type StudentCoGradeRespone = APIResponse & {
  items: StudentCoGrade[];
};

export const useStdCoGrades = (
  year: string | undefined,
  academicYear: string | undefined,
  subjectId: string | undefined
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["all-students-co-grades", year, academicYear],
    queryFn: ({ signal }) =>
      axios.get<StudentCoGradeRespone>(
        `student_co_grades?year=${year}&academic_year=${academicYear}&subject_id=${subjectId}`,
        { signal }
      ),
    staleTime: 5000,
    enabled: !!year && !!academicYear && !!subjectId,
    select: (data) => (data.status === 200 ? data?.data?.items : []),
  });

  return { data: data ?? [], isPending, isError };
};

// =================================================================================================
type Ga = {
  gaId: string;
  gaSlug: string;
  totalMarks: number;
};

export type StudentGaGrade = {
  studentName: string;
  rollNumber: number;
  id: string;
  ga: Ga[];
};

type StudentGaGradeRespone = APIResponse & {
  items: StudentGaGrade[];
};

export const useStdGaGrades = (
  year: string | undefined,
  academicYear: string | undefined,
  subjectId: string | undefined
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["all-students-ga-grades", year, academicYear],
    queryFn: ({ signal }) =>
      axios.get<StudentGaGradeRespone>(
        `student_ga_grades?year=${year}&academic_year=${academicYear}&subject_id=${subjectId}`,
        { signal }
      ),
    staleTime: 5000,
    enabled: !!year && !!academicYear && !!subjectId,
    select: (data) => (data.status === 200 ? data?.data?.items : []),
  });

  return { data: data ?? [], isPending, isError };
};

// =================================================================================================

type AttributeCoGa = DefaultAttribute & {
  full_mark: number;
  co: {
    id: string;
    name: string;
    instance: string;
    coMark: number;
    co_attribute_id: string;
  }[];
  ga: {
    id: string;
    name: string;
    slug: string;
    gaMark: number;
    mark_id: string;
  }[];
};

type APIRes = APIResponse & {
  items: AttributeCoGa[];
};

export const useAttributesWithCoGaFullMarks = (
  subjectId: string | undefined
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["attributes-detail-with-co-ga", subjectId],
    queryFn: ({ signal }) =>
      axios.get<APIRes>(`attributes_detail/${subjectId}`, {
        signal,
      }),
    staleTime: 5000,
    enabled: !!subjectId,
    select: (data) => (data.status === 200 ? data?.data?.items : []),
  });

  return { data: data ?? [], isPending, isError };
};
