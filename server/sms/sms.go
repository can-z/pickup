package sms

import (
	"fmt"

	"github.com/can-z/pickup/server/domaintype"
)

// Svc is the domain service interface for sending SMS
type Svc struct {
}

// SendSms sends a sms.
func (svc Svc) SendSms(sms domaintype.Sms) {
	fmt.Printf("sending to %s: %s\n", sms.Customer.PhoneNumber, sms.Body)
	return
}

// NewSmsSvc returns a new backend instance
func NewSmsSvc() Svc {
	return Svc{}
}
