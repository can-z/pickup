package domaintype

// Customer is the domain representation of a customer
type Customer struct {
	CustomerID   string
	PhoneNumber  string
	FriendlyName string
}

// Sms represents a message
type Sms struct {
	Customer Customer
	Body     string
}

// TableName implements the Tabler interface in GORM to specify table name for the Customer model
func (Customer) TableName() string {
	return "customer"
}
