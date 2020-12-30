package dbmigration

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/can-z/pickup/server/domaintype"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file" // needed for the file source type
)

// ApplyMigration applies all migration steps.
func ApplyMigration(appConfig domaintype.AppConfig) {
	db, err := sql.Open("sqlite3", appConfig.DatabaseFile)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("migration folder path: %s\n", appConfig.MigrationFolderPath)
	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s/dbmigration/steps", appConfig.MigrationFolderPath),
		"sqlite", driver)
	if err != nil {
		log.Fatal(err)
	}
	m.Up()
	fmt.Println("db migration complete")
}
