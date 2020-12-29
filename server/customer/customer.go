package customer

import (
	"github.com/can-z/pickup/server/domaintype"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Svc is the service for customer related operations
type Svc struct {
	db *gorm.DB
}

// NewCustomerSvc creates a new svc instance
func NewCustomerSvc(db *gorm.DB) *Svc {
	return &Svc{db: db}
}

// GetAllCustomers gets all customers
func (svc Svc) GetAllCustomers() []*domaintype.Customer {

	var allCustomers []*domaintype.Customer

	svc.db.Find(&allCustomers)

	return allCustomers
}

// CreateCustomer creates a new customer
func (svc Svc) CreateCustomer(cus *domaintype.Customer) domaintype.Customer {
	id := uuid.New()
	customer := domaintype.Customer{ID: id.String(), FriendlyName: cus.FriendlyName, PhoneNumber: cus.PhoneNumber}
	svc.db.Create(&customer)
	return customer
}
