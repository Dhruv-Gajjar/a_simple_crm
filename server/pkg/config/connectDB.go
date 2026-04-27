package config

import (
	"fmt"
	"founder-diary/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	host := GetEnv("DB_HOST", "")
	user := GetEnv("DB_USER", "")
	passowrd := GetEnv("DB_PASSWORD", "")
	name := GetEnv("DB_NAME", "")
	port := GetEnv("DB_PORT", "")

	dns := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, passowrd, name, port)
	db, err := gorm.Open(postgres.Open(dns), &gorm.Config{})

	if err != nil {
		fmt.Printf("Error connectng to the database: %v", err.Error())
	}

	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	db.AutoMigrate(&models.Clients{}, &models.Projects{}, &models.Notes{}, &models.Transactions{}, &models.Invoices{})

	fmt.Print("Sucessfully connected to the DB.\n")

	DB = db
}
