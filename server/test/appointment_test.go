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

func TestAppointment(t *testing.T) {
	appConfig := domaintype.AppConfig{
		DatabaseFile:        "file:appointmenttest.db?cache=shared&mode=memory",
		MigrationFolderPath: "..",
		IsTestingMode:       true,
	}
	router, db := app.SetupRouter(appConfig)
	db.SavePoint("test")
	dbmigration.ApplyMigration(appConfig)

	t.Run("create an appointment", func(t *testing.T) {
		var aptmt domaintype.Appointment
		result := db.First(&aptmt)
		require.Equal(t, int64(0), result.RowsAffected)
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createAppointment{
			createAppointment(startTime: 1609508032, endTime: 1609509032, address: "1 Yonge St.", note: ""){
			  id
			}
		  }`,
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		assert.Equal(t, 200, w.Code)
		result = db.First(&aptmt)
		require.Equal(t, int64(1), result.RowsAffected)
		require.Equal(t, 1609508032, aptmt.StartTime.ToInt())
		require.Equal(t, 1609509032, aptmt.EndTime.ToInt())
		var loc domaintype.Location
		result = db.First(&loc)
		require.Equal(t, int64(1), result.RowsAffected)
		require.Equal(t, "1 Yonge St.", loc.Address)
		payload, _ = json.Marshal(gin.H{
			"query": `{appointments{
			  id
			  startTime
			  endTime
			  location{
				  id
				  address
			  }
			}}`,
		})

		req, _ = http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
		require.Equal(t, 200, w.Code)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		var allappts []domaintype.Appointment
		data := res.Data.(map[string]interface{})["appointments"]
		domaintype.Decode(data, &allappts)
		require.Equal(t, 1, len(allappts))
		assert.Equal(t, 1609508032, allappts[0].StartTime.ToInt())
		assert.Equal(t, 1609509032, allappts[0].EndTime.ToInt())
		db.RollbackTo("test")
	})

	t.Run("create an appointment with invalid arguments", func(t *testing.T) {
		var aptmt domaintype.Appointment
		result := db.First(&aptmt)
		require.Equal(t, int64(0), result.RowsAffected)
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createAppointment{
			createAppointment(startTime: 1609508032, endTime: 1609509032, address: "", note: ""){
			  id
			}
		  }`,
		}) // Empty address field

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		require.Equal(t, 200, w.Code)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		require.Equal(t, "address cannot be empty", res.Errors[0].Message)
		result = db.First(&aptmt)
		require.Equal(t, int64(0), result.RowsAffected)
		db.RollbackTo("test")
	})

	t.Run("create an appointment with invalid start and end times", func(t *testing.T) {
		var aptmt domaintype.Appointment
		result := db.First(&aptmt)
		require.Equal(t, int64(0), result.RowsAffected)
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": `mutation createAppointment{
			createAppointment(startTime: 1609508032, endTime: 1609507032, address: "1 Yonge St.", note: ""){
			  id
			}
		  }`,
		}) // endTime < startTime

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)

		require.Equal(t, 200, w.Code)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		require.Equal(t, "endTime must be after startTime", res.Errors[0].Message)
		result = db.First(&aptmt)
		require.Equal(t, int64(0), result.RowsAffected)
		db.RollbackTo("test")
	})
}
