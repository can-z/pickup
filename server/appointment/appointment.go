package appointment

import (
	"errors"
	"time"

	"github.com/can-z/pickup/server/domaintype"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Svc is the service for appointment related operations
type Svc struct {
	db *gorm.DB
}

// NewAppointmentSvc creates a new svc instance
func NewAppointmentSvc(db *gorm.DB) *Svc {
	return &Svc{db: db}
}

// GetAllAppointments gets all Appointments
func (svc Svc) GetAllAppointments() []*domaintype.Appointment {

	var allAppointments []*domaintype.Appointment

	svc.db.Preload("Location").Find(&allAppointments)

	return allAppointments
}

// CreateAppointment creates a new appointment
func (svc Svc) CreateAppointment(startTime time.Time, endTime time.Time, address string, note string) (*domaintype.Appointment, error) {
	if len(address) == 0 {
		return nil, errors.New("address cannot be empty")
	}
	locID := uuid.New()
	aptmtID := uuid.New()
	aptmt := domaintype.Appointment{ID: aptmtID.String(), Location: domaintype.Location{ID: locID.String(), Address: address, Note: note}, StartTime: domaintype.IntTime(startTime), EndTime: domaintype.IntTime(endTime)}
	result := svc.db.Create(&aptmt)
	if result.Error != nil {
		return nil, result.Error
	}
	return &aptmt, nil
}
