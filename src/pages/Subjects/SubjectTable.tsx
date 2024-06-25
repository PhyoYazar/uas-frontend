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
import { useGetSubjectById } from "../SubjectDetail/hooks/useFetches";
import { EditSubject } from "./EditSubject";

export type Subject = {
  id: string;
  name: string;
  code: string;
  year: string;
  academicYear: string;
  dateCreated: string;
  dateUpdated: string;
  instructor: string;
  exam: number;
  practical: number;
  semester: string;
};

type SubjectsResponse = APIResponse & {
  items: Subject[];
};

export function SubjectTable() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const debounceSearch = useDebounce(search, 400);

  const {
    subject,
    isPending: isPending,
    isError,
  } = useGetSubjectById(subjectId);

  const { data: subjects, isFetching } = useQuery({
    queryKey: [
      "all-subjects",
      page,
      debounceSearch,
      year,
      academicYear,
      semester,
    ],
    queryFn: ({ signal }) => {
      let queryStr = `page=${page}`;

      if (debounceSearch.length > 2) queryStr += `&name=${debounceSearch}`;
      if (year !== "") queryStr += `&year=${year}`;
      if (academicYear !== "") queryStr += `&academicYear=${academicYear}`;
      if (semester !== "") queryStr += `&semester=${semester.toLowerCase()}`;

      return axios.get<SubjectsResponse>(`subjects?${queryStr}`, { signal });
    },
    staleTime: 5000,
    select: (data) => data?.data,
    placeholderData: (data) => data,
  });

  const total = subjects?.total ?? 0;

  const totalPage = useMemo(
    function () {
      const pageCount = Math.ceil(total / 10);
      return pageCount > 0 ? pageCount : 1;
    },
    [total]
  );

  const deleteSubjectMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ subID }: any) => axios.delete(`subjects/${subID}`),
    onSuccess() {
      toast.success("Subject has been deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["all-subjects"],
      });
    },
    onError(error) {
      console.log("hello error", error);

      toast.error("Fail to delete the subject.");
    },
  });

  const columns: ColumnDef<Subject>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("code")}</div>
        ),
      },
      {
        accessorKey: "instructor",
        header: "Instructor",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("instructor")}</div>
        ),
      },
      {
        accessorKey: "semester",
        header: "Semester",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("semester")}</div>
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
          const subject = row.original;

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
                    setSubjectId(subject?.id);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSubjectMutation.mutate({ subID: subject.id });
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
    [deleteSubjectMutation]
  );

  return (
    <>
      <FlexBox className="justify-between">
        <FlexBox className="gap-4">
          <Input
            placeholder="search by name"
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

          <Select
            onValueChange={(val) => setSemester(val === "None" ? "" : val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {["None", "First", "Second"].map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FlexBox>

        <Link to={"/subject/create"}>
          <Button className="w-40">Create Subject</Button>
        </Link>
      </FlexBox>

      <CustomTable
        isLoading={isFetching}
        data={subjects?.items ?? []}
        columns={columns}
        onRowClick={({ id }) => navigate(`${id}`)}
      />

      <TablePagination
        page={page}
        onPageChange={(p) => setPage(p)}
        totalPage={totalPage}
      />

      {!isError && !isPending ? (
        <EditSubject
          open={editOpen}
          setOpen={setEditOpen}
          subject={subject as Subject}
        />
      ) : null}
    </>
  );
}
