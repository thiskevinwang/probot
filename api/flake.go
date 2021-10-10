package handler

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
)

func Flake(w http.ResponseWriter, r *http.Request) {
	// https://golangbyexample.com/net-http-package-get-query-params-golang/
	query := r.URL.Query()
	threshold, present := query["threshold"]
	if !present || len(threshold) == 0 {
		threshold = []string{"70"}
	}

	thresholdInt, err := strconv.Atoi(threshold[0])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "<h1>%v</h1><pre><code>%v</code></pre>", http.StatusBadRequest, err)
		return
	}

	// https://gobyexample.com/random-numbers
	scoreInt := rand.Intn(100)

	if scoreInt < thresholdInt {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "<h1>%v</h1>\n<p>Score: %v</p>\n<p>Threshold: %v</p>", http.StatusInternalServerError, scoreInt, thresholdInt)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>%v</h1>\n<p>Score: %v</p>\n<p>Threshold: %v</p>", http.StatusOK, scoreInt, thresholdInt)
}
