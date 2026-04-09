package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupClientRoutes(rg *gin.RouterGroup, clientHandler *handlers.ClientHandler) {
	rg.GET("/", clientHandler.GetAllClients)
	rg.GET("/:id", clientHandler.GetClientByID)
	rg.POST("/", clientHandler.CreateClient)
	rg.PATCH("/:id", clientHandler.UpdateClient)
	rg.DELETE("/:id", clientHandler.DeleteClient)
}
