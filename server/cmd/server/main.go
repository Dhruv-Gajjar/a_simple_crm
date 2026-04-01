package main

import (
	"log"
	"log/slog"
	"os"

	"founder-diary/internal/middlewares"
	"founder-diary/internal/routes"
	"founder-diary/pkg/config"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	port := config.GetEnv("PORT", "8080")
	gin.DisableConsoleColor()

	f, _ := os.Create("gin.log")
	logger := slog.New(slog.NewJSONHandler(f, nil))

	router := gin.New()
	router.Use(middlewares.SlogMiddleware(logger))
	router.Use(gin.Recovery())

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
