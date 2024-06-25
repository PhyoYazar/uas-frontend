("use client");

import { APIResponse } from "@/common/type/type";
import { CustomTable } from "@/components/common/custom-table";
import { FlexBox } from "@/components/common/flex-box";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { dualYears } from "@/common/constants/helpers";
import { TablePagination } from "@/components/common/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EditStudent } from "./EditStudent";
import { useGetStudentById } from "./hooks/useFetches";

export type Student = {
  id: string;
  studentNumber: number;
  rollNumber: number;
  year: string;
  academicYear: string;
  dateCreated: string;
  dateUpdated: string;
};

type StudentsResponse = APIResponse & {
  items: Student[];
};

export function StudentTable() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const debounceSearch = useDebounce(search, 400);

  const {
    student,
    isPending: isPending,
    isError,
  } = useGetStudentById(subjectId);

  const { data: students, isFetching } = useQuery({
    queryKey: ["all-students", year, debounceSearch, academicYear, page],
    queryFn: ({ signal }) => {
      let queryStr = `page=${page}`;

      if (debounceSearch.length > 0)
        queryStr += `&roll_number=${debounceSearch}`;
      if (year !== "") queryStr += `&year=${year}`;
      if (academicYear !== "") queryStr += `&academic_year=${academicYear}`;

      return axios.get<StudentsResponse>(`students?${queryStr}`, { signal });
    },
    staleTime: 5000,
    select: (data) => data?.data,
    placeholderData: (data) => data,
  });

  const total = students?.total ?? 0;

  const totalPage = useMemo(
    function () {
      const pageCount = Math.ceil(total / 10);
      return pageCount > 0 ? pageCount : 1;
    },
    [total]
  );

  const deleteStudentMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ stdID }: any) => axios.delete(`student/${stdID}`),
    onSuccess() {
      toast.success("Student has been deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["all-students"],
      });
    },
    onError(error) {
      console.log("hello error", error);

      toast.error("Fail to delete the student.");
    },
  });

  const columns: ColumnDef<Student>[] = useMemo(
    () => [
      {
        accessorKey: "studentNumber",
        header: "Student ID",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("studentNumber")}</div>
        ),
      },
      {
        accessorKey: "rollNumber",
        header: "Roll Number",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("rollNumber")}</div>
        ),
      },
      {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("year")}</div>
        ),
      },
      {
        accessorKey: "academicYear",
        header: "Academic Year",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("academicYear")}</div>
        ),
      },

      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const std = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Subject ID
            </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditOpen(true);
                    setSubjectId(std?.id);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStudentMutation.mutate({ stdID: std.id });
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteStudentMutation]
  );

  return (
    <>
      <FlexBox className="justify-between">
        <FlexBox className="gap-4">
          <Input
            type="number"
            placeholder="search by roll number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
          />

          <Select onValueChange={(val) => setYear(val === "None" ? "" : val)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[
                "None",
                "First Year",
                "Second Year",
                "Third Year",
                "Fourth Year",
                "Fifth Year",
                "Sixth Year",
              ].map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => setAcademicYear(val === "None" ? "" : val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {["None", ...dualYears].map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FlexBox>

        <Link to={"/student/create"}>
          <Button className="w-40">Create Student</Button>
        </Link>
      </FlexBox>

      <CustomTable
        disabledRowClickDetail
        isLoading={isFetching}
        data={
          students?.items?.filter((std) => {
            if (year !== "") return std.year === year;

            return true;
          }) ?? []
        }
        columns={columns}
        onRowClick={({ id }) => navigate(`${id}`)}
      />

      <TablePagination
        page={page}
        onPageChange={(p) => setPage(p)}
        totalPage={totalPage}
      />

      {!isError && !isPending ? (
        <EditStudent
          open={editOpen}
          setOpen={setEditOpen}
          student={student as Student}
        />
      ) : null}
    </>
  );
}
