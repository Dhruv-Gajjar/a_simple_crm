package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupClientRoutes(rg *gin.RouterGroup) {
	rg.GET("/", handlers.GetAllClients)
	rg.GET("/:id", handlers.GetClientByID)
	rg.POST("/", handlers.CreateClient)
	rg.PATCH("/:id", handlers.UpdateClient)
	rg.DELETE("/:id", handlers.DeleteClient)
}
