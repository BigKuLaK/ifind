import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSearchParams, generatePluginLink } from '../../helpers/url'

import './styles.scss';

const Pagination = ({ totalPages = 1, pageKey = 'page' }) => {
  const searchParams = getSearchParams();
  const history = useHistory();
  const [ page, setPage ] = useState(Number(searchParams?.page || 1) - 1);

  const onPaginationPageSelect = useCallback(({ selected }) => {
    history.push(generatePluginLink(null, { [pageKey]: selected + 1 }));
  });

  useEffect(() => {
    setPage(Number(searchParams?.page || 1) - 1);
  }, [searchParams]);

  return (
    <div className="pagination">
      <ReactPaginate
        previousLabel={<FontAwesomeIcon icon='chevron-left'/>}
        nextLabel={<FontAwesomeIcon icon='chevron-right'/>}
        className="pagination"
        pageCount={totalPages}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        initialPage={page}
        onPageChange={onPaginationPageSelect}
        disableInitialCallback={true}
      />
    </div>
  )
}

export default Pagination;