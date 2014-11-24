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

type Weather struct {
	Date     string
	TempMaxC string
	TempMaxF string
	TempMinC string
	TempMinF string
}

type MainData struct {
	Request []Request
	Weather []Weather
}

type WeatherData struct {
	Data MainData
}

type ResponseError struct {
	Error string
}

//Struct to Give Response
type ResponseData struct {
	Query    string
	Date     string
	TempMaxC string
	TempMaxF string
	TempMinC string
	TempMinF string
}

func makeRequest(city string, r *http.Request) []byte {
	// API key
	key := "a2accbe0876ad82a3f082702f678651193deb683"

	reqURL, err := url.Parse("http://api.worldweatheronline.com")
	if err != nil {
		log.Print(err)
	}
	//Setting Path for URL
	reqURL.Path = "free/v1/weather.ashx"

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
		Query:    parsedData.Data.Request[0].Query,
		Date:     parsedData.Data.Weather[0].Date,
		TempMaxC: parsedData.Data.Weather[0].TempMaxC,
		TempMaxF: parsedData.Data.Weather[0].TempMaxF,
		TempMinC: parsedData.Data.Weather[0].TempMinC,
		TempMinF: parsedData.Data.Weather[0].TempMinF,
	}

	byteResponse, err := json.Marshal(responseData)
	if err != nil {
		log.Print(err)
		return errorMessage()
	}
	return byteResponse
}
