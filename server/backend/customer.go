package backend

import (
	"github.com/can-z/pickup/server/domaintype"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// GetAllCustomers gets all customers
func GetAllCustomers() []domaintype.Customer {
	db, err := gorm.Open(sqlite.Open("local.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	var allCustomers []domaintype.Customer

	db.Find(&allCustomers)

	return allCustomers
}

// PopulateCustomerTable is a temp method to populate the db to support front end dev.
func PopulateCustomerTable() {
	db, err := gorm.Open(sqlite.Open("local.db"), &gorm.Config{})
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
