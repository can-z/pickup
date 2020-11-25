package service

import (
	"github.com/can-z/pickup/server/backend"
	"github.com/can-z/pickup/server/domaintype"
)

// SmsService is the domain service interface for sending SMS
type SmsService interface {
	SendSms(domaintype.Sms)
}

// ProductionSmsService is the domain sms service in prod
type ProductionSmsService struct {
	smsBackend backend.SmsBackend
}

// SendSms is the service layer function to send a sms.
func (svc ProductionSmsService) SendSms(sms domaintype.Sms) {
	svc.smsBackend.SendSms(sms.Customer.PhoneNumber, sms.Body)
}

// NewSmsService Return a new backend instance
func NewSmsService(smsBackend backend.SmsBackend) SmsService {
	return ProductionSmsService{smsBackend: smsBackend}
}
