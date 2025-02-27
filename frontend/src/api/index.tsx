export const fetchProducts = async () => {
    const response = await fetch("http://127.0.0.1:5000/scrape");
    const data = await response.json();
    return data;
  };
  