package main

import (
	"fmt"
	"founder-diary/pkg/config"
)

func main() {
	config.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	config.DB.AutoMigrate()
	fmt.Println("👍 Migration complete")
}
