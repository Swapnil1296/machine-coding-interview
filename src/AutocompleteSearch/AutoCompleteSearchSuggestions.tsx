
import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'



// 1. Functional requirements
// Implement the following:
// 1. Search input.
// 2. Display suggestions matching the search query.
// 3. Fetch suggestions from an API.
// 4. Implement debouncing (500ms).
// 5. Display loading indicator while fetching.
// 6. Display an appropriate message if no results are found.
// 7. Clicking a suggestion should populate the input.
// 8. Clicking outside the dropdown should close suggestions.
// 9. Add a clear search button.
// 10. Support keyboard navigation:
// - Arrow Down: Next suggestion.
// - Arrow Up: Previous suggestion.
// - Enter: Select suggestion.
// - Escape: Close dropdown.
// 2. API requirements
// Use this API:

// https://dummyjson.com/products/search?q=phone

// The API returns product information. Display the product titles as suggestions.


const getItems = async (query, limit = 5, skip = 0) => {
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    const products = await response.json();
    return products ?? [];
};

const AutoCompleteSearchSuggestions = () => {
    const [searchValue, setSearchValue] = useState('');
    const [productList, setProductList] = useState(null);
    const [loader, setLoader] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10;
    const totalPages = Math?.ceil(Number(totalProductCount) / pageSize);
    const skipPage = (currentPage - 1) * pageSize;


    const ClearSelection = () => {
        setSearchValue('');
        setProductList(null);
        setLoader(false);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
    };

    const query = searchValue.trim();
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (!query) {
            setProductList(null);
            setLoader(false);
            return;
        }

        if (query !== debouncedQuery) {
            setLoader(true);
            return;
        }

        let ignore = false;
        setLoader(true);

        getItems(debouncedQuery, pageSize, skipPage)
            .then((products) => {
                if (ignore) return;
                setProductList(products?.products?.length ? products?.products : null);
                setTotalProductCount(products?.total)
            })
            .catch((error) => {
                if (ignore) return;
                console.error("Error while fetching data", error);
                setProductList(null);
            })
            .finally(() => {
                if (!ignore) setLoader(false);
            });

        return () => {
            ignore = true;
        };
    }, [query, debouncedQuery, currentPage]);

    const handleKeyDown = (event) => {
        if (!productList?.length) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActiveIndex((prev) =>
                    prev < productList.length - 1 ? prev + 1 : 0
                );
                break;

            case "ArrowUp":
                event.preventDefault();
                setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : productList.length - 1
                );
                break;

            case "Enter":
                if (activeIndex !== -1) {
                    event.preventDefault();
                    setSearchValue(productList[activeIndex]?.title);
                }
                break;

            case "Escape":
                setActiveIndex(-1);
                break;

            default:
                break;
        }
    };
    useEffect(() => {
    setCurrentPage(1);
    setActiveIndex(-1);
}, [query]);

    return (
        <div className='container'>
            <div className='input_container'>
                <form onSubmit={(event) => handleFormSubmit(event)} >
                    <input type="text" id='search_box' autoComplete="off" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleKeyDown} />
                    <button type='button' onClick={ClearSelection}>X</button>

                </form>
            </div>
            {searchValue && (<><SearchSuggestions productList={productList} loader={loader} setSearchValue={setSearchValue} searchValue={searchValue} activeIndex={activeIndex} totalProductCount={totalProductCount} /></>)}
            {searchValue ? <PaginationComponent setCurrentPage={setCurrentPage} totalPages={totalPages} currentPage={currentPage} /> : null}
        </div>
    )
};


const SearchSuggestions = ({ productList, loader, setSearchValue, searchValue, activeIndex }) => {


    return (
        <>
            <ul className='product_list' >
                {loader && <li>Loading...</li>}
                {!productList && !loader ? <li>No products found</li> : <>
                    {productList?.map((items, index) => (

                        <div key={items?.id} className={activeIndex === index ? " items_view active" : "items_view"} onClick={() => setSearchValue(items?.title)}>
                            <li >{items?.title}
                                <img src={items?.thumbnail} alt={items?.title} />

                            </li>

                        </div>
                    ))}
                </>
                }


            </ul>

        </>
    );
};
export const PaginationComponent = ({ setCurrentPage, totalPages, currentPage }) => {
    const handlePage = (value) => {
        if (value === 'prev') {
            setCurrentPage((prev) => (
                prev > 1 ? prev - 1 : prev
            ))
        } else if (value === 'next') {
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
        }
    };
    return <>
        <div className="pagination">
            <div className="btn_prev" >
                <button onClick={() => handlePage('prev')} disabled={currentPage === 1}> Prev</button>
            </div>
            {[...Array(totalPages)]?.map((_, index) => (
                <div className="number_list" key={index} onClick={() => setCurrentPage(index + 1)}>{index + 1}</div>
            ))}
            <div className="btn_next" >
                <button onClick={() => handlePage('next')} disabled={currentPage === totalPages}>  Next</button>
            </div>
        </div>
    </>
}

export default AutoCompleteSearchSuggestions



