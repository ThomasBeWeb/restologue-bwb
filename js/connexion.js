
console.log("OK");


function checkLogin(){
    
    console.log("Fonction active");
    
    var testLogin = $("#username").val();
    var testPwd = $("#password").val();
    
        var testUser = {
                username: testLogin,
                password: testPwd
        };
        
    $.ajax({
        type:"POST",
        url:"http://api.users.bwb:8282/verify",
        data: testUser,
        
        statusCode: {
                    200: function () {
                        window.location.href = "./index.html";
                    },
                    401: function () {
                        alert("Probleme login et/ou paswword");
                    }
                }
    });
}

