$(document).ready(function(){

    weather = [];
    promise = new Promise(function(resolve, reject) {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              lat = position.coords.latitude;
              long = position.coords.longitude;
              resolve();
            });
        }

    });

    promise.then(function(){

        promise2 = new Promise(function(resolve, reject){
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID=9a4e459a0ccacacb8867ab672e11ffcc", function(json){
                //weather = json;
                weather["temp"] = json.main.temp;
                weather["hum"] = json.main.humidity;
                weather["type"] = json.weather[0].main;
                weather["desc"] = json.weather[0].description;
                weather["city"] = json.name;
                weather["wind"] = json.wind.speed;
                weather["sunrise"] = json.sys.sunrise;
                weather["sunset"] = json.sys.sunset;
                resolve();
            });
        });

        promise2.then(function(){
            current_grade = "C";

            $(".city").html(weather["city"]);

            temp = tempConvert(weather["temp"], "K");
            if( temp > 0 ) {
                $(".temp").html( "+" + temp );
            } else if ( temp < 0 ){
                $(".temp").html( "-" + temp );
            }

            $(".switcher").html(current_grade);

            $(".icon").html(setIcon(weather["type"]));
            $(".desc").html(weather["desc"].replace(/\b\w/g, l => l.toUpperCase()));

            date_rise = formatTimestamp( weather["sunrise"] );
            date_set = formatTimestamp( weather["sunset"] );
            $(".sunrise").html( date_rise["hours"]+":"+date_rise["mins"] );
            $(".sunset").html( date_set["hours"]+":"+date_set["mins"] );
            $(".humidity").html(weather["hum"]);
            $(".wind").html(weather["wind"]);
        });

    }, error);





});

    function error() {
        alert(123);
    }

    function formatTimestamp(timestamp){
        date = new Date(timestamp * 1000);
        result = [];
        result["hours"] = date.getHours();
        result["mins"] = date.getMinutes();
        return result;
    }

    function tempConvert(temp, grade){
        if(grade === "C"){
            return (temp*1.8) + 32;
        } else if (grade === "F") {
            return (temp-32)/1.8;
        } else if (grade === "K") {
            return temp - 273.15;
        } else {
            return "Temp error";
        }
    }

    function setIcon(type){
        type = type.toLowerCase();
        switch (type) {
            case "clouds":
                return "<i class='wi wi-day-cloudy'></i>"
                break;
            default:

        }
    }
