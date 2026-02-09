
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


function sortByRange(slct1, slct2){

	var s1 = document.getElementById(slct1);
	var s2 = document.getElementById(slct2);

	const cards = s2.querySelectorAll('.card');
	cards.forEach(card => {
		const price = Number(card.dataset.price);
		if (s1.value === "noRange"){
			card.classList.remove('hidden');
		} else if ((s1.value === "Below5")&&(price<=5)){
			card.classList.remove('hidden');
		} else if ((s1.value === "Below10")&&(price<=10)){
			card.classList.remove('hidden');
		} else if ((s1.value === "Below20")&&(price<=20)){
			card.classList.remove('hidden');
		} else{
			card.classList.add('hidden');
		}
	});

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
	//optionArray = sortByRange(optionArray, s3.value);

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
        <div class="price" >$${productObj.price}</div>
		<input type="checkbox" name="product" value=${productName}>
        `;
		s2.appendChild(card);
		
	}
}



// This function is called when the "Add selected items to cart" button in clicked
// The purpose is to build the HTML to be displayed (a Paragraph) 
// We build a paragraph to contain the list of selected items, and the total price

function selectedItems() {

	var ele = document.getElementsByName("product");
	var chosenProducts = [];

	var c = document.getElementById('displayCart');
	c.innerHTML = "";

	// build list of selected item
	var para = document.createElement("P");
	para.innerHTML = "You selected : ";
	para.appendChild(document.createElement("br"));
	for (i = 0; i < ele.length; i++) {
		if (ele[i].checked) {
			para.appendChild(document.createTextNode(ele[i].value));
			para.appendChild(document.createElement("br"));
			chosenProducts.push(ele[i].value);
		}
	}

	// add paragraph and total price
	c.appendChild(para);
	c.appendChild(document.createTextNode("Total Price is " + getTotalPrice(chosenProducts)));

}

