package main

import (
	"github.com/can-z/pickup/server/domaintype"
	"github.com/can-z/pickup/server/gql"
	"github.com/spf13/viper"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/handler"
)

func setupRouter(appConfig domaintype.AppConfig) *gin.Engine {

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	r.Use(cors.New(config))
	schema := gql.Schema(appConfig)

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   false,
		GraphiQL: true,
	})
	r.POST("/graphql", func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	})
	r.GET("/graphql", func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	})
	return r
}

func populateCustomerTable(appConfig domaintype.AppConfig) {
	databaseFileName := appConfig.DatabaseFile
	db, err := gorm.Open(sqlite.Open(databaseFileName), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	var customer domaintype.Customer
	result := db.First(&customer)
	if result.Error == nil {
		return
	}
	db.Create(&domaintype.Customer{CustomerID: "1", FriendlyName: "Roger", PhoneNumber: "6471111111"})
	db.Create(&domaintype.Customer{CustomerID: "2", FriendlyName: "Wei", PhoneNumber: "6472222222"})
	db.Create(&domaintype.Customer{CustomerID: "3", FriendlyName: "Can", PhoneNumber: "6473333333"})
	db.Create(&domaintype.Customer{CustomerID: "4", FriendlyName: "Stella", PhoneNumber: "6474444444"})
	db.Create(&domaintype.Customer{CustomerID: "5", FriendlyName: "Hui", PhoneNumber: "6475555555"})
}

func main() {
	runtimeViper := viper.New()
	runtimeViper.SetDefault("databaseFile", "local.db")
	appConfig := domaintype.AppConfig{
		DatabaseFile: runtimeViper.GetString("databaseFile"),
	}
	populateCustomerTable(appConfig)
	r := setupRouter(appConfig)
	_ = r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
