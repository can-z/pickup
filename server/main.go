package main

import (
	"fmt"

	"github.com/can-z/pickup/server/app"
	"github.com/can-z/pickup/server/domaintype"
	"github.com/spf13/viper"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
	fmt.Println("Populating test server data")
	db.Create(&domaintype.Customer{ID: "1", FriendlyName: "Roger", PhoneNumber: "6471111111"})
	db.Create(&domaintype.Customer{ID: "2", FriendlyName: "Wei", PhoneNumber: "6472222222"})
	db.Create(&domaintype.Customer{ID: "3", FriendlyName: "Can", PhoneNumber: "6473333333"})
	db.Create(&domaintype.Customer{ID: "4", FriendlyName: "Stella", PhoneNumber: "6474444444"})
	db.Create(&domaintype.Customer{ID: "5", FriendlyName: "Hui", PhoneNumber: "6475555555"})
}

func main() {
	runtimeViper := viper.New()
	runtimeViper.SetDefault("databaseFile", "local.db")
	appConfig := domaintype.AppConfig{
		DatabaseFile:        runtimeViper.GetString("databaseFile"),
		MigrationFolderPath: ".",
	}
	populateCustomerTable(appConfig)
	r, _ := app.SetupRouter(appConfig)
	_ = r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
