package gql

import (
	"errors"
	"log"
	"strconv"
	"time"

	"github.com/can-z/pickup/server/appointment"
	"github.com/can-z/pickup/server/customer"
	"github.com/can-z/pickup/server/domaintype"
	"github.com/can-z/pickup/server/sms"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/graphql/language/ast"
)

var smsType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Sms",
		Fields: graphql.Fields{
			"username": &graphql.Field{
				Type: graphql.String,
			},
			"body": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

var intTimeType = graphql.NewScalar(graphql.ScalarConfig{
	Name:        "IntTimeType",
	Description: "The `IntTimeType` scalar type represents a time in UNIX timestamp.",
	// Serialize serializes `CustomID` to int.
	Serialize: func(value interface{}) interface{} {
		switch value := value.(type) {
		case domaintype.IntTime:
			return int(time.Time(value).Unix())
		case *domaintype.IntTime:
			v := *value
			return int(time.Time(v).Unix())
		default:
			return nil
		}
	},
	// ParseValue parses GraphQL variables from `int` to `IntTime`.
	ParseValue: func(value interface{}) interface{} {
		switch value := value.(type) {
		case int:
			return domaintype.IntTime(time.Unix(int64(value), 0))
		case *int:
			return domaintype.IntTime(time.Unix(int64(*value), 0))
		default:
			return nil
		}
	},
	// ParseLiteral parses GraphQL AST value to `IntTime`.
	ParseLiteral: func(valueAST ast.Value) interface{} {
		switch valueAST := valueAST.(type) {
		case *ast.IntValue:
			intValue, _ := strconv.Atoi(valueAST.Value)
			return domaintype.IntTime(time.Unix(int64(intValue), 0))
		default:
			return nil
		}
	},
})

var customerType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Customer",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"phoneNumber": &graphql.Field{
				Type: graphql.String,
			},
			"friendlyName": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

var locationType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Location",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"address": &graphql.Field{
				Type: graphql.String,
			},
			"note": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

var appointmentType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Appointment",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"time": &graphql.Field{
				Type: intTimeType,
			},
			"customer": &graphql.Field{
				Type: customerType,
			},
			"location": &graphql.Field{
				Type: locationType,
			},
		},
	},
)

// Schema golint
func Schema(appConfig domaintype.AppConfig) (*graphql.Schema, *gorm.DB) {
	databaseFileName := appConfig.DatabaseFile
	db, err := gorm.Open(sqlite.Open(databaseFileName), &gorm.Config{})
	if appConfig.IsTestingMode {
		db = db.Begin()
	}
	if err != nil {
		panic("failed to connect database")
	}
	customerSvc := customer.NewCustomerSvc(db)
	appointmentSvc := appointment.NewAppointmentSvc(db)

	fields := graphql.Fields{
		"customers": &graphql.Field{
			Type: graphql.NewList(customerType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return customerSvc.GetAllCustomers(), nil
			},
		},
		"customer": &graphql.Field{
			Type: customerType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				return customerSvc.GetCustomer(params.Args["id"].(string))
			},
		},
	}
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}

	var mutationType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"sendSms": &graphql.Field{
				Type:        graphql.Boolean,
				Description: "Send a sms to a user",
				Args: graphql.FieldConfigArgument{
					"username": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"body": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					smsSvc := sms.NewSmsSvc()
					cus := domaintype.Customer{ID: "abc-123", PhoneNumber: "6472222222", FriendlyName: "Sam the Man"}
					smsSvc.SendSms(domaintype.Sms{Customer: cus, Body: params.Args["body"].(string)})
					return true, nil
				},
			},
			"createUser": &graphql.Field{
				Type:        customerType,
				Description: "Create a new user",
				Args: graphql.FieldConfigArgument{
					"friendlyName": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"phoneNumber": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					return customerSvc.CreateCustomer(&domaintype.Customer{FriendlyName: params.Args["friendlyName"].(string), PhoneNumber: params.Args["phoneNumber"].(string)})
				},
			},
			"createAppointment": &graphql.Field{
				Type:        appointmentType,
				Description: "Create a new appointment",
				Args: graphql.FieldConfigArgument{
					"time": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
					"address": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"note": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					time := time.Unix(int64(params.Args["time"].(int)), 0)
					return appointmentSvc.CreateAppointment(time, params.Args["address"].(string), params.Args["note"].(string))
				},
			},
			"createAppointmentAction": &graphql.Field{
				Type:        appointmentType,
				Description: "Create a new appointment action",
				Args: graphql.FieldConfigArgument{
					"customerID": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"action": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					cus, err := customerSvc.GetCustomer(params.Args["customerID"].(string))
					if err != nil {
						return nil, errors.New("customerID does not exist")
					}
					return &domaintype.AppointmentAction{Customer: *cus}, nil
				},
			},
		}})
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery), Mutation: mutationType}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	return &schema, db
}
