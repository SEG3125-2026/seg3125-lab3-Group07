
// This function is called when any of the tab is clicked
// It is adapted from https://www.w3schools.com/howto/howto_js_tabs.asp

function openInfo(evt, tabName) {

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

}

document.getElementById('BigFont').addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('bigFont');
	} else {
		document.body.classList.remove('bigFont');
	}
});


function sortByRange(slct1, slct2) {

	var s1 = document.getElementById(slct1);
	var s2 = document.getElementById(slct2);

	const cards = s2.querySelectorAll('.card');
	let visibleCount = 0;

	cards.forEach(card => {
		const price = Number(card.dataset.price);
		if (s1.value === "noRange") {
			card.classList.remove('hidden');
			visibleCount++;
		} else if ((s1.value === "Below5") && (price <= 5)) {
			card.classList.remove('hidden');
			visibleCount++;
		} else if ((s1.value === "Below10") && (price <= 10)) {
			card.classList.remove('hidden');
			visibleCount++;
		} else if ((s1.value === "Below20") && (price <= 20)) {
			card.classList.remove('hidden');
			visibleCount++;
		} else {
			card.classList.add('hidden');
		}
	});

	// Update product count after price filtering
	const productCount = document.getElementById('productCount');
	if (productCount) {
		productCount.textContent = `${visibleCount} product${visibleCount !== 1 ? 's' : ''}`;
	}

}


// generate a checkbox list from a list of products
// it makes each product name as the label for the checkbox

function populateListProductChoices(slct1, slct2) {

	var s1 = document.getElementById(slct1);
	var s2 = document.getElementById(slct2);
	//var s3 = document.getElementById(slct3);

	// s2 represents the <div> in the Products tab, which shows the product list, so we first set it empty
	s2.innerHTML = "";

	// Sort the prices

	products.sort((a, b) => a.price - b.price);

	// obtain a reduced list of products based on restrictions
	var optionArray = restrictListProducts(products, s1.value);

	// Update filter summary
	updateFilterSummary(s1.value, optionArray.length);

	// Handle empty state
	if (optionArray.length === 0) {
		displayEmptyState(s2);
		return;
	}

	// for each item in the array, create a checkbox element, each containing information such as:
	// <input type="checkbox" name="product" value="Bread">
	// <label for="Bread">Bread/label><br>

	for (i = 0; i < optionArray.length; i++) {

		var productName = optionArray[i];
		let productObj = products.find(p => p.name === productName); //moved it up

		//Create product cards in grid format
		const card = document.createElement('div');
		card.className = 'card';
		card.dataset.price = productObj.price;

		card.innerHTML = `
        <img src="${productObj.img}" alt="${productObj.name}">
        <h3>${productObj.name}</h3>
        <div class="tags">
            ${productObj.vegetarian ? '<span class="tag">🌱 Vegetarian</span>' : ''}
            ${productObj.glutenFree ? '<span class="tag">🌾 Gluten-Free</span>' : ''}
            ${productObj.organic ? '<span class="tag">🌿 Organic</span>' : ''}
        </div>
        <div class="price">$${productObj.price}</div>
        <div class="card-actions">
			<input type="number" min="1" value="1" class="quantity-input" id="qty-${productName}">
			<button class="add-to-cart-btn" onclick="addToCart('${productName}')">
				🛒 Add to Cart
			</button>
		</div>
        `;
		s2.appendChild(card);

	}
}

// Update filter summary with active restrictions and product count
function updateFilterSummary(restriction, count) {
	const filterText = document.getElementById('filterText');
	const productCount = document.getElementById('productCount');

	if (restriction === "None") {
		filterText.textContent = "Showing all products";
	} else {
		filterText.textContent = `Showing ${restriction} products`;
	}

	productCount.textContent = `${count} product${count !== 1 ? 's' : ''}`;
}

// Display empty state when no products match
function displayEmptyState(container) {
	container.innerHTML = `
		<div class="empty-state">
			<div class="empty-state-icon">🔍</div>
			<h4>No products found</h4>
			<p>We couldn't find any products matching your current filters.</p>
			<div class="suggestion">
				💡 Try selecting a different dietary restriction or price range
			</div>
		</div>
	`;
}

// Cart array to store items
let cart = [];

// Add item to cart
function addToCart(productName) {
	const qtyInput = document.getElementById(`qty-${productName}`);
	const quantity = parseInt(qtyInput.value) || 1;

	const product = products.find(p => p.name === productName);
	if (!product) return;

	// Check if product already in cart
	const existingItem = cart.find(item => item.name === productName);

	if (existingItem) {
		existingItem.quantity += quantity;
	} else {
		cart.push({
			name: productName,
			price: product.price,
			quantity: quantity
		});
	}

	// Reset quantity input
	qtyInput.value = 1;

	// Show feedback
	showCartNotification(`Added ${quantity} ${productName} to cart!`);

	// Update cart display if Cart tab is active
	displayCart();
}

// Show cart notification
function showCartNotification(message) {
	const notification = document.createElement('div');
	notification.className = 'cart-notification';
	notification.textContent = message;
	document.body.appendChild(notification);

	setTimeout(() => {
		notification.classList.add('show');
	}, 10);

	setTimeout(() => {
		notification.classList.remove('show');
		setTimeout(() => notification.remove(), 300);
	}, 2000);
}

// Display cart contents
function displayCart() {
	const cartContainer = document.getElementById('displayCart');
	if (!cartContainer) return;

	cartContainer.innerHTML = '';

	if (cart.length === 0) {
		cartContainer.innerHTML = `
			<div class="empty-cart">
				<div class="empty-cart-icon">🛒</div>
				<h4>Your cart is empty</h4>
				<p>Add some delicious items to get started!</p>
			</div>
		`;
		return;
	}

	let total = 0;

	cart.forEach((item, index) => {
		const itemTotal = item.price * item.quantity;
		total += itemTotal;

		const cartItem = document.createElement('div');
		cartItem.className = 'cart-item';
		cartItem.innerHTML = `
			<div class="cart-item-info">
				<h4>${item.name}</h4>
				<p class="cart-item-details">$${item.price.toFixed(2)} × ${item.quantity}</p>
			</div>
			<div class="cart-item-price">
				<span class="item-total">$${itemTotal.toFixed(2)}</span>
				<button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">
					🗑️
				</button>
			</div>
		`;
		cartContainer.appendChild(cartItem);
	});

	// Add cart summary
	const summary = document.createElement('div');
	summary.className = 'cart-summary';
	summary.innerHTML = `
		<div class="cart-total">
			<span>Total:</span>
			<span class="total-amount">$${total.toFixed(2)}</span>
		</div>
		<button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
	`;
	cartContainer.appendChild(summary);
}

// Remove item from cart
function removeFromCart(index) {
	if (index >= 0 && index < cart.length) {
		const removedItem = cart[index];
		cart.splice(index, 1);
		showCartNotification(`Removed ${removedItem.name} from cart`);
		displayCart();
	}
}

// Clear entire cart
function clearCart() {
	if (cart.length === 0) return;

	if (confirm('Are you sure you want to clear your cart?')) {
		cart = [];
		showCartNotification('Cart cleared');
		displayCart();
	}
}


// Initialize products on page load
document.addEventListener('DOMContentLoaded', function () {
	// Show all products by default when page loads
	populateListProductChoices('dietSelect', 'displayProduct');
});
