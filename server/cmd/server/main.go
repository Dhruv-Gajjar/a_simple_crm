package main

import (
	"log"
	"log/slog"
	"os"
	"time"

	"founder-diary/internal/handlers"
	"founder-diary/internal/middlewares"
	"founder-diary/internal/repositories"
	"founder-diary/internal/routes"
	"founder-diary/internal/services"
	"founder-diary/pkg/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	port := config.GetEnv("PORT", "8080")
	gin.DisableConsoleColor()

	f, _ := os.Create("gin.log")
	logger := slog.New(slog.NewJSONHandler(f, nil))

	router := gin.New()
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))
	router.Use(middlewares.SlogMiddleware(logger))
	router.Use(gin.Recovery())

	config.ConnectDB()

	// Clients
	clientRepo := repositories.NewClientRepository(config.DB)
	clientService := services.NewClientService(clientRepo)
	clientHandler := handlers.NewClientHandler(clientService)

	// Projects
	projectRepo := repositories.NewProjectRepository(config.DB)
	projectService := services.NewProjectService(projectRepo)
	projectHandler := handlers.NewProjectHandler(projectService)

	// Notes
	noteRepo := repositories.NewNoteRepository(config.DB)
	noteService := services.NewNotesService(noteRepo)
	noteHandler := handlers.NewNotesHandler(noteService)

	// Transactions
	transactionRepo := repositories.NewTransactionRepository(config.DB)
	transactionService := services.NewTransactionService(transactionRepo)
	transactionHandler := handlers.NewTransactionHandler(transactionService)

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "CRM Backend Online",
		})
	})

	// Clients
	clientGroup := router.Group("/client")
	routes.SetupClientRoutes(clientGroup, clientHandler)

	// Projects
	projectGroup := router.Group("/project")
	routes.SetupProjectsRoutes(projectGroup, projectHandler)

	// Notes
	noteGroup := router.Group("/note")
	routes.SetupNotesRoutes(noteGroup, noteHandler)

	// Transactions
	transactionGroup := router.Group("/transaction")
	routes.SetupTransactionsRoutes(transactionGroup, transactionHandler)

	log.Printf("Server starting on port %s", port)
	router.Run(":" + port)
}
