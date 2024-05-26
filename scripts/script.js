const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser == null) {
    window.location.href = "register.html";
} else {
    $(document).ready(function () {
        fetchPopularCoffees();

        document.querySelector(".user-name").innerHTML = `${currentUser['username']}`;

        function fetchPopularCoffees() {
            $.getJSON('coffees.json', function (data) {
                searchInStore(data);
                filterprix(data);
                $.each(data, function (index, coffee) {
                    getProduct(coffee);
                });
                const uniqueCategories = [...new Set(data.map(coffee => coffee.category))];
                $.each(uniqueCategories, function (index, category) {
                    $("#categorys").append(`<option value="${category}">${category}</option>`);
                });
            });
        }

        $("#categorys").change(() => {
            var selectedCategory = $("#categorys").val();
            $.getJSON('coffees.json', function (data) {
                $("#popular-coffees").empty();
                var filteredCoffees = data.filter(coffee => coffee.category === selectedCategory || selectedCategory === "All");
                if (filteredCoffees.length === 0) {
                    $("#popular-coffees").append(`<div class="not-exist">Not available in stock for now</div>`);
                } else {
                    $.each(filteredCoffees, function (index, coffee) {
                        getProduct(coffee);
                    });
                }
            });
        });

        $("#search1").click(function (e) {
            e.preventDefault();
            $("#search").css("display", "block");
            $(document.body).css("overflow", "hidden");
        });

        $(".icon-close").click(function () {
            $("#search").css("display", "none");
            $(document.body).css("overflow-y", "auto");
        });

        var listeProduitPanier = JSON.parse(localStorage.getItem("produit-panier")) || [];
        var nb_product_ajouter = listeProduitPanier.length;
        $(".qnt").text(nb_product_ajouter);
        $(document).on('click', '.add-to-cart', function (e) {
            e.preventDefault();
            const parent = $(this).parent()[0];
            const productName = parent.getAttribute("value");

            const productExists = listeProduitPanier.some(product => product.name === productName);

            if (!productExists) {
                $.getJSON('coffees.json', function (data) {
                    const coffee = data.find(coffee => coffee.name === productName);
                    if (coffee) {
                        listeProduitPanier.push(coffee);
                        localStorage.setItem("produit-panier", JSON.stringify(listeProduitPanier));
                        nb_product_ajouter = listeProduitPanier.length;
                        $(".qnt").text(nb_product_ajouter);
                    }
                });
            }
        });

        function filterprix(data){
            document.getElementById('filter-button').addEventListener('click', function() {
            const minPrice = document.getElementById('min-price').value;
            const maxPrice = document.getElementById('max-price').value;
            const filteredProducts = data.filter(product => {
                var prix=product.price_before-(product.price_before*product.promotion)
                return prix >= minPrice && prix <= maxPrice;
            });
            $('#popular-coffees').empty();
            $.each(filteredProducts,function(index,coffee){
                getProduct(coffee);
            })
        })
    }
        function searchInStore(data) {
            $(document).on('click', '.icon-search', function (e) {
                e.preventDefault();
                var valueSearch = $("#input-search").val().toLowerCase();
                var exist = false;
                $("#popular-coffees").empty();
                $.each(data, function (index, coffee) {
                    var name = coffee.name.toLowerCase();
                    var category = coffee.category.toLowerCase();
                    var prix = coffee.price_before.toString();
                    var promotion = coffee.promotion.toString();
                    if (name.startsWith(valueSearch) || category.startsWith(valueSearch) || prix.startsWith(valueSearch) || promotion.startsWith(valueSearch)) {
                        exist = true;
                        getProduct(coffee);
                        $("#search").css("display", "none");
                        $(document.body).css("overflow-y", "auto");
                    }
                });
                if (!exist) {
                    $("#popular-coffees").append(`<div class="not-exist">Not available product with this name: ${valueSearch}</div>`);
                    $("#search").css("display", "none");
                    $(document.body).css("overflow", "auto");
                    $("#input-search").val("");
                }
            });
        }

        function getProduct(coffee) {
            
            $('#popular-coffees').append(`
                <div class="coffee-card" value="${coffee.name}">
                <div class='place-image'>
                    <img src="${coffee.image_url}" alt="${coffee.name}"></div>
                    <h2>${coffee.name}</h2>
                    <p>Catégorie: <span>${coffee.category}</span></p>
                    <p>Prix-before: <span style="text-decoration: line-through;">${parseInt(coffee.price_before)}</span> DH</p>
                    <p>Prix: <span>${parseFloat(parseInt(coffee.price_before) - (parseInt(coffee.price_before) * coffee.promotion))}</span> DH</p>
                    <p>Promotion: <span>${coffee.promotion}</span> %</p>
                    <button class="add-to-cart">Ajouter au panier</button>
                </div>
            `);
        }
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = "login.html";
        });
        $(".panier").on("click", function (e) {
            e.preventDefault();
            window.location.href = "panier.html";
        });
    });
   }
