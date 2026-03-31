package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetClient(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get Client Route.!"})
}

func CreateClient(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Create Client Route.!"})
}
