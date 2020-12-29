package main

import (
	"github.com/can-z/pickup/server/dbmigration"
	"github.com/can-z/pickup/server/domaintype"
)

func main() {
	appConfig := domaintype.AppConfig{
		DatabaseFile: "local.db",
	}
	dbmigration.ApplyMigration(appConfig)
}
