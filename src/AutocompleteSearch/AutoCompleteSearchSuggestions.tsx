
import { useEffect, useState } from 'react'



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


const getItems = async (query) => {
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
    const { products } = await response.json();
    return products ?? [];
};

const AutoCompleteSearchSuggestions = () => {
    const [searchValue, setSearchValue] = useState('');
    const [productList, setProductList] = useState(null);
    const [loader, setLoader] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const ClearSelection = () => {
        setSearchValue('');
        setProductList(null);
        setLoader(false);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const query = searchValue.trim();

        if (!query) {
            setProductList(null);
            setLoader(false);
            return;
        }

        setLoader(true);

        const timeoutId = setTimeout(async () => {
            try {
                const products = await getItems(query);
               
                setProductList(products.length ? products : null);
            } catch (error) {
              
                console.error("Error while fetching data", error);
                setProductList(null);
            } finally {
                if (!ignore) setLoader(false);
            }
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchValue]);

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
                    console.log("productList[activeIndex]", productList[activeIndex])
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

    return (
        <div className='container'>
            <div className='input_container'>
                <form onSubmit={(event) => handleFormSubmit(event)} >
                    <input type="text" id='search_box' autoComplete="off" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleKeyDown} />
                    <button type='button' onClick={ClearSelection}>X</button>

                </form>
            </div>
            {searchValue && <SearchSuggestions productList={productList} loader={loader} setSearchValue={setSearchValue} searchValue={searchValue} activeIndex={activeIndex} />}
        </div>
    )
};


const SearchSuggestions = ({ productList, loader, setSearchValue, searchValue, activeIndex }) => {

    return (
        <ul className='product_list' >
            {loader && <li>Loading...</li>}
            {!productList && !loader ? <li>No products found</li> : <>
                {productList?.map((items, index) => (

                    <li key={items?.id} onClick={() => setSearchValue(items?.title)} className={activeIndex === index ? "active" : ""}>{items?.title}</li>
                ))}
            </>
            }
        </ul>
    );
};

export default AutoCompleteSearchSuggestions



