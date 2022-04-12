import { useLocation, useHistory } from "react-router-dom";
import { useCallback } from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams, addURLParams } from "@utilities/url";
import { useTranslation } from "@translations/index";
import RenderIf from "@components/RenderIf";
import { previous, next } from "./translations";

import "./styles.module.scss";

const Pagination = ({ totalPages = 1 }: PaginationProps) => {
  const translate = useTranslation();
  const history = useHistory();
  const { page = 1 } = useSearchParams();
  const { pathname, search } = useLocation();

  const onPaginationPageSelect = useCallback(
    ({ selected }) => {
      history.push(addURLParams(pathname + search, { page: selected + 1 }));
    },
    [history, pathname, search]
  );

  return (
    <RenderIf condition={Number(page || 1) <= totalPages && totalPages > 1}>
      <div className="pagination">
        <ReactPaginate
          previousLabel={translate(previous)}
          nextLabel={translate(next)}
          className="pagination__list"
          pageCount={totalPages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          forcePage={Number(page) - 1}
          onPageChange={onPaginationPageSelect}
          disableInitialCallback={true}
        />
      </div>
    </RenderIf>
  );
};

export default Pagination;
