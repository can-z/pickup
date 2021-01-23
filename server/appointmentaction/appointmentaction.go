package appointmentaction

import (
	"time"

	"github.com/can-z/pickup/server/domaintype"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Svc is the service for appointment action related operations
type Svc struct {
	db *gorm.DB
}

// NewAppointmentActionSvc creates a new svc instance
func NewAppointmentActionSvc(db *gorm.DB) *Svc {
	return &Svc{db: db}
}

// CreateAppointmentAction creates a new appointment action
func (svc Svc) CreateAppointmentAction(appointmentID string, customerID string, actionType domaintype.AppointmentActionEnum) (*domaintype.AppointmentAction, error) {
	id := uuid.New()
	createdAt := domaintype.IntTime(time.Now())
	action := domaintype.AppointmentAction{ID: id.String(), CustomerID: customerID, AppointmentID: appointmentID, ActionType: actionType, CreatedAt: createdAt}
	result := svc.db.Create(&action)
	if result.Error != nil {
		return nil, result.Error
	}
	return &action, nil
}

// NotifyCustomers creates a notify action for each upcoming appointment.
func (svc Svc) NotifyCustomers(customerIDs *[]string) (*[]domaintype.Appointment, error) {
	currentTime := domaintype.IntTime(time.Now())
	var upcomingAppointments []domaintype.Appointment
	svc.db.Where("start_time > ?", currentTime.ToInt()).Find(&upcomingAppointments)
	return &upcomingAppointments, nil
}
