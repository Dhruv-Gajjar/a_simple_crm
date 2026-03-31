package main

import (
	"founder-diary/internal/routes"
	"founder-diary/pkg/config"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()

	port := config.GetEnv("PORT", "8080")

	router := gin.Default()

	config.ConnectDB()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "CRM Backend Online",
		})
	})
	clientGroup := router.Group("/client")
	routes.SetupClientRoutes(clientGroup)

	log.Printf("Server starting on port %s", port)
	router.Run(":" + port)
}
