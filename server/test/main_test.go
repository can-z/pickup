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
	"github.com/stretchr/testify/assert"
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

	t.Run("create customer", func(t *testing.T) {
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

		assert.Equal(t, 200, w.Code)
		result = db.First(&cus)
		assert.Equal(t, int64(1), result.RowsAffected)
		assert.Equal(t, "a", cus.FriendlyName)
		assert.Equal(t, "123456789", cus.PhoneNumber)
		db.RollbackTo("test")
	})

	t.Run("create another customer", func(t *testing.T) {
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

		assert.Equal(t, 200, w.Code)
		result = db.First(&cus)
		assert.Equal(t, int64(1), result.RowsAffected)
		assert.Equal(t, "a", cus.FriendlyName)
		assert.Equal(t, "123456789", cus.PhoneNumber)
		db.RollbackTo("test")
	})

}
