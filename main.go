package main

import (
	"appengine"
	"appengine/urlfetch"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
)

func init() {
	http.Handle("/", http.FileServer(http.Dir("frontend")))
	http.HandleFunc("/weather", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {

	urlv, _ := url.ParseQuery(r.URL.RawQuery)
	city := urlv.Get("city")
	byteData := makeRequest(city, r)
	parsedData := parseJSON(byteData)
	byteResponse := makeByteResponse(parsedData)
	w.Write(byteResponse)

}

type Request struct {
	Query string
}

type WeatherDesc struct {
	Value string
}

type Current_Condition struct {
	FeelsLikeC     string
	FeelsLikeF     string
	Humidity       string
	Pressure       string
	Temp_C         string
	Temp_F         string
	WeatherDesc    []WeatherDesc
	WindDir16Point string
	WindSpeedKMPH  string
	Visibility     string
	CloudCover     string
}

type Hourly struct{
	TempC   string
	TempF   string
	Time	string
	FeelsLikeF	string
	FeelsLikeC 	string
	WeatherDesc	[]WeatherDesc
}

type HourlyResponse struct{
	TempC   string
	TempF   string
	Time	string
	FeelsLikeC	string
	FeelsLikeF 	string
	WeatherDesc	string
}

type Astronomy struct{
	Moonrise	string
	Moonset		string
	Sunrise		string
	Sunset		string
}

type Weather struct {
	Astronomy []Astronomy
	Date     string
	Hourly	[]Hourly
	MaxTempC string
	MaxTempF string
	MinTempC string
	MinTempF string
}

type MainData struct {
	Current_Condition []Current_Condition
	Request           []Request
	Weather           []Weather
}

type WeatherData struct {
	Data MainData
}

type ResponseError struct {
	Error string
}

//Struct to Give Response
type ResponseData struct {
	Weather       []Weather
	FeelsLikeC    string
	FeelsLikeF    string
	Humidity      string
	Pressure      string
	TempC         string
	TempF         string
	Description   string
	WindDirection string
	WindSpeed     string
	Visibility    string
	CloudCover    string
}

func makeRequest(city string, r *http.Request) []byte {
	// API key
	key := "3e66e42fe72931a1840af63fba747"

	reqURL, err := url.Parse("http://api.worldweatheronline.com")
	if err != nil {
		log.Print(err)
	}
	//Setting Path for URL
	reqURL.Path = "premium/v1/weather.ashx"

	// Creating Query
	query := reqURL.Query()
	query.Set("q", city)
	query.Set("format", "json")
	query.Set("key", key)

	//Adding query to URL
	reqURL.RawQuery = query.Encode()

	//Changing reqURL to String
	finalURL := reqURL.String()

	c := appengine.NewContext(r)
	client := urlfetch.Client(c)

	requestResponse, err := client.Get(finalURL)
	if err != nil {
		log.Print(err)
	}

	//Getting Response Body from Response
	response, err := ioutil.ReadAll(requestResponse.Body)
	if err != nil {
		log.Print(err)
		return errorMessage()
	}

	return response
}

func errorMessage() []byte {
	responseError := ResponseError{
		Error: "Bad request",
	}
	errJSON, err := json.Marshal(responseError)
	if err != nil {
		log.Print(err)
	}
	return errJSON
}

func parseJSON(byteResponse []byte) WeatherData {
	var parsedData WeatherData
	err := json.Unmarshal(byteResponse, &parsedData)
	if err != nil {
		log.Print(err)
	}
	return parsedData
}

func makeByteResponse(parsedData WeatherData) []byte {

	if len(parsedData.Data.Request) < 1 {
		return errorMessage()
	}

	responseData := ResponseData{
		FeelsLikeC:    parsedData.Data.Current_Condition[0].FeelsLikeC,
		FeelsLikeF:    parsedData.Data.Current_Condition[0].FeelsLikeF,
		Humidity:      parsedData.Data.Current_Condition[0].Humidity,
		Pressure:      parsedData.Data.Current_Condition[0].Pressure,
		TempC:         parsedData.Data.Current_Condition[0].Temp_C,
		TempF:         parsedData.Data.Current_Condition[0].Temp_F,
		Description:   parsedData.Data.Current_Condition[0].WeatherDesc[0].Value,
		WindSpeed:     parsedData.Data.Current_Condition[0].WindSpeedKMPH,
		WindDirection: parsedData.Data.Current_Condition[0].WindDir16Point,
		Visibility:    parsedData.Data.Current_Condition[0].Visibility,
		CloudCover:    parsedData.Data.Current_Condition[0].CloudCover,
		
	}

	for j:=0; j<5; j++ {
		responseData.

		for i:=0; i<8; i++ {
            responseData.HourlyResponse[i].TempC = parsedData.Data.Weather[0].Hourly[i].TempC
            responseData.HourlyResponse[i].TempF = parsedData.Data.Weather[0].Hourly[i].TempF
            responseData.HourlyResponse[i].Time = parsedData.Data.Weather[0].Hourly[i].Time
            responseData.HourlyResponse[i].FeelsLikeC = parsedData.Data.Weather[0].Hourly[i].FeelsLikeC
            responseData.HourlyResponse[i].FeelsLikeF = parsedData.Data.Weather[0].Hourly[i].FeelsLikeF
            responseData.HourlyResponse[i].WeatherDesc = parsedData.Data.Weather[0].Hourly[i].WeatherDesc[0].Value
	    }

	    for i:=0; i<1; i++ {
	        responseData.Astronomy[i].Moonrise =	parsedData.Data.Weather[0].Astronomy[i].Moonrise
			responseData.Astronomy[i].Moonset =	parsedData.Data.Weather[0].Astronomy[i].Moonset
			responseData.Astronomy[i].Sunrise =	parsedData.Data.Weather[0].Astronomy[i].Sunrise
			responseData.Astronomy[i].Sunset =	parsedData.Data.Weather[0].Astronomy[i].Sunset
	    }
	}

	byteResponse, err := json.Marshal(responseData)
	if err != nil {
		log.Print(err)
		return errorMessage()
	}
	return byteResponse
}
