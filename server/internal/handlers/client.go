package handlers

import (
	"founder-diary/internal/models"
	"founder-diary/pkg/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetClient(c *gin.Context) {
	client := models.Client{}

	if err := config.DB.Find(&client).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client created sucessfully.!",
		"error":   nil,
		"data":    client,
	})
}

func CreateClient(c *gin.Context) {
	client := models.Client{}

	if err := c.ShouldBindJSON(&client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&client).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client created sucessfully.!",
		"error":   nil,
		"data":    nil,
	})
}
