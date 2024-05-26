var produit = JSON.parse(localStorage.getItem("produit-panier"));
$.each(produit, function(index, coffee) {
    $(".products").append(`
        <div class='card-product' data-name='${coffee.name}'>
            <div class='img'><img src='${coffee.image_url}' alt='${coffee.name}'></div>
            <div class='info'>
                <p class='cat'>${coffee.category}</p>
                <p class='nom'>${coffee.name}</p>
                <p class='prix'>${parseFloat(parseInt(coffee.price_before) - (parseInt(coffee.price_before) * coffee.promotion)).toFixed(2)}</p>
                <p class='nb_qt' value='1'>1</p>
            </div>
            
            <div class='qte'>
                <input type='range' max='${coffee.quantite_de_produit}' min='0' class='qte-slider' value='1'>
                <div class='total' value='15'>${parseFloat(parseInt(coffee.price_before) - (parseInt(coffee.price_before) * coffee.promotion)).toFixed(2)}</div>
            </div>
            <div class='btns'>
            <button class='supprimer'>
                <i class="fa-solid fa-trash"></i> Supprimer
            </button>
        </div>
    `);
});
var n=0;
$(".qte-slider").on("input", function() {
    var qte = parseInt($(this).val());
    var cardProduct = $(this).closest(".card-product");
    cardProduct.find(".nb_qt").text(qte);
    cardProduct.find(".nb_qt").val(qte);
    var price = parseFloat(cardProduct.find(".prix").text());
    var total = (price * qte).toFixed(2);
    cardProduct.find(".total").text(total);
    cardProduct.find(".total").val(total);
    updateTotalAll();
});
updateTotalAll()
function updateTotalAll() {
    var totalAll = 0;
    $(".card-product").each(function() {
        totalAll += parseFloat($(this).find(".total").text());
    });
    $("#total-tous").text(totalAll.toFixed(2));
    $("#total-tous").val(totalAll.toFixed(2));
}

$(document).on("click", ".supprimer", function() {
    $(this).closest(".card-product").remove();
    updateTotalAll();
});

$(document).on("click", ".supprimer", function() {
    var parent = $(this).closest(".card-product");
    var productName = parent.data("name");

    parent.remove();

    produit = produit.filter(function(coffee) {
        return coffee.name !== productName;
    });

    localStorage.setItem("produit-panier", JSON.stringify(produit));

});
function saveProductsToLocalStorage() {
    // Select all product cards
    const $products = $('.card-product');
    
    // Create an array to hold the product data
    let productsArray = [];

    $products.each(function() {
        const $product = $(this);
        
        // Extract product details
        const name = $product.find('.info .nom').text();
        const category = $product.find('.info .cat').text();
        const price = parseFloat($product.find('.info .prix').text());
        const quantity = parseInt($product.find('.qte .qte-slider').val());
        const total = parseFloat($product.find('.qte .total').text());
        const image = $product.find('.img img').attr('src');

        // Push the product data to the array
        productsArray.push({
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            total: total,
            image: image
        });
         
    });
    var prix_total=$("#total-tous").val();
    productsArray.push(prix_total);
    // Save the array to localStorage
    localStorage.setItem('cartProducts', JSON.stringify(productsArray));
}

$('#btn-acheter').on('click', function(){
    var products=JSON.parse(localStorage.getItem("produit-panier")) || [];
    if(products.length==0){
        if(confirm("Votre panier est vide, please ajouter un produit sur le panier?")){
            window.location.href = 'index.html';
        }else{
            window.location.href="panier.html"
    }
}else{
    saveProductsToLocalStorage();
    window.location.href = 'finAchat.html';
}
});
const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = "login.html";
        });