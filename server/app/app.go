package app

import (
	"github.com/can-z/pickup/server/domaintype"
	"github.com/can-z/pickup/server/gql"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/handler"
	"gorm.io/gorm"
)

// SetupRouter sets up the app server
func SetupRouter(appConfig domaintype.AppConfig) (*gin.Engine, *gorm.DB) {

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	r.Use(cors.New(config))
	schema, db := gql.Schema(appConfig)

	h := handler.New(&handler.Config{
		Schema:   schema,
		Pretty:   false,
		GraphiQL: true,
	})
	r.POST("/graphql", func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	})
	r.GET("/graphql", func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	})
	return r, db
}
