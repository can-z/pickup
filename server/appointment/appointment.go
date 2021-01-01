package appointment

import (
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

// CreateAppointment creates a new appointment
func (svc Svc) CreateAppointment(time time.Time, address string, note string) (*domaintype.Appointment, error) {
	locID := uuid.New()
	aptmtID := uuid.New()
	aptmt := domaintype.Appointment{ID: aptmtID.String(), Location: domaintype.Location{ID: locID.String(), Address: address, Note: note}, Time: domaintype.IntTime(time)}
	result := svc.db.Create(&aptmt)
	if result.Error != nil {
		return nil, result.Error
	}
	return &aptmt, nil
}
