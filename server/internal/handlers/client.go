package handlers

import (
	dto "founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/pkg/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllClients(c *gin.Context) {
	clients := []models.Client{}

	if err := config.DB.Find(&clients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All clients fetch sucessfully.!",
		"error":   nil,
		"data":    clients,
	})
}

func GetClientById(c *gin.Context) {
	var client models.Client

	if err := config.DB.Where("id = ?", c.Param("id")).First(&client).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client Fetch sucesfully.!",
		"error":   nil,
		"data":    client,
	})
}

func CreateClient(c *gin.Context) {
	clientInput := dto.CreateClientDto{}

	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	client := models.Client{
		Name:   clientInput.Name,
		Email:  clientInput.Email,
		Status: models.Status(clientInput.Status),
		Number: clientInput.Number,
	}
	config.DB.Create(&client)

	c.JSON(http.StatusOK, gin.H{
		"message": "Client created sucessfully.!",
		"error":   nil,
		"data":    client,
	})
}

func UpdateClient(c *gin.Context) {
	var client models.Client

	if err := config.DB.Where("id = ?", c.Param("id")).First(&client).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found.!"})
	}

	clientInput := dto.ClientDto{}
	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	config.DB.Model(&client).Updates(&clientInput)

	c.JSON(http.StatusOK, gin.H{
		"message": "Client updated sucessfully.!",
		"error":   nil,
		"data":    client,
	})
}

func DeleteClient(c *gin.Context) {
	var client models.Client

	if err := config.DB.Where("id = ?", c.Param("id")).First(&client).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found.!"})
	}

	config.DB.Delete(&client)

	c.JSON(http.StatusOK, gin.H{
		"message": "Client deleted sucessfully.!",
		"error":   nil,
		"data":    client,
	})
}
