package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/can-z/pickup/server/domaintype"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
	appConfig := domaintype.AppConfig{
		DatabaseFile: ":memory:",
	}
	router := setupRouter(appConfig)

	w := httptest.NewRecorder()
	payload, _ := json.Marshal(gin.H{
		"query": `{
			customers{
			  customerId
			}
		  }`,
	})

	req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	expectedResponse, _ := json.Marshal(gin.H{
		"data": gin.H{
			"customers": []domaintype.Customer{},
		},
	})
	assert.Equal(t, string(expectedResponse), w.Body.String())
}
