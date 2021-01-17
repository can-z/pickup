package domaintype

import (
	"reflect"
	"time"

	"github.com/mitchellh/mapstructure"
)

func toTimeHookFunc() mapstructure.DecodeHookFunc {
	return func(
		f reflect.Type,
		t reflect.Type,
		data interface{}) (interface{}, error) {
		if t != reflect.TypeOf(IntTime{}) {
			return data, nil
		}
		var timeVal time.Time
		switch f.Kind() {
		case reflect.String:
			timeVal, _ = time.Parse(time.RFC3339, data.(string))
			return IntTime(timeVal), nil
		case reflect.Float64:
			timeVal = time.Unix(int64(data.(float64)), 0)
			return IntTime(timeVal), nil
		case reflect.Int64:
			timeVal = time.Unix(data.(int64), 0)
			return IntTime(timeVal), nil
		default:
			return data, nil
		}
	}
}

// Decode is the custom Decode function for mapstructure with support for IntTime
func Decode(input interface{}, result interface{}) error {
	decoder, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		Metadata: nil,
		DecodeHook: mapstructure.ComposeDecodeHookFunc(
			toTimeHookFunc()),
		Result: result,
	})
	if err != nil {
		return err
	}

	if err := decoder.Decode(input); err != nil {
		return err
	}
	return err
}
