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
	ID            string
	AppointmentID string
	Appointment   Appointment
	CustomerID    string
	Customer      Customer
	ActionType    AppointmentActionEnum
	CreatedAt     IntTime
}

// AppointmentActionEnum represents action types
type AppointmentActionEnum int64

// Scan custom scanner
func (aat AppointmentActionEnum) Scan(value interface{}) error {
	aat = AppointmentActionEnum(value.(int64))
	return nil
}

// Value custom valuer
func (aat AppointmentActionEnum) Value() (driver.Value, error) {
	return int64(aat), nil
}

// IntTime is a trick to inject custom scanner and valuer methods.
type IntTime time.Time

// Scan custom scanner
func (it *IntTime) Scan(value interface{}) error {
	*it = IntTime(time.Unix(value.(int64), 0))
	return nil
}

// Value custom valuer
func (it IntTime) Value() (driver.Value, error) {
	return time.Time(it).Unix(), nil
}

// ToInt returns the unix time as int
func (it IntTime) ToInt() int {
	val := time.Time(it).Unix()
	return int(val)
}

// all possible actions for an appointment
const (
	Draft AppointmentActionEnum = iota
	Notified
	Accepted
	CancelledByStore
	CancelledByCustomer
)

// Sms represents a message
type Sms struct {
	ID       string
	Customer Customer
	Body     string
}

// AppConfig stores settings to start a server.
type AppConfig struct {
	DatabaseFile        string
	MigrationFolderPath string
	IsTestingMode       bool
}
