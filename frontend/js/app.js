// jQuery to collapse the navbar on scroll

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

var jsonResponse = 1;
var errorLabel;
var resultDiv;
var astronomy;
var dailyForecastResults;
var optTable;

function sendRequest(){
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
                    astronomy.style.visibility = "hidden";
                    optTable.style.visibility = "hidden"
                    dailyForecastResults.style.visibility = "hidden";
                }
                else{   
                    jsonResponse = jsonObj
                    currentCondition(jsonObj);
                }
            }
        });
    } 
}

function init() {
   var options = {
          types: ['(cities)']
        };
    var input1 = document.getElementById('city');
    var autocomplete = new google.maps.places.Autocomplete(input1,options);
    var table = document.getElementById("optTable");
    var rows = table.getElementsByTagName("tr");
    errorLabel = document.getElementById("errorLabel");
    resultDiv =  document.getElementById("result");
    astronomy = document.getElementById("astronomy");
    dailyForecastResults = document.getElementById("dailyForecastResults");
    optTable = document.getElementById("optTable");
    table.rows[0].onclick = function(){
        currentCondition(jsonResponse);
    }
    table.rows[1].onclick = function(){
        hourlyForecast(jsonResponse);
    }
    table.rows[2].onclick = function(){
        fiveDayForecast(jsonResponse);   
    }
    table.rows[3].onclick = function(){
        monthlyAverages(jsonResponse, 0);
    }
}
google.maps.event.addDomListener(window, 'load', init);

function currentCondition(jsonObj){
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
            var Sunrise = jsonObj.Sunrise
            var Sunset = jsonObj.Sunset
            var Moonrise = jsonObj.Moonrise
            var Moonset = jsonObj.Moonset
            var Image = jsonObj.Image
            document.getElementById("currImg").src = Image
            $('#result #City').html(city)
            $('#result #Date').html(date);
            $('#result #TempMax').html(tempMaxC+"&deg;C / "+tempMaxF+"&deg;F");
            $('#result #TempMin').html(tempMinC+"&deg;C / "+tempMinF+"&deg;F");
            $('#result #CurrentTemp').html(currentC+"&deg;C / "+currentF+"&deg;F &nbsp;&nbsp;feels like&nbsp;&nbsp; "+feelsLikeC+"&deg;C / "+feelsLikeF+"&deg;F"); 
            $('#result #Humidity').html(humidity+"%");
            $('#result #Pressure').html(pressure+" mb");
            $('#result #Description').html(description);
            $('#result #Wind').html(WindSpeed+" mph "+WindDirection);
            $('#result #Visibility').html(Visibility+" KM");
            $('#result #CloudCover').html(CloudCover+"%");
            $('#astronomy #Sunrise').html(Sunrise);
            $('#astronomy #Sunset').html(Sunset);
            $('#astronomy #Moonrise').html(Moonrise);
            $('#astronomy #Moonset').html(Moonset);
            resultDiv.style.visibility = "visible";
            astronomy.style.visibility = "visible";
            optTable.style.visibility = "visible"
            dailyForecastResults.style.visibility = "hidden";

}
function fiveDayForecast(jsonObj){
    $('#dailyForecastResults').empty();
    dailyForecastResults.style.visibility = "visible";
    resultDiv.style.visibility = "hidden";
    astronomy.style.visibility = "hidden";
    for(var i=0; i<5; i++){
        var date = jsonObj.WeatherResponse[i].Date;
        var tempMaxC = jsonObj.WeatherResponse[i].TempMaxC;
        var tempMaxF = jsonObj.WeatherResponse[i].TempMaxF;
        var tempMinC = jsonObj.WeatherResponse[i].TempMinC;
        var tempMinF = jsonObj.WeatherResponse[i].TempMinF;
        var Sunrise = jsonObj.WeatherResponse[i].Astronomy.Sunrise;
        var Sunset = jsonObj.WeatherResponse[i].Astronomy.Sunset;
        var Moonrise = jsonObj.WeatherResponse[i].Astronomy.Moonrise;
        var Moonset = jsonObj.WeatherResponse[i].Astronomy.Moonset;
        $('#dailyForecast #Date').html(date);
        $('#dailyForecast #MaxTemp').html(tempMaxC+"&deg;C / "+tempMaxF+"&deg;F");
        $('#dailyForecast #MinTemp').html(tempMinC+"&deg;C / "+tempMinF+"&deg;F");
        $('#dailyForecast #Sunrise').html(Sunrise);
        $('#dailyForecast #Sunset').html(Sunset);
        $('#dailyForecast #Moonrise').html(Moonrise);
        $('#dailyForecast #Moonset').html(Moonset);
        $('#dailyForecastResults').append($('#dailyForecast').html());
        
    }
}
function hourlyForecast(jsonObj){
    $('#dailyForecastResults').empty();
    dailyForecastResults.style.visibility = "visible";
    resultDiv.style.visibility = "hidden";
    astronomy.style.visibility = "hidden";
    for (var i = 0; i < 8; i++) {
        var TempC = jsonObj.WeatherResponse[0].HourlyResponse[i].TempC;
        var TempF = jsonObj.WeatherResponse[0].HourlyResponse[i].TempF;
        var FeelsLikeC = jsonObj.WeatherResponse[0].HourlyResponse[i].FeelsLikeC;
        var FeelsLikeF = jsonObj.WeatherResponse[0].HourlyResponse[i].FeelsLikeF;
        var Time = jsonObj.WeatherResponse[0].HourlyResponse[i].Time;
        if(Time.length == 3){
            Time = "0"+Time;
        }
        else if(Time.length == 2){
            Time = "00"+Time;
        }
        else if(Time.length == 1){
            Time = "000"+Time;
        }
        var ModTime = Time.slice(0,-2)+":"+Time.slice(-2);
        var Description = jsonObj.WeatherResponse[0].HourlyResponse[i].WeatherDesc;
        var Image = jsonObj.WeatherResponse[0].HourlyResponse[i].Image;
        document.getElementById('hourlyImg').src = Image;
        $('#hourlyForecast #Time').html(ModTime);
        $('#hourlyForecast #Temperature').html(TempC+"&deg;C / "+TempF+"&deg;F");
        $('#hourlyForecast #FeelsLike').html(FeelsLikeC+"&deg;C / "+FeelsLikeF+"&deg;F");
        $('#hourlyForecast #Description').html(Description);
        $('#dailyForecastResults').append($('#hourlyForecast').html());
    }
}
function monthlyAverages(jsonObj){
    $('#dailyForecastResults').empty();
    dailyForecastResults.style.visibility = "visible";
    resultDiv.style.visibility = "hidden";
    astronomy.style.visibility = "hidden";
    for (var i = 0; i <12; i++) {
        var Month = jsonObj.MonthlyResponse[i].Name;
        var AbsMaxTempC = jsonObj.MonthlyResponse[i].AbsMaxTempC;
        var AbsMaxTempF = jsonObj.MonthlyResponse[i].AbsMaxTempF;
        var AvgMinTempC = jsonObj.MonthlyResponse[i].AvgMinTempC;
        var AvgMinTempF = jsonObj.MonthlyResponse[i].AvgMinTempF;
        $('#monthlyForecast #Month').html(Month);
        $('#monthlyForecast #AbsMax').html(AbsMaxTempC+"&deg;C / "+AbsMaxTempF+"&deg;F");
        $('#monthlyForecast #AvgMin').html(AvgMinTempC+"&deg;C / "+AvgMinTempF+"&deg;F");
        $('#dailyForecastResults').append($('#monthlyForecast').html());
    };
}