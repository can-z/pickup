package gql

import (
	"log"

	"github.com/can-z/pickup/server/backend"
	"github.com/can-z/pickup/server/domaintype"
	"github.com/can-z/pickup/server/service"
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
			"customerId": &graphql.Field{
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
func Schema() graphql.Schema {

	respMap := []domaintype.Customer{{
		CustomerID:   "12",
		PhoneNumber:  "6472617767",
		FriendlyName: "Can",
	}, {
		CustomerID:   "13",
		PhoneNumber:  "6472617767",
		FriendlyName: "Roger",
	}, {
		CustomerID:   "14",
		PhoneNumber:  "6472617767",
		FriendlyName: "Weiwei",
	}}
	fields := graphql.Fields{
		"customers": &graphql.Field{
			Type: graphql.NewList(customerType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return respMap, nil
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
					smsSvc := service.NewSmsService(
						backend.NewTwillioSmsBackend("foo", "bar"),
					)
					cus := domaintype.Customer{CustomerID: "abc-123", PhoneNumber: "6472222222", FriendlyName: "Sam the Man"}
					smsSvc.SendSms(domaintype.Sms{Customer: cus, Body: params.Args["body"].(string)})
					return true, nil
				},
			},
		}})
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery), Mutation: mutationType}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	return schema
}
