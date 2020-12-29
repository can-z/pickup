package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/can-z/pickup/server/dbmigration"
	"github.com/can-z/pickup/server/domaintype"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMain(t *testing.T) {
	appConfig := domaintype.AppConfig{
		DatabaseFile: "abc",
	}
	dbmigration.ApplyMigration(appConfig)
	router := setupRouter(appConfig)
	t.Run("customers empty", func(t *testing.T) {
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `{
			customers{
			  id
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
	})

	t.Run("create customer", func(t *testing.T) {
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"mutation": `{
				createUser(friendlyName:"a", phoneNumber:"123456789") {
				  id
				}
			  }`,
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		assert.Equal(t, 200, w.Code)
		var jsonResp interface{}
		json.Unmarshal(w.Body.Bytes(), &jsonResp)
		fmt.Println(jsonResp)
	})

}
