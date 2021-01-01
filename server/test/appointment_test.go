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
	"github.com/stretchr/testify/require"
)

func TestAppointment(t *testing.T) {
	appConfig := domaintype.AppConfig{
		DatabaseFile:        "file:appointmenttest.db?cache=shared&mode=memory",
		MigrationFolderPath: "..",
		IsTestingMode:       true,
	}
	router, db := app.SetupRouter(appConfig)
	db.SavePoint("appointmentTest")
	dbmigration.ApplyMigration(appConfig)

	t.Run("create an appointment", func(t *testing.T) {
		var aptmt domaintype.Appointment
		result := db.First(&aptmt)
		require.Equal(t, int64(0), result.RowsAffected)
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createAppointment{
			createAppointment(time: 1609508032, address: "1 Yonge St." note: ""){
			  id
			}
		  }`,
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		assert.Equal(t, 200, w.Code)
		result = db.First(&aptmt)
		require.Equal(t, int64(1), result.RowsAffected)
		db.RollbackTo("appointmentTest")
	})
}
