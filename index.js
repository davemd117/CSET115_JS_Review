// Since the asynch tag is being used, we need to make sure the JS doesn't load before the rest of the page.
if (document.readyState == 'loading') {
// The ready state property returns 1 of at least 5 values, all of them reflecting the documents current load state. 'loading' is one of them.
    document.addEventListener('DOMContentLoaded', ready);
    // Wait for the page to load to execute ready function.'DOMContentLoaded' is an event that automatically executes when the document is done loading
} else {
    ready();
    // If the page is already loaded, run the ready function
}

function ready() {
    let removeCartButtons = document.getElementsByClassName(`btn-danger`);
    // Grabs all the remove buttons and stores them all in an array
    for (var i=0; i < removeCartButtons.length; i++) {
    // Iterates through the array containing the remove from cart buttons
        var button = removeCartButtons[i];
        // Assigns a variable to the element (remove button) currently selected
        button.addEventListener('click', removeFromCart);
        // EventListeners wait for an "event" such as a click to occur, then do something, like execute a function.
        // EventListeners always return an event object(such as the argument supplied above) inside the function that it calls.
    }

    // Same process is repeated below for the quantity inputs, and add to cart buttons. Stores them in arrays, then assigns event listeners to them.

    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i=0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i=0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
    // There's only one purchase button so we don't need a for loop to iterate through the array, we just need to select it and add the event listener.
}

function purchaseClicked() {
    alert('Thank you for your purchase');
    // alert() creates a pop up window.
    var cart = document.getElementsByClassName('cart-items')[0];
    // Grabs the cart. NOTE: id instead of class
    while (cart.hasChildNodes()) {
    // .hasChildNodes checks if that element has any child elements
        cart.removeChild(cart.firstChild);
        // Remove the children elements, in this case items in the cart
    }
    updateTotalCost();
}

function removeFromCart(event) {
    var removeCartButton = event.target;
    // Every event object has a target property, that refers to the button with the onclick attribute that caused the event.
    removeCartButton.parentElement.parentElement.remove()
    // The div that contains the entire entry for this item in the cart is two levels up, so we need to use .parentelement twice to grab what we need
    // .remove() deletes that div
    updateTotalCost();
}

function quantityChanged(event) {
    var input = event.target;
    // Grabs the input value
    if (isNaN(input.value) || input.value <= 0) {
    // If the value is not a number, or less than zero...
        input.value = 1;
        // Then set it equal to 1
    }
    updateTotalCost();
}

function addToCartClicked(event) {
    var button = event.target;
    // Grabs the button that was clicked
    var shopItem = button.parentElement.parentElement;
    // Grabs the div containing the whole item and it's related information that the clicked button is in.
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    addItemToCart(title, price, imageSrc);
    // Grabs the title, price and imageSrc, and runs addItemToCart() with these values as arguments
    updateTotalCost();
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    // Creates a div for an item
    cartRow.classList.add('cart-row');
    // Adds a class for for proper referencing and styles
    var cart = document.getElementsByClassName('cart-items')[0];
    // Grabs the cart(div containing all the divs that contain the items and all their related information)
    var cartItemNames = cart.getElementsByClassName('cart-item-title');
    // Grabs the names of all the items
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Duplicate item');
            return;
        }
    }
    // Loops through the names of all the items already in the cart and ensures none of the names match, eliminating the possibility of duplicates.
    cartRowContents = `            
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>`;
    // Creates HTML representing the selected item and it's related information
    cartRow.innerHTML = cartRowContents;
    // Sets the HTML
    cart.append(cartRow);
    // Adds the item to the cart
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeFromCart);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
    // Adds event listeners to execute the relataed functions for the remove button and quantity input
}

function updateTotalCost() {
    // To calculate total cost, we need the cost of every item in the cart. So first, we need to grab those items.  
    var cart = document.getElementsByClassName('cart-items')[0];
    // This grabs the cart. We grab this first instead of searching the entire document because we only want to search the cart.
    // NOTE - REVIEW: In this particular instance, do I need the index indicator since there's only item in the `cart-items` class?
    var cart = cart.getElementsByClassName('cart-row');
    // This grabs all the items and all their related information. Note that cart replaces document in this instance.
    var totalCost = 0;
    // Sets a variable to keep track of the cost
    for (var i=0; i < cart.length; i++) {
    // Performs the following actions for every item in the cart
        var cartItem = cart[i];
        // Assigns a variable to identify the item currently going through the loop
        var priceElement = cartItem.getElementsByClassName('cart-price')[0];
        var quantityElement = cartItem.getElementsByClassName('cart-quantity-input')[0];
        // Grabs the price and quantity of the current item
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        // parseFloat will turn any string into a float, which is a number with decimal points after it.
        // .replace replaces the first character with the second character, effectively removing the dollar sign
        // Now we can use it as a value to calculate the cost
        var quantity = quantityElement.value;
        // Since quantity is an input, we need to access the value attribute to get a number
        totalCost = totalCost + (price * quantity);
        // The price is multiplied by the quantity, and the result is added to the total cost of the cart.
        // Since we are in a loop, this is done for every category(t-shirt, coffee mug, etc) of item in the cart.
    }
    totalCost = Math.round(totalCost * 100) / 100
    // Rounds the total cost
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + totalCost
    // Updates the inner text of the <span> that displays the totalCost to reflect the new totalCost
    // NOTE: Again, we use an index number to select an item from an array of one. It's in an array because .getElementsByClassName is constructed to return several values
    // We could use getElementByID, but classes are more flexible in certain situations.
}


