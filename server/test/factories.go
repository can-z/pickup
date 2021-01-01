package test

import (
	"time"

	"github.com/can-z/pickup/server/appointment"
	"github.com/can-z/pickup/server/customer"
	"github.com/can-z/pickup/server/domaintype"
	"gorm.io/gorm"
)

// AppointmentFactory creates an appointment for testing
func AppointmentFactory(db *gorm.DB) *domaintype.Appointment {
	svc := appointment.NewAppointmentSvc(db)
	aptmt, _ := svc.CreateAppointment(time.Now(), "1 Yonge st", "")
	return aptmt
}

// CustomerFactory creates an appointment for testing
func CustomerFactory(db *gorm.DB) *domaintype.Customer {
	svc := customer.NewCustomerSvc(db)
	aptmt, _ := svc.CreateCustomer(&domaintype.Customer{FriendlyName: "Bruce Wayne", PhoneNumber: "1111111111"})
	return aptmt
}
