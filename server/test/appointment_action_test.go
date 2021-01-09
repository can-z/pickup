package test

import (
	"bytes"
	"encoding/json"
	"fmt"
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

func TestAppointmentAction(t *testing.T) {
	appConfig := domaintype.AppConfig{
		DatabaseFile:        "file:appointmentactiontest.db?cache=shared&mode=memory",
		MigrationFolderPath: "..",
		IsTestingMode:       true,
	}
	router, db := app.SetupRouter(appConfig)
	db.SavePoint("test")
	dbmigration.ApplyMigration(appConfig)

	cus := CustomerFactory(db)
	AppointmentFactory(db)
	t.Run("create an appointment action", func(t *testing.T) {
		w := httptest.NewRecorder()
		payload, _ := json.Marshal(gin.H{
			"query": fmt.Sprintf(`mutation {
				createAppointmentAction(appointmentID: "abc", actionType: 1, customerID: "%s") {
				  id
				  actionType
				  createdAt
				  customer{friendlyName}
				  appointment{id}
				}
			  }`, cus.ID),
		})

		req, _ := http.NewRequest("POST", "/graphql", bytes.NewBuffer(payload))
		router.ServeHTTP(w, req)
		var res graphql.Result
		json.Unmarshal(w.Body.Bytes(), &res)
		require.Equal(t, 200, w.Code)
		require.Equal(t, 0, len(res.Errors))
		var aptAction domaintype.AppointmentAction
		dbQueryRes := db.Find(&aptAction)
		assert.Equal(t, int64(1), dbQueryRes.RowsAffected)
		db.RollbackTo("test")
	})
}
