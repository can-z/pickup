package gql

import (
	"log"

	"github.com/can-z/pickup/server/customer"
	"github.com/can-z/pickup/server/domaintype"
	"github.com/can-z/pickup/server/sms"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/graphql-go/graphql"
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

var customerType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Customer",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.String,
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

	fields := graphql.Fields{
		"customers": &graphql.Field{
			Type: graphql.NewList(customerType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return customerSvc.GetAllCustomers(), nil
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
					return customerSvc.CreateCustomer(&domaintype.Customer{FriendlyName: params.Args["friendlyName"].(string), PhoneNumber: params.Args["phoneNumber"].(string)}), nil
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
