import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

// Search suggestions for DummyJSON products.
// https://dummyjson.com/products/search?q=phone
// The list shows product titles. Typing waits 500ms, then fetches one page.

/**
 * Fetches one page of products whose title matches `query`.
 * `skip` offsets the page. `signal` lets the caller cancel an outdated request.
 */
const getItems = async (query, limit = 5, skip = 0, signal) => {
  const res = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
    { signal },
  );
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const AutoCompleteSearchSuggestions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [productList, setProductList] = useState(null);
  const [loader, setLoader] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 means nothing is highlighted
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null); // search box plus list, used for outside clicks
  const inputRef = useRef(null);
  const pageSize = 10;
  const totalPages = Math.ceil(Number(totalProductCount) / pageSize);
  const skipPage = (currentPage - 1) * pageSize;

  /** Clears the text, the results, and the open list. */
  const ClearSelection = () => {
    setSearchValue("");
    setProductList(null);
    setLoader(false);
    setIsDropdownOpen(false);
  };

  /** Keeps Enter in the empty form from reloading the page. */
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const query = searchValue.trim();
  const debouncedQuery = useDebounce(query, 500);
  // Title the user just chose. While the input still equals it, do not search again.
  const selectedRef = useRef("");

  /** Puts the chosen title in the input and closes the list. */
  const handleSelect = (title) => {
    selectedRef.current = title;
    setSearchValue(title);
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  // Fetch when the debounced text or the page changes.
  // Skip the request while the user is still typing, or after they pick a suggestion.
  useEffect(() => {
    if (!query) {
      setProductList(null);
      setLoader(false);
      setIsDropdownOpen(false);
      return;
    }
    if (query === selectedRef.current) {
      setLoader(false);
      return;
    }
    // The visible text is ahead of the debounced text, so wait for the pause.
    if (query !== debouncedQuery) {
      setLoader(true);
      return;
    }

    const controller = new AbortController();
    setLoader(true);

    getItems(debouncedQuery, pageSize, skipPage, controller.signal)
      .then((data) => {
        setProductList(data.products?.length ? data.products : null);
        setTotalProductCount(data.total ?? 0);
        setActiveIndex(-1);
        setIsDropdownOpen(true);
        setLoader(false);
      })
      .catch((error) => {
        // Aborting the previous request is expected when the query or page changes.
        if (error.name === "AbortError") return;
        console.error("Error while fetching data", error);
        setProductList(null);
        setLoader(false);
      });

    return () => controller.abort();
  }, [query, debouncedQuery, currentPage]);

  /**
   * Changes the results page.
   * Accepts a page number or an updater function.
   * Focus stays in the input so arrow keys still move through suggestions.
   */
  const changePage = (page) => {
    setCurrentPage(page);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard handling lives on the document so it still works after a page button is used.
  // The listener exists only while the suggestion list is open.
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleKeyDown = (event) => {
      if (!productList?.length) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev < productList.length - 1 ? prev + 1 : 0,
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : productList.length - 1,
          );
          break;

        case "Enter":
          if (activeIndex >= 0 && productList[activeIndex]) {
            event.preventDefault();
            handleSelect(productList[activeIndex].title);
          }
          break;

        case "Escape":
          event.preventDefault();
          setActiveIndex(-1);
          setIsDropdownOpen(false);
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen, productList, activeIndex]);

  // A new search starts back on page 1 with no highlighted row.
  useEffect(() => {
    setCurrentPage(1);
    setActiveIndex(-1);
  }, [query]);

  // Close the list when the pointer goes outside the search box and the list.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="input_container">
        <form onSubmit={(event) => handleFormSubmit(event)}>
          <input
            ref={inputRef}
            value={searchValue}
            onChange={(e) => {
              // Typing is a new search, so forget the previously selected title.
              selectedRef.current = "";
              setSearchValue(e.target.value);
            }}
            onFocus={() => {
              if (query && productList) setIsDropdownOpen(true);
            }}
          />
          <button
            type="button"
            onClick={ClearSelection}
            aria-label="Clear search"
          >
            X
          </button>
        </form>
      </div>
      {isDropdownOpen && (
        <SearchSuggestions
          productList={productList}
          loader={loader}
          onSelect={handleSelect}
          activeIndex={activeIndex}
        />
      )}
      {isDropdownOpen ? (
        <PaginationComponent
          setCurrentPage={changePage}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      ) : null}
    </div>
  );
};

/** Renders the suggestion rows and keeps the highlighted row on screen. */
const SearchSuggestions = ({ productList, loader, onSelect, activeIndex }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, productList]);

  return (
    <ul className="product_list" ref={listRef}>
      {loader && <li>Loading...</li>}
      {!productList && !loader ? (
        <li>No products found</li>
      ) : (
        productList?.map((items, index) => (
          <li
            key={items?.id}
            data-index={index}
            className={activeIndex === index ? "items_view active" : "items_view"}
            onClick={() => onSelect(items?.title)}
          >
            {items?.title}
            <img src={items?.thumbnail} alt={items?.title} />
          </li>
        ))
      )}
    </ul>
  );
};

/**
 * Stops a pagination click from moving focus out of the search input.
 * Arrow keys are handled from that input, so it has to stay focused.
 */
const keepSearchFocus = (event) => {
  event.preventDefault();
};

/**
 * Shows page numbers in groups of 10.
 * When the current page is the last number in the group, and more pages exist,
 * the group shifts forward by one so the next page number is visible.
 */
export const PaginationComponent = ({
  setCurrentPage,
  totalPages,
  currentPage,
}) => {
  const PAGES_PER_BLOCK = 10;
  let start = Math.floor((currentPage - 1) / PAGES_PER_BLOCK) * PAGES_PER_BLOCK + 1;
  let end = Math.min(start + PAGES_PER_BLOCK - 1, totalPages);

  if (currentPage === end && end < totalPages) {
    start = Math.max(1, start + 1);
    end = Math.min(start + PAGES_PER_BLOCK - 1, totalPages);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  /** Moves to the previous page, and never below page 1. */
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  /** Moves to the next page, and never past the last page. */
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        onMouseDown={keepSearchFocus}
        onClick={goPrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {start > 1 && (
        <button
          className="dots"
          onMouseDown={keepSearchFocus}
          onClick={() => setCurrentPage(start - 1)}
          aria-label="Previous pages"
        >
          ...
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`number_list ${page === currentPage ? "active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
          onMouseDown={keepSearchFocus}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <button
          className="dots"
          onMouseDown={keepSearchFocus}
          onClick={() => setCurrentPage(end + 1)}
          aria-label="Next pages"
        >
          ...
        </button>
      )}

      <button
        onMouseDown={keepSearchFocus}
        onClick={goNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
};

export default AutoCompleteSearchSuggestions;
