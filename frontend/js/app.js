/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
var location;
function getLocation(){


};


$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


function sendRequest(){
    var errorLabel = document.getElementById("errorLabel");
    var resultDiv =  document.getElementById("result");
    var city = $("#city").val();
    if(city == ''){
        errorLabel.innerHTML = "Please enter the city.";
        document.getElementById("errorDiv").style.visibility = "visible";
    }
    else{
        document.getElementById("errorDiv").style.visibility = "hidden";
          $.ajax({
          type: "POST",
          url: "/weather?city="+city,          
          cache: false,
          success: function(result){
            var jsonObj = jQuery.parseJSON(result);
            if(jsonObj.hasOwnProperty('Error')){
                errorLabel.innerHTML = "City Not Found.";
                document.getElementById("errorDiv").style.visibility = "visible";
                resultDiv.style.visibility = "hidden";
            }
            else{           
            var city = jsonObj.Query
            var date = jsonObj.Date
            var tempMaxC = jsonObj.TempMaxC
            var tempMinC = jsonObj.TempMinC
            var tempMaxF = jsonObj.TempMaxF
            var tempMinF = jsonObj.TempMinF
            var currentC = jsonObj.TempC
            var currentF = jsonObj.TempF
            var feelsLikeC = jsonObj.FeelsLikeC
            var feelsLikeF = jsonObj.FeelsLikeF
            var humidity = jsonObj.Humidity
            var pressure = jsonObj.Pressure
            var description = jsonObj.Description
            var WindDirection = jsonObj.WindDirection
            var WindSpeed = jsonObj.WindSpeed
            var Visibility = jsonObj.Visibility
            var CloudCover = jsonObj.CloudCover
            $('#result #City').html(city)
            $('#result #Date').html(date);
            $('#result #TempMax').html(tempMaxC+"&deg;C / "+tempMaxF+"&deg;F");
            $('#result #TempMin').html(tempMinC+"&deg;C / "+tempMinF+"&deg;F");
            $('#result #CurrentTemp').html(currentC+"&deg;C / "+currentF+"&deg;F"); 
            //$('#result #FeelsLike').html(feelsLikeC+"&deg;C / "+feelsLikeF+"&deg;F");
            $('#result #Humidity').html(humidity+"%");
            $('#result #Pressure').html(pressure+" mb");
            $('#result #Description').html(description);
            $('#result #Wind').html(WindSpeed+" mph "+WindDirection);
            $('#result #Visibility').html(Visibility+" KM");
            $('#result #CloudCover').html(CloudCover+"%");
            resultDiv.style.visibility = "visible";
          }}
          });
        } 
}

// Google Maps Scripts
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
   var options = {
          types: ['(cities)']
        };
    var input1 = document.getElementById('city');
    var autocomplete = new google.maps.places.Autocomplete(input1,options);
    
}
