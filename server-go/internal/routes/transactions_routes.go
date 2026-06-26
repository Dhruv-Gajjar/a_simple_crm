package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupTransactionsRoutes(rg *gin.RouterGroup, handler *handlers.TransactionHandler) {
	rg.GET("/", handler.GetAll)
	rg.GET("/:id", handler.GetByID)
	rg.POST("/", handler.Create)
	rg.PATCH("/:id", handler.Update)
	rg.DELETE("/:id", handler.Delete)
}
