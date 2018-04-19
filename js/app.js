
$("#checkAll").change(function () {
    $("input:checkbox").prop('checked', $(this).prop("checked"));
});

$(document).ready(function () {
    showCartes();
    showAllMenus();

});


var menuChoisi;
var deleteMenuVar;

// requete get pour récupérer la liste de cartes et l'affiche
function showCartes() {

    var listeCartes;

    $.ajax({
        type: "GET",
        url: "http://192.168.1.59:8181/cartes/get",
        dataType: 'json',
        async: false,
        success: function (data) {
            listeCartes = data;
        },
        error: function (param1, param2) {
            alert("erreur1");
        }
    });

    $("#collapseMulti").empty();

    for (var i = 0; i < listeCartes.length; i++) {

        $("#collapseMulti").append($("<li>")
                .append($("<a>")
                        .attr("href", "#")   //Le # permet de ne pas rafraichir entierement la page après le clic
                        .attr("onclick", "showMeACard(" + listeCartes[i].id + ");")
                        .html(listeCartes[i].nom))
                );

    }

}

// requete post pour ajouter une carte et relancer la fonction showCartes()

function addCarte() {

    var newName = $("#nouveauNomCarte").val();
    if (newName !== "") {
        var carte = {
            id: 0,
            nom: newName,
            menu: []
        };

        $.ajax({
            type: "POST",
            url: "http://192.168.1.59:8181/cartes/add",
            data: carte,
            dataType: 'json',
            async: false,
            success: function (retour) {
                showCartes();

                $("#nouveauNomCarte").val("");
            },
            error: function (retour) {
                alert("erreur de l'envoi");
            }
        });
    }
}

// requete pour afficher une carte après click dans liste gauche

function showMeACard(idCarte) {

    //Vide la carte déjà présente
    $("#listeMenusCarte").empty();
    $("#ajoutCarte").val("");

    var carteAAfficher; //Carte à afficher

    //Recuperation de la carte
    $.ajax({
        type: "GET",
        url: "http://192.168.1.59:8181/cartes/" + idCarte + "/get",
        async: false,
        success: function (data) {
            carteAAfficher = data;
        },
        error: function (param1, param2) {
            alert("erreur2");
        }
    });

    //Ajout du nom de la carte
    $("#ajoutCarte").val(carteAAfficher.nom);

    //Modif de l'action du bouton supprimer
    $("#modalSuppCarte").attr("onclick", "deleteCarte(" + carteAAfficher.id + ");");

    //Recuperation de la liste de ses menus si liste menus pas vide

    if (carteAAfficher.menu.length !== 0) {
        var listeMenus;

        $.ajax({
            type: "GET",
            url: "http://192.168.1.59:8181/cartes/" + idCarte + "/menus/get",
            dataType: 'json',
            async: false,
            success: function (data) {
                listeMenus = data;

            },
            error: function () {
                alert("erreur");
            }
        });

        //Creation d'une ligne par menu

        for (var i = 0; i < listeMenus.length; i++) {

            showMenu(listeMenus[i]);

            $("#listeMenusCarte").append($("<tr>")
                    .append($("<th>")
                            .attr("scope", "row")
                            .text(menuChoisi.id))
                    .append($("<td>").text(menuChoisi.nom))
                    .append($("<td>")
                            .append($("<button>")
                                    .addClass("btn btn-danger")
                                    .attr("type", "button")
                                    .text("Supprimer")
                                    .attr("onclick", "") //AJOUTER FONCTION
                                    )
                            )
                    );
        }
    }


}

// requete get pour récupérer la liste de TOUS les menus et l'afficher dans tableau du bas

function showAllMenus() {

    var listeMenu;
    $.ajax({
        type: "GET",
        url: "http://192.168.1.59:8181/menus/get",
        async: false,
        dataType: 'json',
        success: function (data) {
            listeMenu = data;
        },
        error: function (param1, param2) {
            alert("erreur3");
        }
    });

    $("#ligneMenu").empty();
    for (var i = 0; i < listeMenu.length; i++) {

        $("#ligneMenu").append($("<tr>")
               
                        .append($("<td>").text(listeMenu[i].nom))
                        .append($("<td>").text(listeMenu[i].entree.nom))
                        .append($("<td>").text(listeMenu[i].entree.prix))
                        .append($("<td>").text(listeMenu[i].plat.nom))
                        .append($("<td>").text(listeMenu[i].plat.prix))
                        .append($("<td>").text(listeMenu[i].dessert.nom))
                        .append($("<td>").text(listeMenu[i].dessert.prix))
                        .append($("<td>").append($("<button>")
                            .addClass("btn btn-primary")
                            .attr("type","button")
                            .attr("data-toggle","modal")
                            .attr("data-target","#modifier_menu")
                            .text("Modifier")
                            .attr("onclick","modifMenu("+ listeMenu[i].id + ");"))
                   )     
                        .append($("<td>").append($("<button>")
                            .addClass("btn btn-danger")
                              .attr("type","button")
                            .attr("data-toggle","modal")
                            .attr("data-target","#delete_menu")
                            .text("Supprimer")
                            .attr("onclick","changeMenu("+ listeMenu[i].id + ");"))
                   )     
                        .append($("<td>").append($("<button>")
                            .addClass("btn btn-success")
                            .attr("type","button")
                            .attr("onclick","addMenuToCarte("+listeMenu[i].id+");")
                            .text("Ajouter"))
                   )     
                );
                    
    }
}

// requete get pour récupérer un menu
function showMenu(id) {

    $.ajax({
        type: "GET",
        url: "http://192.168.1.59:8181/cartes/menus/" + id + "/get",
        dataType: 'json',
        async: false,
        success: function (data) {
            menuChoisi = data;
        },
        error: function (param1, param2) {
            alert("erreur4");
        }
    });
}




// requete get pour ajouter un Menu
function addMenu() {

    var menu = {
        id: 0,
        nom: $("#nomDuMenu1").val(),
        entree: {
            nom: $("#nomEntree1").val(),
            prix: $("#prixEntree1").val()
        },
        plat: {
            nom: $("#nomPlat1").val(),
            prix: $("#prixPlat1").val()
        },
        dessert: {
            nom: $("#nomDessert1").val(),
            prix: $("#prixDessert1").val()
        }

    };
 
    $.ajax({
        type: "POST",
        url: "http://192.168.1.59:8181/menus/add",
        data: menu,
        dataType: 'json',
        async:false,
       statusCode: {
                    200: function () {
                    showAllMenus();
                    }         
                }
  
    });
}

// requete pour supprimer une carte

function deleteCarte(id) {

    $.ajax({
        type: "GET",
        url: "http://192.168.1.59:8181/cartes/" + id + "/remove",
        success: function (retour) {
            showCartes();
            $("#listeMenusCarte").empty();
            $("#ajoutCarte").val("");

        },
        error: function (retour) {
            alert("erreur de l'envoi");
        }
    });

}

function deleteMenu(id){

    $.ajax({
        type: "GET",
        url: "http://192.168.1.59:8181/cartes/menus/" + id + "/remove",
        async:false,
       statusCode: {
                    200: function () {
                    showAllMenus();
                    }         
                }
        
    });


}

function changeMenu(id){
//    deleteMenuVar = id;
    $("#modalSuppMenu").attr("onclick","deleteMenu(" + id + ");");
}


