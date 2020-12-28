package customer

import (
	"github.com/can-z/pickup/server/domaintype"
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
func (svc Svc) GetAllCustomers() []domaintype.Customer {

	var allCustomers []domaintype.Customer

	svc.db.Find(&allCustomers)

	return allCustomers
}
