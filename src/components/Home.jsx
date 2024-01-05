import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaShoppingCart } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function Home() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cart, setCart] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch API data
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const products = data["products"];
        console.log("Api Response :", data);
        if (Array.isArray(products)) {
          setProducts(products);
          setFilteredProducts(products);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setError("Error fetching products. please try again later");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // handle search product by name
  const handleSearch = (e) => {
    const searchTermLowerCase = e.target.value.toLowerCase();
    setSearchTerm(searchTermLowerCase);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredProducts(filtered);
  };

  // handle filter product by min and max price
  const handleFilterByPrice = () => {
    let filteredByPrice = products;

    if (minPrice !== "") {
      filteredByPrice = filteredByPrice.filter(
        (product) => product.price >= parseInt(minPrice, 10)
      );
    }

    if (maxPrice !== "") {
      filteredByPrice = filteredByPrice.filter(
        (product) => product.price <= parseInt(maxPrice, 10)
      );
    }

    // Apply search term filter
    // filteredByPrice = filteredByPrice.filter((product) =>
    //   product.title.toLowerCase().includes(searchTerm)
    // );

    setFilteredProducts(filteredByPrice);
  };

  // handle cart to add in cart and count amount
  const handleAddToCart = (productId) => {
    const productToAdd = products.find((product) => product.id === productId);

    if (productToAdd) {
      setCart([...cart, productToAdd]);
    }
  };
  const cartCount = cart.length;
  const cartTotal = cart.reduce((total, product) => total + product.price, 0);

  // handle multiple images display by carousel
  const nextImage = () => {
    if (products[currentImageIndex]?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < products[currentImageIndex].images.length - 1
          ? prevIndex + 1
          : 0
      );
    }
  };

  const prevImage = () => {
    if (products[currentImageIndex]?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex > 0
          ? prevIndex - 1
          : products[currentImageIndex].images.length - 1
      );
    }
  };
  return (
    <div style={{ marginTop: "10px" }}>
      <Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Col md={2}></Col>
          <Col md={3}>
          {/* Min and Max Price input */}
            <div>
              <label>Min Price :&nbsp; </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
          </Col>
          <Col md={3}>
            <div>
              <label>Max Price :&nbsp; </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </Col>
          <Col md={2}>
          {/* Min and Max Price filter button */}
            <Button
              onClick={handleFilterByPrice}
              style={{ marginLeft: "10px" }}
            >
              Apply Filters
            </Button>
          </Col>
          <Col md={2}>
          {/* Add to cart to show badges on cart and price */}
            <div>
              <span
                style={{
                  fontSize: "16px",
                  padding: "0 5px",
                  verticalAlign: "top",
                  color: "red",
                }}
              >
                <FaShoppingCart style={{ fontSize: "20px", color: "black" }} />{" "}
                {cartCount}
              </span>
              <span>&nbsp; &nbsp; Total Cart : &#8377; {cartTotal}</span>
            </div>
          </Col>
        </div>
      </Row>
      <Row>
        <Col md={5}></Col>
        {/* Enter input to search products by name */}
        <Col md={4}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Products..."
            style={{ marginBottom: "10px" }}
          ></input>
        </Col>
        <Col md={3}></Col>
      </Row>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Container className="">
          <h2 align="center">Products List</h2>
          <Row>
            {filteredProducts.map((product) => (
              <Col md={3}>
                <Card key={product.id} style={{ display: "inline-block" }}>
                  {/* Display multiple images in a carousel */}
                  {product.images &&
                  Array.isArray(product.images) &&
                  product.images.length > 0 ? (
                    <div className="image-carousel">
                      <Card.Img
                        variant="top"
                        src={product?.images?.[currentImageIndex]}
                        alt={`Product ${currentImageIndex + 1}`}
                        style={{ width: "100%", height: "25vh" }}
                      />
                      <Button variant="light" onClick={prevImage}>
                        {"<"}
                      </Button>
                      <Button variant="light" onClick={nextImage}>
                        {">"}
                      </Button>
                    </div>
                  ) : (
                    <Card.Img variant="top" src={product.thumbnail} />
                  )}
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>&#8377; {product.price}</Card.Text>
                    <Card.Text>
                      {product.brand} {product.category}
                    </Card.Text>
                    <Card.Text>{product.description}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default Home;