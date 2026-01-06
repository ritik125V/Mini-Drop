

const sampleproduct = 
    {
    "_id": "695a43911e37aee66a0037bd",
    "productId": "PROD-038",
    "name": "Patanjali Aloe Vera Gel",
    "brand": "Patanjali",
    "imageUrl":"xyznfwle.com",
    "category": "Personal Care",
    "tags": [
        "aloe vera",
        "patanjali",
        "skin care"
    ],
    "unitSize": 150,
    "unitType": "volume",
    "basePrice": 90,
    "isActive": true,
    "__v": 0,
    "createdAt": "2026-01-04T10:40:17.937Z",
    "updatedAt": "2026-01-04T10:40:17.937Z"
}


function addToCart(product) {
  try {
    // Get existing cart
    let cart = localStorage.getItem("user-cart");

    // If cart doesn't exist, initialize it
    cart = cart ? JSON.parse(cart) : [];

    // Check if product already exists in cart
    const existingProduct = cart.find(
      item => item.productId === product.productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    // Save updated cart
    localStorage.setItem("user-cart", JSON.stringify(cart));
    console.log("added to cart");
    
    return "added to cart"
  } catch (error) {
    console.error("Error adding to cart", error);
    return "error adding to cart"
  }
}

function getCart() {
  const cart = localStorage.getItem("user-cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("user-cart", JSON.stringify(cart));
}


function updateCartQuantity(productId, quantity) {
  try {
    let cart = getCart();

    cart = cart.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    saveCart(cart);
  } catch (error) {
    console.error("Failed to update quantity", error);
  }
}

function removeFromCart(productId) {
  try {
    const cart = getCart().filter(
      item => item.productId !== productId
    );

    saveCart(cart);
  } catch (error) {
    console.error("Failed to remove item", error);
  }
}

function clearCart() {
  try {
    localStorage.removeItem("user-cart");
  } catch (error) {
    console.error("Failed to clear cart", error);
  }
}

function getCartCount() {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}


export {addToCart , removeFromCart , updateCartQuantity , clearCart , getCartCount}