package domaintype

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

// TableName implements the Tabler interface in GORM to specify table name for the AppointmentAction model
func (AppointmentAction) TableName() string {
	return "appointment_action"
}
