package backend

import (
	"fmt"
)

// SmsBackend interface for sending SMS
type SmsBackend interface {
	SendSms(phoneNumber string, body string)
}

// TwillioSmsBackend send SMS via Twillio
type TwillioSmsBackend struct {
	apiID     string
	apiSecret string
}

// SendSms sends a sms using Twillio.
func (be TwillioSmsBackend) SendSms(phoneNumber string, body string) {
	fmt.Printf("sending to %s: %s\n", phoneNumber, body)
	return
}

// NewTwillioSmsBackend Return a new backend instance
func NewTwillioSmsBackend(apiID string, apiSecret string) SmsBackend {
	return TwillioSmsBackend{
		apiID, apiSecret,
	}
}
