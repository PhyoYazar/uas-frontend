("use client");

import { years } from "@/common/constants/helpers";
import { APIResponse } from "@/common/type/type";
import { CustomTable } from "@/components/common/custom-table";
import { FlexBox } from "@/components/common/flex-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const debounceSearch = useDebounce(search, 400);

  const { data: subjects, isFetching } = useQuery({
    queryKey: ["all-subjects", year, debounceSearch, academicYear, page],
    queryFn: ({ signal }) => {
      let queryStr = `page=${page}`;

      if (debounceSearch.length > 2) queryStr += `&name=${debounceSearch}`;
      if (year !== "") queryStr += `&year=${year}`;
      if (academicYear !== "") queryStr += `&academicYear=${academicYear}`;

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
              {[
                "None",
                ...years.map((y, index) =>
                  years.length - 1 === index
                    ? y + "-" + (+y + 1)
                    : y + "-" + years[index + 1]
                ),
              ].map((y) => (
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
        data={
          subjects?.items?.filter((sub) => {
            if (year !== "") return sub.year === year;

            return true;
          }) ?? []
        }
        columns={columns}
        onRowClick={({ id }) => navigate(`${id}`)}
      />

      <Pagination>
        <PaginationContent>
          <PaginationItem
            className="cursor-pointer"
            onClick={() => setPage((prev) => (prev === 1 ? prev : prev - 1))}
          >
            <PaginationPrevious />
          </PaginationItem>

          {totalPage > 10 ? (
            <>
              {Array.from({ length: 5 }, (_, i) => i + 1).map((p) => (
                <PaginationItem
                  key={"adfpaginac sdf" + p}
                  className="cursor-pointer"
                >
                  <PaginationLink isActive={p === page}>{p}</PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              {Array.from({ length: 4 }, (_, i) => totalPage - i)
                .reverse()
                .map((p) => (
                  <PaginationItem
                    key={"adfpaginac sdf" + p}
                    className="cursor-pointer"
                  >
                    <PaginationLink isActive={p === page}>{p}</PaginationLink>
                  </PaginationItem>
                ))}
            </>
          ) : (
            Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
              <PaginationItem
                key={"Pagination sd" + p}
                className="cursor-pointer"
              >
                <PaginationLink isActive={p === page}>{p}</PaginationLink>
              </PaginationItem>
            ))
          )}

          <PaginationItem
            className="cursor-pointer"
            onClick={() =>
              setPage((prev) => (totalPage === prev ? prev : prev + 1))
            }
          >
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

const columns: ColumnDef<Subject>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  // },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="capitalize">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("instructor")}</div>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => <div className="capitalize">{row.getValue("year")}</div>,
  },
  {
    accessorKey: "academicYear",
    header: "Academic Year",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("academicYear")}</div>
    ),
  },

  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
