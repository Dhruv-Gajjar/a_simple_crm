package handlers

import (
	"net/http"

	"founder-diary/internal/dtos"
	"founder-diary/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllClients(c *gin.Context) {
	clients, err := services.GetAllClients()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrive clients.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All clients fetch sucessfully.!",
		"data":    clients,
	})
}

func GetClientByID(c *gin.Context) {
	clientId := c.Param("id")
	client, err := services.GetClientById(clientId)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client Fetch sucesfully.!",
		"data":    client,
	})
}

func CreateClient(c *gin.Context) {
	clientInput := dtos.CreateClientDto{}
	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	client, err := services.CreateClient(clientInput)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create client.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client created sucessfully.!",
		"data":    client,
	})
}

func UpdateClient(c *gin.Context) {
	clientId := c.Param("id")
	clientInput := dtos.ClientDto{}

	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	client, err := services.UpdateClient(clientId, clientInput)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client updated sucessfully.!",
		"data":    client,
	})
}

func DeleteClient(c *gin.Context) {
	clientId := c.Param("id")
	err := services.DeleteClient(clientId)

	if err != nil {
		if err == gorm.ErrRecordNotFound {

			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client deleted sucessfully.!",
	})
}
