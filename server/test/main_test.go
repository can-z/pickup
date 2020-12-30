package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/can-z/pickup/server/app"
	"github.com/can-z/pickup/server/dbmigration"
	"github.com/can-z/pickup/server/domaintype"
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestMain(t *testing.T) {
	appConfig := domaintype.AppConfig{
		DatabaseFile:        "file:test.db?cache=shared&mode=memory",
		MigrationFolderPath: "..",
		IsTestingMode:       true,
	}
	router, db := app.SetupRouter(appConfig)
	db.SavePoint("test")
	dbmigration.ApplyMigration(appConfig)

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
		db.RollbackTo("test")
	})

	t.Run("create customers", func(t *testing.T) {
		var cus domaintype.Customer
		result := db.First(&cus)
		assert.Equal(t, int64(0), result.RowsAffected)

		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createUser{createUser(friendlyName:"a", phoneNumber:"123456789"){
				id
			  }}`,
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		require.Equal(t, 200, w.Code)
		result = db.First(&cus)
		require.Equal(t, int64(1), result.RowsAffected)
		assert.Equal(t, "a", cus.FriendlyName)
		assert.Equal(t, "123456789", cus.PhoneNumber)

		// create a second user with the same phone number
		w = httptest.NewRecorder()
		payload, _ = json.Marshal(gin.H{
			"query": `mutation createUser{createUser(friendlyName:"a", phoneNumber:"123456789"){
				id
			  }}`,
		})

		req, _ = http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		require.Equal(t, 200, w.Code)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		require.Equal(t, 200, w.Code)
		require.Equal(t, "phoneNumber already exists", res.Errors[0].Message)
		db.RollbackTo("test")
	})

	t.Run("create customer with empty name", func(t *testing.T) {
		var cus domaintype.Customer
		result := db.First(&cus)
		assert.Equal(t, int64(0), result.RowsAffected)

		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createUser{createUser(friendlyName:"", phoneNumber:"123456789"){
				id
			  }}`,
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		require.Equal(t, 200, w.Code)
		require.Equal(t, "friendlyName cannot be empty", res.Errors[0].Message)
		result = db.First(&cus)
		require.Equal(t, int64(0), result.RowsAffected)
		db.RollbackTo("test")
	})

	t.Run("create customer with empty phoneNumber", func(t *testing.T) {
		var cus domaintype.Customer
		result := db.First(&cus)
		assert.Equal(t, int64(0), result.RowsAffected)

		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createUser{createUser(friendlyName:"Can", phoneNumber:""){
				id
			  }}`,
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		require.Equal(t, 200, w.Code)
		require.Equal(t, "phoneNumber cannot be empty", res.Errors[0].Message)
		result = db.First(&cus)
		require.Equal(t, int64(0), result.RowsAffected)
		db.RollbackTo("test")
	})

}
