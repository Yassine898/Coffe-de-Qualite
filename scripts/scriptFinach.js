$(document).ready(function () {
    $("#payer").click(function (e) {
        e.preventDefault();
        if (validation()) {
            setInterval(function () {
                localStorage.setItem("produit-panier", JSON.stringify([]));
                localStorage.setItem("cartProducts", JSON.stringify([]));
                window.location.href = "index.html";
            }
                , 5000
            )
            sendEmail()

        };
    })
    function validation() {
        const name = $("#name").val();
        const region = $("#regions").val();
        const ville = $("#villes").val();
        const email = $("#email").val();
        const method_pay = $("#payment-method").val();

        var namepattern = new RegExp('^[a-zA-Z]+$');
        var emailpattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

        if (!namepattern.test(name)) {
            $(".ername").text("Please enter a valid name!!!");
            return false;
        }

        if (!emailpattern.test(email)) {
            $(".eremail").text("Please enter a valid email!!!");
            return false;
        }

        if (region === '') {
            $(".erreg").text("Select a region!!!");
            return false;
        }

        if (ville === '') {
            $(".ervile").text("Select a ville!!!");
            return false;
        }

        if (method_pay === '') {
            $(".erpaymeth").text("Select a payment method!!!");
            return false;
        }

        return true;
    }
    $.getJSON('citys.json', function (data) {
        $.each(data, function (index, objet) {
            $('#regions').append(
                `<option value='${objet.name}'>${objet.name}</option>`
            );
        });
    });
    $('#regions').change(function () {
        const selectedRegion = $(this).val();
        const citiesSelect = $('#villes');
        citiesSelect.empty(); // Clear previous cities

        // Fetch cities based on selected region from citys.json
        $.getJSON('citys.json', function (data) {
            const regionData = data.find(region => region.name === selectedRegion);
            if (regionData && regionData.cities) {
                $.each(regionData.cities, function (index, city) {
                    citiesSelect.append($('<option>').val(city).text(city));
                });
            }
        }).fail(function (jqxhr, textStatus, error) {
            console.error('Error loading the cities:', textStatus + ", " + error);
        });
    });
    var listpr = JSON.parse(localStorage.getItem("cartProducts")) || [];
    function sendEmail() {
        let emailContent = `########Cart Products########`;
        for (let i = 0; i < listpr.length; i++) {
            if (i == listpr.length - 1) {
                emailContent += `
                Le prix Final :${listpr[i]} DH
                
                Merci pour acheter notre produits!!!`;
            } else {
                emailContent += `
                Nom de produit ${i+1}:${listpr[i]['name']}
    Le prix pour un produit: ${listpr[i]['price']} DH
    La quantite acheter: ${listpr[i]['quantity']} Piece
    Le prix total:${listpr[i]['total']} DH`;
            }
        }
        emailContent += "";
        var to = $("#email").val();
        (function () {
            emailjs.init("l36vwBkalI1ehJiSN");
        })();

        var params = {
            from_name: "Coffee de Qualite",
            message: emailContent,
            to_name: to
        };

        var serviceID = "service_z1hemml";
        var templateID = "template_cpychou";
        emailjs.send(serviceID, templateID, params);
    }
});

