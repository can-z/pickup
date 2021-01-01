package domaintype

import (
	"database/sql/driver"
	"time"
)

// Customer is the domain representation of a customer
type Customer struct {
	ID           string
	PhoneNumber  string
	FriendlyName string
}

// Location represents a location where an appointment can be scheduled.
type Location struct {
	ID      string
	Address string
	Note    string
}

// Appointment represents a time for customers to pick up their items.
type Appointment struct {
	ID         string
	LocationID string
	Location   Location
	Time       IntTime
}

// AppointmentAction stores actions that have been performed for an appointment.
type AppointmentAction struct {
	ID          string
	Appointment Appointment
	Customer    Customer
	Action      AppointmentActionType
	CreatedAt   time.Time
}

// AppointmentActionType represents action types
type AppointmentActionType int

// IntTime is a trick to inject custom scanner and valuer methods.
type IntTime time.Time

// Scan custom scanner
func (it IntTime) Scan(value interface{}) error {
	it = IntTime(time.Unix(value.(int64), 0))
	return nil
}

// Value custom valuer
func (it IntTime) Value() (driver.Value, error) {
	return time.Time(it).Unix(), nil
}

// all possible actions for an appointment
const (
	Draft AppointmentActionType = iota
	Notified
	Accepted
	Nullified
)

// Sms represents a message
type Sms struct {
	ID       string
	Customer Customer
	Body     string
}

// TableName implements the Tabler interface in GORM to specify table name for the Customer model
func (Customer) TableName() string {
	return "customer"
}

// TableName implements the Tabler interface in GORM to specify table name for the Location model
func (Location) TableName() string {
	return "location"
}

// TableName implements the Tabler interface in GORM to specify table name for the Appointment model
func (Appointment) TableName() string {
	return "appointment"
}

// AppConfig stores settings to start a server.
type AppConfig struct {
	DatabaseFile        string
	MigrationFolderPath string
	IsTestingMode       bool
}
