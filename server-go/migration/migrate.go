package main

// import (
// 	"fmt"
// 	"founder-diary/internal/models"
// 	"founder-diary/pkg/config"
// )
//
// func main() {
// 	config.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
// 	config.DB.Exec("CREATE TYPE status AS ENUM ('active', 'in_active', 'lead', 'rejected');")
// 	config.DB.AutoMigrate(&models.Client{})
// 	fmt.Println("👍 Migration complete")
// }
