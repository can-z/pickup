package customer

import (
	"errors"

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

// GetCustomer gets a customer by ID
func (svc Svc) GetCustomer(id string) (*domaintype.Customer, error) {

	var cus domaintype.Customer

	result := svc.db.Where(&domaintype.Customer{ID: id}).First(&cus)
	if result.RowsAffected == 0 {
		return nil, errors.New("customer not found")
	}
	return &cus, nil
}

// CreateCustomer creates a new customer
func (svc Svc) CreateCustomer(cus *domaintype.Customer) (*domaintype.Customer, error) {
	if len(cus.FriendlyName) == 0 {
		return nil, errors.New("friendlyName cannot be empty")
	}

	if len(cus.PhoneNumber) == 0 {
		return nil, errors.New("phoneNumber cannot be empty")
	}
	var customerWithSamePhoneNumber domaintype.Customer
	result := svc.db.Where(&domaintype.Customer{PhoneNumber: cus.PhoneNumber}).First(&customerWithSamePhoneNumber)
	if result.RowsAffected > 0 {
		return nil, errors.New("phoneNumber already exists")
	}
	id := uuid.New()
	customer := domaintype.Customer{ID: id.String(), FriendlyName: cus.FriendlyName, PhoneNumber: cus.PhoneNumber}
	svc.db.Create(&customer)
	return &customer, nil
}

// DeleteCustomer deletes a customer
func (svc Svc) DeleteCustomer(customerID string) error {
	if len(customerID) == 0 {
		return errors.New("id cannot be empty")
	}
	result := svc.db.Delete(&domaintype.Customer{ID: customerID})
	if result.RowsAffected == 0 {
		return errors.New("id not found")
	}
	return result.Error
}
