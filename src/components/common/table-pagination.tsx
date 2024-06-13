import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TablePaginationProps = {
  totalPage: number;
  page: number;
  onPageChange: (page: number) => void;
};

export const TablePagination = (props: TablePaginationProps) => {
  const { totalPage, page, onPageChange } = props;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className="cursor-pointer"
          // onClick={() => setPage((prev) => (prev === 1 ? prev : prev - 1))}
          onClick={() => onPageChange(page === 1 ? page : page - 1)}
        >
          <PaginationPrevious />
        </PaginationItem>

        {totalPage > 10 ? (
          <>
            {page > 5 && page < totalPage - 4 ? (
              <>
                {Array.from({ length: 2 }, (_, i) => i + 1).map((p) => (
                  <PaginationItem
                    key={"adfpaginac sdf" + p}
                    className="cursor-pointer"
                    onClick={() => onPageChange(p)}
                  >
                    <PaginationLink isActive={p === page}>{p}</PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>

                {Array.from({ length: 5 }, (_, i) => page + (i - 2)).map(
                  (p) => (
                    <PaginationItem
                      key={"adfpaginac sdf" + p}
                      className="cursor-pointer"
                      onClick={() => onPageChange(p)}
                    >
                      <PaginationLink isActive={p === page}>{p}</PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem
                  key={"adfpaginac sdf" + totalPage}
                  className="cursor-pointer"
                  onClick={() => onPageChange(totalPage)}
                >
                  <PaginationLink isActive={totalPage === page}>
                    {totalPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            ) : (
              <>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((p) => (
                  <PaginationItem
                    key={"adfpaginac sdf" + p}
                    className="cursor-pointer"
                    onClick={() => onPageChange(p)}
                  >
                    <PaginationLink isActive={p === page}>{p}</PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>

                {Array.from({ length: 5 }, (_, i) => totalPage - i)
                  .reverse()
                  .map((p) => (
                    <PaginationItem
                      key={"adfpaginac sdf" + p}
                      className="cursor-pointer"
                      onClick={() => onPageChange(p)}
                    >
                      <PaginationLink isActive={p === page}>{p}</PaginationLink>
                    </PaginationItem>
                  ))}
              </>
            )}
          </>
        ) : (
          Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
            <PaginationItem
              key={"Pagination sd" + p}
              className="cursor-pointer"
              onClick={() => onPageChange(p)}
            >
              <PaginationLink isActive={p === page}>{p}</PaginationLink>
            </PaginationItem>
          ))
        )}

        <PaginationItem
          className="cursor-pointer"
          onClick={() => onPageChange(totalPage === page ? page : page + 1)}
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
